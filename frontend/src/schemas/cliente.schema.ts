import { z } from "zod";

export const clienteSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  apellido: z.string().min(1, "El apellido es requerido"),
  dni: z.string().min(1, "El DNI es requerido"),
  obraSocial: z.string().optional(),
  telefono: z.string().optional(),
  email: z.union([z.string().email("Email inválido"), z.literal("")]).optional(),
  observaciones: z.string().optional(),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;
