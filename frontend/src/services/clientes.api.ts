import { api } from "./api";
import { Cliente, PaginatedResult } from "../types";

export interface ListClientesParams {
  search?: string;
  obraSocial?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface ClienteFormValues {
  nombre: string;
  apellido: string;
  dni: string;
  obraSocial?: string | null;
  telefono?: string | null;
  email?: string | null;
  observaciones?: string | null;
}

export const clientesApi = {
  async list(params: ListClientesParams) {
    const { data } = await api.get<PaginatedResult<Cliente>>("/clientes", { params });
    return data;
  },
  async getById(id: number) {
    const { data } = await api.get<Cliente & { atenciones: any[] }>(`/clientes/${id}`);
    return data;
  },
  async create(input: ClienteFormValues) {
    const { data } = await api.post<Cliente>("/clientes", input);
    return data;
  },
  async update(id: number, input: Partial<ClienteFormValues>) {
    const { data } = await api.put<Cliente>(`/clientes/${id}`, input);
    return data;
  },
  async remove(id: number) {
    await api.delete(`/clientes/${id}`);
  },
  async obrasSociales() {
    const { data } = await api.get<string[]>("/clientes/obras-sociales");
    return data;
  },
};
