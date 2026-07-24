import { z } from "zod";

export const createAtencionSchema = z.object({
  clienteId: z.coerce.number().int().positive("Seleccioná un paciente"),
  fecha: z.coerce.date(),
  profesional: z.string().min(1, "El profesional es requerido"),
  prestacion: z.string().min(1, "La prestación es requerida"),
  importe: z.coerce.number().positive("El importe debe ser mayor a 0"),
  observaciones: z.string().optional().nullable(),
});

export const updateAtencionSchema = createAtencionSchema.partial();

export const listAtencionesQuerySchema = z.object({
  fechaDesde: z.coerce.date().optional(),
  fechaHasta: z.coerce.date().optional(),
  profesional: z.string().optional(),
  estado: z.enum(["PENDIENTE", "FACTURADO", "CANCELADO"]).optional(),
  clienteId: z.coerce.number().int().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(["fecha", "importe", "createdAt"]).default("fecha"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateAtencionInput = z.infer<typeof createAtencionSchema>;
export type UpdateAtencionInput = z.infer<typeof updateAtencionSchema>;
export type ListAtencionesQuery = z.infer<typeof listAtencionesQuerySchema>;
