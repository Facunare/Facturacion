import { facturaRepository } from "../repositories/factura.repository";
import { MarcarFacturadaInput, ListPendientesQuery } from "../validators/factura.validators";
import { ApiError } from "../utils/ApiError";
import { n8nService } from "./n8n.service";
export const facturaService = {
  listPendientes(query: ListPendientesQuery) {
    return facturaRepository.listPendientes(query);
  },

  async marcarFacturada(id: number, input: MarcarFacturadaInput) {
  const facturaExistente = await facturaRepository.findById(id);

  if (!facturaExistente) {
    throw ApiError.notFound("Factura no encontrada");
  }

  if (facturaExistente.estado === "FACTURADO") {
    throw ApiError.conflict("Esta atención ya fue facturada");
  }

  const facturaActualizada = await facturaRepository.marcarFacturada(
    id,
    input
  );

  await n8nService.notificarFacturacion({
    facturacionId: facturaActualizada.id,
    numeroFactura: facturaActualizada.numeroFactura!,
    fechaFactura: facturaActualizada.fechaFactura!.toISOString(),
    importeFacturado: facturaActualizada.importeFacturado!,
    cliente: {
      id: facturaActualizada.atencion.cliente.id,
      nombre: facturaActualizada.atencion.cliente.nombre,
      apellido: facturaActualizada.atencion.cliente.apellido,
      nombreCompleto: `${facturaActualizada.atencion.cliente.nombre} ${facturaActualizada.atencion.cliente.apellido}`,
      dni: facturaActualizada.atencion.cliente.dni,
      email: facturaActualizada.atencion.cliente.email,
      telefono: facturaActualizada.atencion.cliente.telefono,
      obraSocial: facturaActualizada.atencion.cliente.obraSocial,
    },
    atencion: {
      id: facturaActualizada.atencion.id,
      fecha: facturaActualizada.atencion.fecha.toISOString(),
      profesional: facturaActualizada.atencion.profesional,
      prestacion: facturaActualizada.atencion.prestacion,
      importeOriginal: facturaActualizada.atencion.importe,
    },
  });

  return facturaActualizada;
},
  async cancelar(id: number, isAdmin: boolean) {
    if (!isAdmin) throw ApiError.forbidden("Solo un administrador puede cancelar facturas");
    const factura = await facturaRepository.findById(id);
    if (!factura) throw ApiError.notFound("Factura no encontrada");
    return facturaRepository.cancelar(id);
  },

  async reabrir(id: number, isAdmin: boolean) {
    if (!isAdmin) throw ApiError.forbidden("Solo un administrador puede reabrir una factura");
    const factura = await facturaRepository.findById(id);
    if (!factura) throw ApiError.notFound("Factura no encontrada");
    return facturaRepository.reabrir(id);
  },
};
