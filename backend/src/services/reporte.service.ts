import ExcelJS from "exceljs";
import { prisma } from "../config/prisma";
import { facturaRepository } from "../repositories/factura.repository";

const HEADER_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF1A56DB" },
};

function styleHeader(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = HEADER_FILL;
    cell.alignment = { vertical: "middle", horizontal: "left" };
  });
}

function autoFitColumns(sheet: ExcelJS.Worksheet) {
  sheet.columns.forEach((column) => {
    let maxLength = 10;
    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const len = cell.value ? String(cell.value).length : 0;
      if (len > maxLength) maxLength = len;
    });
    column.width = Math.min(maxLength + 3, 45);
  });
}

async function buildWorkbook() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Chequeo Facturación";
  workbook.created = new Date();
  return workbook;
}

export const reporteService = {
  async exportPacientes(): Promise<ExcelJS.Buffer> {
    const workbook = await buildWorkbook();
    const sheet = workbook.addWorksheet("Pacientes");

    sheet.columns = [
      { header: "ID", key: "id" },
      { header: "Nombre", key: "nombre" },
      { header: "Apellido", key: "apellido" },
      { header: "DNI", key: "dni" },
      { header: "Obra Social", key: "obraSocial" },
      { header: "Teléfono", key: "telefono" },
      { header: "Email", key: "email" },
      { header: "Fecha de alta", key: "createdAt" },
    ];
    styleHeader(sheet.getRow(1));

    const pacientes = await prisma.cliente.findMany({ orderBy: { apellido: "asc" } });
    pacientes.forEach((p) => {
      sheet.addRow({
        id: p.id,
        nombre: p.nombre,
        apellido: p.apellido,
        dni: p.dni,
        obraSocial: p.obraSocial || "-",
        telefono: p.telefono || "-",
        email: p.email || "-",
        createdAt: p.createdAt.toLocaleDateString("es-AR"),
      });
    });

    autoFitColumns(sheet);
    return workbook.xlsx.writeBuffer();
  },

  async exportAtenciones(): Promise<ExcelJS.Buffer> {
    const workbook = await buildWorkbook();
    const sheet = workbook.addWorksheet("Atenciones");

    sheet.columns = [
      { header: "ID", key: "id" },
      { header: "Fecha", key: "fecha" },
      { header: "Paciente", key: "paciente" },
      { header: "DNI", key: "dni" },
      { header: "Profesional", key: "profesional" },
      { header: "Prestación", key: "prestacion" },
      { header: "Importe", key: "importe" },
      { header: "Estado", key: "estado" },
    ];
    styleHeader(sheet.getRow(1));

    const atenciones = await prisma.atencion.findMany({
      include: { cliente: true, factura: true },
      orderBy: { fecha: "desc" },
    });

    atenciones.forEach((a) => {
      sheet.addRow({
        id: a.id,
        fecha: a.fecha.toLocaleDateString("es-AR"),
        paciente: `${a.cliente.apellido}, ${a.cliente.nombre}`,
        dni: a.cliente.dni,
        profesional: a.profesional,
        prestacion: a.prestacion,
        importe: a.importe,
        estado: a.factura?.estado || "PENDIENTE",
      });
    });

    autoFitColumns(sheet);
    return workbook.xlsx.writeBuffer();
  },

  async exportFacturadas(): Promise<ExcelJS.Buffer> {
    const workbook = await buildWorkbook();
    const sheet = workbook.addWorksheet("Facturadas");

    sheet.columns = [
      { header: "N° Factura", key: "numeroFactura" },
      { header: "Fecha Factura", key: "fechaFactura" },
      { header: "Paciente", key: "paciente" },
      { header: "DNI", key: "dni" },
      { header: "Prestación", key: "prestacion" },
      { header: "Profesional", key: "profesional" },
      { header: "Importe Facturado", key: "importeFacturado" },
    ];
    styleHeader(sheet.getRow(1));

    const facturas = await facturaRepository.findAllFacturadas();
    facturas.forEach((f) => {
      sheet.addRow({
        numeroFactura: f.numeroFactura,
        fechaFactura: f.fechaFactura?.toLocaleDateString("es-AR"),
        paciente: `${f.atencion.cliente.apellido}, ${f.atencion.cliente.nombre}`,
        dni: f.atencion.cliente.dni,
        prestacion: f.atencion.prestacion,
        profesional: f.atencion.profesional,
        importeFacturado: f.importeFacturado,
      });
    });

    autoFitColumns(sheet);
    return workbook.xlsx.writeBuffer();
  },

  async exportPendientes(): Promise<ExcelJS.Buffer> {
    const workbook = await buildWorkbook();
    const sheet = workbook.addWorksheet("Pendientes");

    sheet.columns = [
      { header: "Paciente", key: "paciente" },
      { header: "DNI", key: "dni" },
      { header: "Obra Social", key: "obraSocial" },
      { header: "Fecha Atención", key: "fecha" },
      { header: "Profesional", key: "profesional" },
      { header: "Prestación", key: "prestacion" },
      { header: "Importe", key: "importe" },
    ];
    styleHeader(sheet.getRow(1));

    const pendientes = await facturaRepository.findAllPendientesForExport();
    pendientes.forEach((f) => {
      sheet.addRow({
        paciente: `${f.atencion.cliente.apellido}, ${f.atencion.cliente.nombre}`,
        dni: f.atencion.cliente.dni,
        obraSocial: f.atencion.cliente.obraSocial || "-",
        fecha: f.atencion.fecha.toLocaleDateString("es-AR"),
        profesional: f.atencion.profesional,
        prestacion: f.atencion.prestacion,
        importe: f.atencion.importe,
      });
    });

    autoFitColumns(sheet);
    return workbook.xlsx.writeBuffer();
  },

  async exportIngresosPorMes(): Promise<ExcelJS.Buffer> {
    const workbook = await buildWorkbook();
    const sheet = workbook.addWorksheet("Ingresos por mes");

    sheet.columns = [
      { header: "Mes", key: "mes" },
      { header: "Total facturado", key: "total" },
    ];
    styleHeader(sheet.getRow(1));

    const rows = await facturaRepository.ingresosPorMes(24);
    rows.forEach((r) => sheet.addRow({ mes: r.mes, total: Number(r.total) }));

    autoFitColumns(sheet);
    return workbook.xlsx.writeBuffer();
  },
};
