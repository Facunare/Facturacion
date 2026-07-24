import { EstadoFactura } from "../../types";

const LABELS: Record<EstadoFactura, string> = {
  PENDIENTE: "Pendiente",
  FACTURADO: "Facturado",
  CANCELADO: "Cancelado",
};

const CLASSES: Record<EstadoFactura, string> = {
  PENDIENTE: "badge-pending",
  FACTURADO: "badge-billed",
  CANCELADO: "badge-cancelled",
};

export function EstadoBadge({ estado }: { estado: EstadoFactura }) {
  return <span className={CLASSES[estado]}>{LABELS[estado]}</span>;
}
