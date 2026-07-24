import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { ListPendientesQuery } from "../validators/factura.validators";

export const facturaRepository = {
  async listPendientes(query: ListPendientesQuery) {
    const where: Prisma.FacturaWhereInput = { estado: "PENDIENTE" };

    const atencionFilter: Prisma.AtencionWhereInput = {};
    if (query.profesional) {
      atencionFilter.profesional = { contains: query.profesional, mode: "insensitive" };
    }
    if (query.fechaDesde || query.fechaHasta) {
      atencionFilter.fecha = {};
      if (query.fechaDesde) atencionFilter.fecha.gte = query.fechaDesde;
      if (query.fechaHasta) atencionFilter.fecha.lte = query.fechaHasta;
    }
    if (query.search) {
      atencionFilter.cliente = {
        OR: [
          { nombre: { contains: query.search, mode: "insensitive" } },
          { apellido: { contains: query.search, mode: "insensitive" } },
          { dni: { contains: query.search, mode: "insensitive" } },
        ],
      };
    }
    if (Object.keys(atencionFilter).length > 0) {
      where.atencion = atencionFilter;
    }

    const skip = (query.page - 1) * query.pageSize;

    const [data, total] = await Promise.all([
      prisma.factura.findMany({
        where,
        skip,
        take: query.pageSize,
        orderBy: { atencion: { fecha: "asc" } },
        include: { atencion: { include: { cliente: true } } },
      }),
      prisma.factura.count({ where }),
    ]);

    return { data, total, page: query.page, pageSize: query.pageSize };
  },

  findById(id: number) {
    return prisma.factura.findUnique({
      where: { id },
      include: { atencion: { include: { cliente: true } } },
    });
  },

  marcarFacturada(
    id: number,
    data: { numeroFactura: string; fechaFactura: Date; importeFacturado: number }
  ) {
    return prisma.factura.update({
      where: { id },
      data: { ...data, estado: "FACTURADO" },
      include: { atencion: { include: { cliente: true } } },
    });
  },

  cancelar(id: number) {
    return prisma.factura.update({
      where: { id },
      data: { estado: "CANCELADO" },
      include: { atencion: { include: { cliente: true } } },
    });
  },

  reabrir(id: number) {
    return prisma.factura.update({
      where: { id },
      data: { estado: "PENDIENTE", numeroFactura: null, fechaFactura: null, importeFacturado: null },
      include: { atencion: { include: { cliente: true } } },
    });
  },

  countByEstado(estado: "PENDIENTE" | "FACTURADO" | "CANCELADO") {
    return prisma.factura.count({ where: { estado } });
  },

  sumImportePendiente() {
    return prisma.atencion.aggregate({
      _sum: { importe: true },
      where: { factura: { estado: "PENDIENTE" } },
    });
  },

  sumFacturadoEnRango(desde: Date, hasta: Date) {
    return prisma.factura.aggregate({
      _sum: { importeFacturado: true },
      where: { estado: "FACTURADO", fechaFactura: { gte: desde, lte: hasta } },
    });
  },

  ingresosPorMes(meses: number) {
    return prisma.$queryRaw<{ mes: string; total: number }[]>`
      SELECT to_char(date_trunc('month', "fecha_factura"), 'YYYY-MM') AS mes,
             COALESCE(SUM("importe_facturado"), 0)::float AS total
      FROM facturas
      WHERE estado = 'FACTURADO'
        AND "fecha_factura" >= (CURRENT_DATE - INTERVAL '1 month' * ${meses})
      GROUP BY 1
      ORDER BY 1 ASC;
    `;
  },

  findAllFacturadas() {
    return prisma.factura.findMany({
      where: { estado: "FACTURADO" },
      include: { atencion: { include: { cliente: true } } },
      orderBy: { fechaFactura: "desc" },
    });
  },

  findAllPendientesForExport() {
    return prisma.factura.findMany({
      where: { estado: "PENDIENTE" },
      include: { atencion: { include: { cliente: true } } },
      orderBy: { atencion: { fecha: "asc" } },
    });
  },

  searchByNumero(term: string) {
    return prisma.factura.findMany({
      where: { numeroFactura: { contains: term, mode: "insensitive" } },
      include: { atencion: { include: { cliente: true } } },
      take: 10,
    });
  },
};
