import { api } from "./api";
import { Factura, Atencion, PaginatedResult } from "../types";

export interface ListPendientesParams {
  search?: string;
  profesional?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  page?: number;
  pageSize?: number;
}

export interface MarcarFacturadaValues {
  numeroFactura: string;
  fechaFactura: string;
  importeFacturado: number;
}

export type FacturaPendienteRow = Factura & { atencion: Atencion };

export const facturasApi = {
  async listPendientes(params: ListPendientesParams) {
    const { data } = await api.get<PaginatedResult<FacturaPendienteRow>>("/facturas/pendientes", { params });
    return data;
  },
  async marcarFacturada(id: number, input: MarcarFacturadaValues) {
    const { data } = await api.patch<Factura>(`/facturas/${id}/marcar-facturada`, input);
    return data;
  },
  async cancelar(id: number) {
    const { data } = await api.patch<Factura>(`/facturas/${id}/cancelar`);
    return data;
  },
  async reabrir(id: number) {
    const { data } = await api.patch<Factura>(`/facturas/${id}/reabrir`);
    return data;
  },
};
