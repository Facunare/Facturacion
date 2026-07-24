import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { ListClientesQuery } from "../validators/cliente.validators";

function buildWhere(query: Pick<ListClientesQuery, "search" | "obraSocial">): Prisma.ClienteWhereInput {
  const where: Prisma.ClienteWhereInput = {};

  if (query.search) {
    where.OR = [
      { nombre: { contains: query.search, mode: "insensitive" } },
      { apellido: { contains: query.search, mode: "insensitive" } },
      { dni: { contains: query.search, mode: "insensitive" } },
      { obraSocial: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.obraSocial) {
    where.obraSocial = { equals: query.obraSocial, mode: "insensitive" };
  }

  return where;
}

export const clienteRepository = {
  async list(query: ListClientesQuery) {
    const where = buildWhere(query);
    const skip = (query.page - 1) * query.pageSize;

    const [data, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        skip,
        take: query.pageSize,
        orderBy: { [query.sortBy]: query.sortDir },
        include: { _count: { select: { atenciones: true } } },
      }),
      prisma.cliente.count({ where }),
    ]);

    return { data, total, page: query.page, pageSize: query.pageSize };
  },

  findById(id: number) {
    return prisma.cliente.findUnique({
      where: { id },
      include: {
        atenciones: {
          orderBy: { fecha: "desc" },
          include: { factura: true },
        },
      },
    });
  },

  findByDni(dni: string) {
    return prisma.cliente.findUnique({ where: { dni } });
  },

  create(data: Prisma.ClienteCreateInput) {
    return prisma.cliente.create({ data });
  },

  update(id: number, data: Prisma.ClienteUpdateInput) {
    return prisma.cliente.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.cliente.delete({ where: { id } });
  },

  count() {
    return prisma.cliente.count();
  },

  distinctObrasSociales() {
    return prisma.cliente.findMany({
      distinct: ["obraSocial"],
      select: { obraSocial: true },
      where: { obraSocial: { not: null } },
    });
  },
};
