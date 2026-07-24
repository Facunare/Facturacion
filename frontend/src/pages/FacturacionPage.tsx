import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Receipt } from "lucide-react";
import toast from "react-hot-toast";
import { facturasApi, FacturaPendienteRow } from "../services/facturas.api";
import { useDebounce } from "../hooks/useDebounce";
import { TableSkeleton } from "../components/ui/Skeleton";
import { Pagination } from "../components/ui/Pagination";
import { EmptyState } from "../components/ui/StateComponents";
import { MarcarFacturadaModal } from "../components/facturacion/MarcarFacturadaModal";
import { MarcarFacturadaFormData } from "../schemas/factura.schema";
import { formatCurrency, formatDate } from "../utils/format";
import { getErrorMessage } from "../services/api";

const PAGE_SIZE = 10;

export function FacturacionPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<FacturaPendienteRow | null>(null);
  const debouncedSearch = useDebounce(search);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["facturas-pendientes", debouncedSearch, page],
    queryFn: () => facturasApi.listPendientes({ search: debouncedSearch, page, pageSize: PAGE_SIZE }),
  });

  const marcarMutation = useMutation({
    mutationFn: (values: MarcarFacturadaFormData) => facturasApi.marcarFacturada(selected!.id, values),
    onSuccess: () => {
      toast.success("Atención marcada como facturada");
      queryClient.invalidateQueries({ queryKey: ["facturas-pendientes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setSelected(null);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Facturación</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Atenciones pendientes de facturar. Marcalas a medida que se generan las facturas.
        </p>
      </div>

      <div className="card">
        <div className="p-4 border-b border-border dark:border-border-dark">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              className="input pl-9"
              placeholder="Buscar paciente o DNI..."
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
          <EmptyState
            title="No hay atenciones pendientes"
            description="Todas las atenciones registradas ya fueron facturadas."
            icon={<Receipt size={20} />}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Prestación</th>
                  <th>Fecha</th>
                  <th>Importe</th>
                  <th className="text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((row) => (
                  <tr key={row.id}>
                    <td className="font-medium text-gray-900 dark:text-gray-100">
                      {row.atencion.cliente?.apellido}, {row.atencion.cliente?.nombre}
                    </td>
                    <td>{row.atencion.prestacion}</td>
                    <td>{formatDate(row.atencion.fecha)}</td>
                    <td className="font-mono">{formatCurrency(row.atencion.importe)}</td>
                    <td>
                      <div className="flex justify-end">
                        <button className="btn-primary !py-1.5 !text-xs" onClick={() => setSelected(row)}>
                          Marcar como facturada
                        </button>
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

      <MarcarFacturadaModal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onSubmit={(values) => marcarMutation.mutate(values)}
        row={selected}
        loading={marcarMutation.isPending}
      />
    </div>
  );
}
