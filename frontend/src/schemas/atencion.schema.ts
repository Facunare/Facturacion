import { z } from "zod";

export const atencionSchema = z.object({
  clienteId: z.coerce.number({ invalid_type_error: "Seleccioná un paciente" }).positive("Seleccioná un paciente"),
  fecha: z.string().min(1, "La fecha es requerida"),
  profesional: z.string().min(1, "El profesional es requerido"),
  prestacion: z.string().min(1, "La prestación es requerida"),
  importe: z.coerce.number({ invalid_type_error: "Ingresá un importe" }).positive("El importe debe ser mayor a 0"),
  observaciones: z.string().optional(),
});

export type AtencionFormData = z.infer<typeof atencionSchema>;
