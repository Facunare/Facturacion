import ExcelJS from "exceljs";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";

// Alias de columnas tolerados (todo se compara en lowercase y sin espacios extra)
// para poder importar planillas con encabezados levemente distintos.
const COLUMN_ALIASES: Record<string, string[]> = {
  nombre: ["nombre", "nombres", "first name", "firstname"],
  apellido: ["apellido", "apellidos", "last name", "lastname"],
  dni: ["dni", "documento", "nro documento", "número de documento", "cuil", "cuit"],
  obraSocial: ["obra social", "obrasocial", "cobertura", "prepaga", "seguro"],
  telefono: ["telefono", "teléfono", "celular", "phone"],
  email: ["email", "correo", "mail", "e-mail"],
  observaciones: ["observaciones", "notas", "comentarios"],
};

function normalizeHeader(header: string): string {
  return header.toString().trim().toLowerCase();
}

function buildColumnMap(headers: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  const normalizedHeaders = headers.map(normalizeHeader);

  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    const idx = normalizedHeaders.findIndex((h) => aliases.includes(h));
    if (idx !== -1) map[field] = idx;
  }

  return map;
}

export interface ImportRowResult {
  row: number;
  status: "creado" | "actualizado" | "omitido";
  dni?: string;
  motivo?: string;
}

export const importService = {
  async importPacientesFromExcel(buffer: Buffer) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);
    const sheet = workbook.worksheets[0];

    if (!sheet) throw ApiError.badRequest("El archivo Excel no tiene hojas con datos");

    const headerRow = sheet.getRow(1);
    const headers: string[] = [];
    headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      headers[colNumber - 1] = cell.value ? String(cell.value) : "";
    });

    const columnMap = buildColumnMap(headers);

    if (columnMap.nombre === undefined || columnMap.dni === undefined) {
      throw ApiError.badRequest(
        "No se pudieron mapear las columnas requeridas (nombre y DNI). Verificá los encabezados del Excel."
      );
    }

    const results: ImportRowResult[] = [];
    let creados = 0;
    let actualizados = 0;
    let omitidos = 0;

    for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
      const row = sheet.getRow(rowNumber);
      if (row.cellCount === 0) continue;

      const getValue = (field: string): string | undefined => {
        const idx = columnMap[field];
        if (idx === undefined) return undefined;
        const cell = row.getCell(idx + 1);
        return cell.value !== null && cell.value !== undefined ? String(cell.value).trim() : undefined;
      };

      const nombre = getValue("nombre");
      const dni = getValue("dni");

      if (!nombre || !dni) {
        results.push({ row: rowNumber, status: "omitido", motivo: "Falta nombre o DNI" });
        omitidos++;
        continue;
      }

      const data = {
        nombre,
        apellido: getValue("apellido") || "-",
        dni,
        obraSocial: getValue("obraSocial") || null,
        telefono: getValue("telefono") || null,
        email: getValue("email") || null,
        observaciones: getValue("observaciones") || null,
      };

      const existing = await prisma.cliente.findUnique({ where: { dni } });

      if (existing) {
        await prisma.cliente.update({ where: { dni }, data });
        results.push({ row: rowNumber, status: "actualizado", dni });
        actualizados++;
      } else {
        await prisma.cliente.create({ data });
        results.push({ row: rowNumber, status: "creado", dni });
        creados++;
      }
    }

    return {
      totalFilas: results.length,
      creados,
      actualizados,
      omitidos,
      columnasDetectadas: columnMap,
      detalle: results,
    };
  },
};
