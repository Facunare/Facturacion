import { api } from "./api";
import { DashboardStats, Cliente, Atencion } from "../types";

export const dashboardApi = {
  async getStats() {
    const { data } = await api.get<DashboardStats>("/dashboard/stats");
    return data;
  },
};

export interface GlobalSearchResult {
  clientes: Cliente[];
  atenciones: Atencion[];
  facturas: any[];
}

export const searchApi = {
  async search(term: string) {
    const { data } = await api.get<GlobalSearchResult>("/search", { params: { q: term } });
    return data;
  },
};

export interface ImportResult {
  totalFilas: number;
  creados: number;
  actualizados: number;
  omitidos: number;
  columnasDetectadas: Record<string, number>;
  detalle: { row: number; status: string; dni?: string; motivo?: string }[];
}

export const importApi = {
  async importPacientes(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post<ImportResult>("/import/pacientes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};

export type ReporteTipo = "pacientes" | "atenciones" | "facturadas" | "pendientes" | "ingresos-por-mes";

export const reportesApi = {
  async descargar(tipo: ReporteTipo) {
    const response = await api.get(`/reportes/${tipo}`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${tipo.replace("-", "_")}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
