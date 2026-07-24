import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { clientesApi } from "../services/clientes.api";
import { Cliente } from "../types";
import { useDebounce } from "../hooks/useDebounce";
import { TableSkeleton } from "../components/ui/Skeleton";
import { Pagination } from "../components/ui/Pagination";
import { EmptyState } from "../components/ui/StateComponents";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { ClienteFormModal } from "../components/clientes/ClienteFormModal";
import { ClienteFormData } from "../schemas/cliente.schema";
import { getErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 10;

export function ClientesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [deleting, setDeleting] = useState<Cliente | null>(null);
  const debouncedSearch = useDebounce(search);
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["clientes", debouncedSearch, page],
    queryFn: () => clientesApi.list({ search: debouncedSearch, page, pageSize: PAGE_SIZE }),
  });

  const createMutation = useMutation({
    mutationFn: (input: ClienteFormData) => clientesApi.create(input),
    onSuccess: () => {
      toast.success("Paciente creado correctamente");
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setModalOpen(false);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: ClienteFormData }) => clientesApi.update(id, input),
    onSuccess: () => {
      toast.success("Paciente actualizado");
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setModalOpen(false);
      setEditing(null);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientesApi.remove(id),
    onSuccess: () => {
      toast.success("Paciente eliminado");
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setDeleting(null);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
      setDeleting(null);
    },
  });

  function handleSubmit(values: ClienteFormData) {
    if (editing) {
      updateMutation.mutate({ id: editing.id, input: values });
    } else {
      createMutation.mutate(values);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Pacientes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gestioná los pacientes de la clínica</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus size={16} /> Nuevo paciente
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-border dark:border-border-dark">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              className="input pl-9"
              placeholder="Buscar por nombre, DNI u obra social..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : !data || data.data.length === 0 ? (
          <EmptyState title="No hay pacientes" description="Todavía no se registraron pacientes con ese criterio." />
        ) : (
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>DNI</th>
                  <th>Obra social</th>
                  <th>Contacto</th>
                  <th>Atenciones</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((cliente) => (
                  <tr key={cliente.id}>
                    <td className="font-medium text-gray-900 dark:text-gray-100">
                      {cliente.apellido}, {cliente.nombre}
                    </td>
                    <td className="font-mono text-xs">{cliente.dni}</td>
                    <td>{cliente.obraSocial || "-"}</td>
                    <td className="text-gray-500 dark:text-gray-400">{cliente.telefono || cliente.email || "-"}</td>
                    <td>{cliente._count?.atenciones ?? 0}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/clientes/${cliente.id}`} className="btn-ghost !p-2" title="Ver historial">
                          <ChevronRight size={16} />
                        </Link>
                        <button
                          className="btn-ghost !p-2"
                          title="Editar"
                          onClick={() => {
                            setEditing(cliente);
                            setModalOpen(true);
                          }}
                        >
                          <Pencil size={15} />
                        </button>
                        {isAdmin && (
                          <button
                            className="btn-ghost !p-2 hover:!text-danger"
                            title="Eliminar"
                            onClick={() => setDeleting(cliente)}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && <Pagination page={page} pageSize={PAGE_SIZE} total={data.total} onPageChange={setPage} />}
      </div>

      <ClienteFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        cliente={editing}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar paciente"
        description={`¿Seguro que querés eliminar a ${deleting?.nombre} ${deleting?.apellido}? Esta acción no se puede deshacer y eliminará también sus atenciones.`}
        confirmLabel="Eliminar"
        loading={deleteMutation.isPending}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
