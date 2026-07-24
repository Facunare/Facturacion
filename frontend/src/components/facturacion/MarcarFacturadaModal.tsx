import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../ui/Modal";
import { marcarFacturadaSchema, MarcarFacturadaFormData } from "../../schemas/factura.schema";
import { formatCurrency, formatDate, formatDateInput } from "../../utils/format";
import { FacturaPendienteRow } from "../../services/facturas.api";

interface MarcarFacturadaModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MarcarFacturadaFormData) => void;
  row: FacturaPendienteRow | null;
  loading?: boolean;
}

export function MarcarFacturadaModal({ open, onClose, onSubmit, row, loading }: MarcarFacturadaModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MarcarFacturadaFormData>({
    resolver: zodResolver(marcarFacturadaSchema),
    defaultValues: { numeroFactura: "", fechaFactura: formatDateInput(new Date()), importeFacturado: 0 },
  });

  useEffect(() => {
    if (open && row) {
      reset({
        numeroFactura: "",
        fechaFactura: formatDateInput(new Date()),
        importeFacturado: row.atencion.importe,
      });
    }
  }, [open, row, reset]);

  if (!row) return null;

  return (
    <Modal open={open} onClose={onClose} title="Marcar como facturada">
      <div className="mb-4 rounded-lg bg-gray-50 dark:bg-white/5 p-3 text-sm">
        <p className="font-medium text-gray-800 dark:text-gray-100">
          {row.atencion.cliente?.apellido}, {row.atencion.cliente?.nombre}
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          {row.atencion.prestacion} · {formatDate(row.atencion.fecha)} · Importe atención: {formatCurrency(row.atencion.importe)}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Número de factura</label>
          <input className="input" {...register("numeroFactura")} placeholder="A-0001234" />
          {errors.numeroFactura && <p className="text-xs text-danger mt-1">{errors.numeroFactura.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Fecha de factura</label>
            <input type="date" className="input" {...register("fechaFactura")} />
            {errors.fechaFactura && <p className="text-xs text-danger mt-1">{errors.fechaFactura.message}</p>}
          </div>
          <div>
            <label className="label">Importe facturado</label>
            <input type="number" step="0.01" className="input" {...register("importeFacturado")} />
            {errors.importeFacturado && <p className="text-xs text-danger mt-1">{errors.importeFacturado.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar factura"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
