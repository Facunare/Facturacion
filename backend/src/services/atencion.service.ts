import { atencionRepository } from "../repositories/atencion.repository";
import { clienteRepository } from "../repositories/cliente.repository";
import { CreateAtencionInput, ListAtencionesQuery, UpdateAtencionInput } from "../validators/atencion.validators";
import { ApiError } from "../utils/ApiError";

export const atencionService = {
  list(query: ListAtencionesQuery) {
    return atencionRepository.list(query);
  },

  async getById(id: number) {
    const atencion = await atencionRepository.findById(id);
    if (!atencion) throw ApiError.notFound("Atención no encontrada");
    return atencion;
  },

  async create(input: CreateAtencionInput) {
    const cliente = await clienteRepository.findById(input.clienteId);
    if (!cliente) throw ApiError.badRequest("El paciente seleccionado no existe");

    // Al crear la atención se genera automáticamente su factura en estado
    // PENDIENTE, que es lo que alimenta la pantalla de Facturación.
    return atencionRepository.createWithFacturaPendiente({
      clienteId: input.clienteId,
      fecha: input.fecha,
      profesional: input.profesional,
      prestacion: input.prestacion,
      importe: input.importe,
      observaciones: input.observaciones || null,
    });
  },

  async update(id: number, input: UpdateAtencionInput) {
    const atencion = await this.getById(id);

    if (atencion.factura?.estado === "FACTURADO") {
      throw ApiError.badRequest("No se puede editar una atención ya facturada. Cancelá la factura primero.");
    }

    return atencionRepository.update(id, input);
  },

  async remove(id: number, isAdmin: boolean) {
    if (!isAdmin) throw ApiError.forbidden("Solo un administrador puede eliminar atenciones");
    await this.getById(id);
    return atencionRepository.delete(id);
  },

  async profesionales() {
    const rows = await atencionRepository.distinctProfesionales();
    return rows.map((r) => r.profesional);
  },
};
