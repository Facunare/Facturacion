import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../ui/Modal";
import { ClienteSelect } from "./ClienteSelect";
import { atencionSchema, AtencionFormData } from "../../schemas/atencion.schema";
import { formatDateInput } from "../../utils/format";
import { Cliente } from "../../types";

interface AtencionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AtencionFormData) => void;
  loading?: boolean;
  preselectedClienteId?: number;
}

export function AtencionFormModal({ open, onClose, onSubmit, loading, preselectedClienteId }: AtencionFormModalProps) {
  const [clienteLabel, setClienteLabel] = useState<Cliente | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AtencionFormData>({
    resolver: zodResolver(atencionSchema),
    defaultValues: {
      clienteId: preselectedClienteId || 0,
      fecha: formatDateInput(new Date()),
      profesional: "",
      prestacion: "",
      importe: 0,
      observaciones: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        clienteId: preselectedClienteId || 0,
        fecha: formatDateInput(new Date()),
        profesional: "",
        prestacion: "",
        importe: 0,
        observaciones: "",
      });
      setClienteLabel(null);
    }
  }, [open, preselectedClienteId, reset]);

  return (
    <Modal open={open} onClose={onClose} title="Nueva atención">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Paciente</label>
          <Controller
            control={control}
            name="clienteId"
            render={({ field }) => (
              <ClienteSelect
                value={field.value || null}
                onChange={(id, cliente) => {
                  field.onChange(id);
                  setClienteLabel(cliente);
                }}
              />
            )}
          />
          {errors.clienteId && <p className="text-xs text-danger mt-1">{errors.clienteId.message}</p>}
          {clienteLabel && (
            <p className="text-xs text-gray-400 mt-1">
              {clienteLabel.obraSocial ? `Obra social: ${clienteLabel.obraSocial}` : "Sin obra social registrada"}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Fecha</label>
            <input type="date" className="input" {...register("fecha")} />
            {errors.fecha && <p className="text-xs text-danger mt-1">{errors.fecha.message}</p>}
          </div>
          <div>
            <label className="label">Importe</label>
            <input type="number" step="0.01" className="input" {...register("importe")} />
            {errors.importe && <p className="text-xs text-danger mt-1">{errors.importe.message}</p>}
          </div>
        </div>

        <div>
          <label className="label">Profesional</label>
          <input className="input" {...register("profesional")} placeholder="Dra. Gómez" />
          {errors.profesional && <p className="text-xs text-danger mt-1">{errors.profesional.message}</p>}
        </div>

        <div>
          <label className="label">Prestación</label>
          <input className="input" {...register("prestacion")} placeholder="Consulta general" />
          {errors.prestacion && <p className="text-xs text-danger mt-1">{errors.prestacion.message}</p>}
        </div>

        <div>
          <label className="label">Observaciones</label>
          <textarea className="input" rows={2} {...register("observaciones")} />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Guardando..." : "Registrar atención"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
