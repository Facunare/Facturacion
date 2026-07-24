import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../ui/Modal";
import { clienteSchema, ClienteFormData } from "../../schemas/cliente.schema";
import { Cliente } from "../../types";

interface ClienteFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ClienteFormData) => void;
  cliente?: Cliente | null;
  loading?: boolean;
}

export function ClienteFormModal({ open, onClose, onSubmit, cliente, loading }: ClienteFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: { nombre: "", apellido: "", dni: "", obraSocial: "", telefono: "", email: "", observaciones: "" },
  });

  useEffect(() => {
    if (open) {
      reset(
        cliente
          ? {
              nombre: cliente.nombre,
              apellido: cliente.apellido,
              dni: cliente.dni,
              obraSocial: cliente.obraSocial || "",
              telefono: cliente.telefono || "",
              email: cliente.email || "",
              observaciones: cliente.observaciones || "",
            }
          : { nombre: "", apellido: "", dni: "", obraSocial: "", telefono: "", email: "", observaciones: "" }
      );
    }
  }, [open, cliente, reset]);

  return (
    <Modal open={open} onClose={onClose} title={cliente ? "Editar paciente" : "Nuevo paciente"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Nombre</label>
            <input className="input" {...register("nombre")} />
            {errors.nombre && <p className="text-xs text-danger mt-1">{errors.nombre.message}</p>}
          </div>
          <div>
            <label className="label">Apellido</label>
            <input className="input" {...register("apellido")} />
            {errors.apellido && <p className="text-xs text-danger mt-1">{errors.apellido.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">DNI</label>
            <input className="input" {...register("dni")} />
            {errors.dni && <p className="text-xs text-danger mt-1">{errors.dni.message}</p>}
          </div>
          <div>
            <label className="label">Obra social</label>
            <input className="input" {...register("obraSocial")} placeholder="OSDE, Swiss Medical..." />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Teléfono</label>
            <input className="input" {...register("telefono")} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" {...register("email")} />
            {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
          </div>
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
            {loading ? "Guardando..." : cliente ? "Guardar cambios" : "Crear paciente"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
