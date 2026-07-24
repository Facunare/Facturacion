import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { atencionesApi } from "../services/atenciones.api";
import { TableSkeleton } from "../components/ui/Skeleton";
import { Pagination } from "../components/ui/Pagination";
import { EmptyState } from "../components/ui/StateComponents";
import { EstadoBadge } from "../components/ui/EstadoBadge";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { AtencionFormModal } from "../components/atenciones/AtencionFormModal";
import { AtencionFormData } from "../schemas/atencion.schema";
import { formatCurrency, formatDate } from "../utils/format";
import { getErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Atencion } from "../types";

const PAGE_SIZE = 10;

export function AtencionesPage() {
  const [searchParams] = useSearchParams();
  const preselectedClienteId = searchParams.get("clienteId");

  const [page, setPage] = useState(1);
  const [profesional, setProfesional] = useState("");
  const [estado, setEstado] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState<Atencion | null>(null);
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const { data: profesionales } = useQuery({
    queryKey: ["profesionales"],
    queryFn: atencionesApi.profesionales,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["atenciones", page, profesional, estado, preselectedClienteId],
    queryFn: () =>
      atencionesApi.list({
        page,
        pageSize: PAGE_SIZE,
        profesional: profesional || undefined,
        estado: estado || undefined,
        clienteId: preselectedClienteId ? Number(preselectedClienteId) : undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (input: AtencionFormData) =>
      atencionesApi.create({ ...input, clienteId: Number(input.clienteId), importe: Number(input.importe) }),
    onSuccess: () => {
      toast.success("Atención registrada");
      queryClient.invalidateQueries({ queryKey: ["atenciones"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setModalOpen(false);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => atencionesApi.remove(id),
    onSuccess: () => {
      toast.success("Atención eliminada");
      queryClient.invalidateQueries({ queryKey: ["atenciones"] });
      setDeleting(null);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
      setDeleting(null);
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Atenciones</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Registro de atenciones a pacientes</p>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Nueva atención
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-border dark:border-border-dark flex flex-wrap gap-3">
          <select className="input max-w-[220px]" value={profesional} onChange={(e) => { setProfesional(e.target.value); setPage(1); }}>
            <option value="">Todos los profesionales</option>
            {profesionales?.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select className="input max-w-[200px]" value={estado} onChange={(e) => { setEstado(e.target.value); setPage(1); }}>
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="FACTURADO">Facturado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : !data || data.data.length === 0 ? (
          <EmptyState title="No hay atenciones" description="Ajustá los filtros o registrá una nueva atención." />
        ) : (
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Paciente</th>
                  <th>Profesional</th>
                  <th>Prestación</th>
                  <th>Importe</th>
                  <th>Estado</th>
                  {isAdmin && <th className="text-right">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {data.data.map((a) => (
                  <tr key={a.id}>
                    <td>{formatDate(a.fecha)}</td>
                    <td className="font-medium text-gray-900 dark:text-gray-100">
                      {a.cliente?.apellido}, {a.cliente?.nombre}
                    </td>
                    <td>{a.profesional}</td>
                    <td>{a.prestacion}</td>
                    <td className="font-mono">{formatCurrency(a.importe)}</td>
                    <td>{a.factura && <EstadoBadge estado={a.factura.estado} />}</td>
                    {isAdmin && (
                      <td>
                        <div className="flex justify-end">
                          <button className="btn-ghost !p-2 hover:!text-danger" title="Eliminar" onClick={() => setDeleting(a)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && <Pagination page={page} pageSize={PAGE_SIZE} total={data.total} onPageChange={setPage} />}
      </div>

      <AtencionFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(values) => createMutation.mutate(values)}
        loading={createMutation.isPending}
        preselectedClienteId={preselectedClienteId ? Number(preselectedClienteId) : undefined}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar atención"
        description="¿Seguro que querés eliminar esta atención? También se eliminará su factura asociada."
        confirmLabel="Eliminar"
        loading={deleteMutation.isPending}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
