import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { ListAtencionesQuery } from "../validators/atencion.validators";

function buildWhere(query: Partial<ListAtencionesQuery>): Prisma.AtencionWhereInput {
  const where: Prisma.AtencionWhereInput = {};

  if (query.fechaDesde || query.fechaHasta) {
    where.fecha = {};
    if (query.fechaDesde) where.fecha.gte = query.fechaDesde;
    if (query.fechaHasta) where.fecha.lte = query.fechaHasta;
  }

  if (query.profesional) {
    where.profesional = { contains: query.profesional, mode: "insensitive" };
  }

  if (query.clienteId) {
    where.clienteId = query.clienteId;
  }

  if (query.estado) {
    where.factura = { estado: query.estado };
  }

  return where;
}

export const atencionRepository = {
  async list(query: ListAtencionesQuery) {
    const where = buildWhere(query);
    const skip = (query.page - 1) * query.pageSize;

    const [data, total] = await Promise.all([
      prisma.atencion.findMany({
        where,
        skip,
        take: query.pageSize,
        orderBy: { [query.sortBy]: query.sortDir },
        include: { cliente: true, factura: true },
      }),
      prisma.atencion.count({ where }),
    ]);

    return { data, total, page: query.page, pageSize: query.pageSize };
  },

  findById(id: number) {
    return prisma.atencion.findUnique({
      where: { id },
      include: { cliente: true, factura: true },
    });
  },

  // Crea la atención y su factura pendiente asociada en una sola transacción.
  createWithFacturaPendiente(data: Prisma.AtencionUncheckedCreateInput) {
    return prisma.$transaction(async (tx) => {
      const atencion = await tx.atencion.create({ data });
      await tx.factura.create({
        data: { atencionId: atencion.id, estado: "PENDIENTE" },
      });
      return tx.atencion.findUniqueOrThrow({
        where: { id: atencion.id },
        include: { cliente: true, factura: true },
      });
    });
  },

  update(id: number, data: Prisma.AtencionUncheckedUpdateInput) {
    return prisma.atencion.update({
      where: { id },
      data,
      include: { cliente: true, factura: true },
    });
  },

  delete(id: number) {
    return prisma.atencion.delete({ where: { id } });
  },

  count() {
    return prisma.atencion.count();
  },

  distinctProfesionales() {
    return prisma.atencion.findMany({
      distinct: ["profesional"],
      select: { profesional: true },
    });
  },
};
