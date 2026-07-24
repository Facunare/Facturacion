import { z } from "zod";

export const marcarFacturadaSchema = z.object({
  numeroFactura: z.string().min(1, "El número de factura es requerido"),
  fechaFactura: z.coerce.date(),
  importeFacturado: z.coerce.number().positive("El importe facturado debe ser mayor a 0"),
});

export const listPendientesQuerySchema = z.object({
  search: z.string().optional(),
  profesional: z.string().optional(),
  fechaDesde: z.coerce.date().optional(),
  fechaHasta: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export type MarcarFacturadaInput = z.infer<typeof marcarFacturadaSchema>;
export type ListPendientesQuery = z.infer<typeof listPendientesQuerySchema>;
