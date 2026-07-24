import { api } from "./api";
import { Atencion, PaginatedResult } from "../types";

export interface ListAtencionesParams {
  fechaDesde?: string;
  fechaHasta?: string;
  profesional?: string;
  estado?: string;
  clienteId?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface AtencionFormValues {
  clienteId: number;
  fecha: string;
  profesional: string;
  prestacion: string;
  importe: number;
  observaciones?: string | null;
}

export const atencionesApi = {
  async list(params: ListAtencionesParams) {
    const { data } = await api.get<PaginatedResult<Atencion>>("/atenciones", { params });
    return data;
  },
  async getById(id: number) {
    const { data } = await api.get<Atencion>(`/atenciones/${id}`);
    return data;
  },
  async create(input: AtencionFormValues) {
    const { data } = await api.post<Atencion>("/atenciones", input);
    return data;
  },
  async update(id: number, input: Partial<AtencionFormValues>) {
    const { data } = await api.put<Atencion>(`/atenciones/${id}`, input);
    return data;
  },
  async remove(id: number) {
    await api.delete(`/atenciones/${id}`);
  },
  async profesionales() {
    const { data } = await api.get<string[]>("/atenciones/profesionales");
    return data;
  },
};
