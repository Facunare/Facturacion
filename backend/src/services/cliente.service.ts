import { clienteRepository } from "../repositories/cliente.repository";
import { CreateClienteInput, ListClientesQuery, UpdateClienteInput } from "../validators/cliente.validators";
import { ApiError } from "../utils/ApiError";

export const clienteService = {
  list(query: ListClientesQuery) {
    return clienteRepository.list(query);
  },

  async getById(id: number) {
    const cliente = await clienteRepository.findById(id);
    if (!cliente) throw ApiError.notFound("Paciente no encontrado");
    return cliente;
  },

  async create(input: CreateClienteInput) {
    const existing = await clienteRepository.findByDni(input.dni);
    if (existing) throw ApiError.conflict(`Ya existe un paciente con el DNI ${input.dni}`);

    return clienteRepository.create({
      nombre: input.nombre,
      apellido: input.apellido,
      dni: input.dni,
      obraSocial: input.obraSocial || null,
      telefono: input.telefono || null,
      email: input.email || null,
      observaciones: input.observaciones || null,
    });
  },

  async update(id: number, input: UpdateClienteInput) {
    await this.getById(id);

    if (input.dni) {
      const existing = await clienteRepository.findByDni(input.dni);
      if (existing && existing.id !== id) {
        throw ApiError.conflict(`Ya existe un paciente con el DNI ${input.dni}`);
      }
    }

    return clienteRepository.update(id, input);
  },

  async remove(id: number) {
    await this.getById(id);
    return clienteRepository.delete(id);
  },

  async obrasSociales() {
    const rows = await clienteRepository.distinctObrasSociales();
    return rows.map((r) => r.obraSocial).filter(Boolean);
  },
};
