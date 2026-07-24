import { facturaRepository } from "../repositories/factura.repository";
import { MarcarFacturadaInput, ListPendientesQuery } from "../validators/factura.validators";
import { ApiError } from "../utils/ApiError";

export const facturaService = {
  listPendientes(query: ListPendientesQuery) {
    return facturaRepository.listPendientes(query);
  },

  async marcarFacturada(id: number, input: MarcarFacturadaInput) {
    const factura = await facturaRepository.findById(id);
    if (!factura) throw ApiError.notFound("Factura no encontrada");
    if (factura.estado === "FACTURADO") {
      throw ApiError.conflict("Esta atención ya fue facturada");
    }
    return facturaRepository.marcarFacturada(id, input);
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
