import { z } from "zod";

export const marcarFacturadaSchema = z.object({
  numeroFactura: z.string().min(1, "El número de factura es requerido"),
  fechaFactura: z.string().min(1, "La fecha es requerida"),
  importeFacturado: z.coerce.number({ invalid_type_error: "Ingresá un importe" }).positive("El importe debe ser mayor a 0"),
});

export type MarcarFacturadaFormData = z.infer<typeof marcarFacturadaSchema>;
