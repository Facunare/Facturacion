export type Role = "ADMINISTRADOR" | "ADMINISTRATIVO";

export type EstadoFactura = "PENDIENTE" | "FACTURADO" | "CANCELADO";

export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  role: Role;
}

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  obraSocial: string | null;
  telefono: string | null;
  email: string | null;
  observaciones: string | null;
  createdAt: string;
  _count?: { atenciones: number };
}

export interface Factura {
  id: number;
  atencionId: number;
  numeroFactura: string | null;
  fechaFactura: string | null;
  importeFacturado: number | null;
  estado: EstadoFactura;
  createdAt: string;
  updatedAt: string;
}

export interface Atencion {
  id: number;
  clienteId: number;
  fecha: string;
  profesional: string;
  prestacion: string;
  importe: number;
  observaciones: string | null;
  createdAt: string;
  cliente?: Cliente;
  factura?: Factura | null;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DashboardStats {
  cantidadPacientes: number;
  cantidadAtenciones: number;
  cantidadPendiente: number;
  cantidadFacturada: number;
  montoTotalPendiente: number;
  montoFacturadoEsteMes: number;
  ingresosPorMes: { mes: string; total: number }[];
}
