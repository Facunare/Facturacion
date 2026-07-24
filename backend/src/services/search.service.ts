import { prisma } from "../config/prisma";

export const searchService = {
  async globalSearch(term: string) {
    if (!term || term.trim().length < 2) {
      return { clientes: [], atenciones: [], facturas: [] };
    }

    const [clientes, atenciones, facturas] = await Promise.all([
      prisma.cliente.findMany({
        where: {
          OR: [
            { nombre: { contains: term, mode: "insensitive" } },
            { apellido: { contains: term, mode: "insensitive" } },
            { dni: { contains: term, mode: "insensitive" } },
          ],
        },
        take: 8,
      }),
      prisma.atencion.findMany({
        where: { prestacion: { contains: term, mode: "insensitive" } },
        include: { cliente: true, factura: true },
        take: 8,
      }),
      prisma.factura.findMany({
        where: { numeroFactura: { contains: term, mode: "insensitive" } },
        include: { atencion: { include: { cliente: true } } },
        take: 8,
      }),
    ]);

    return { clientes, atenciones, facturas };
  },
};
