import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Phone, Mail, CreditCard, ShieldPlus } from "lucide-react";
import { clientesApi } from "../services/clientes.api";
import { EstadoBadge } from "../components/ui/EstadoBadge";
import { formatCurrency, formatDate } from "../utils/format";
import { TableSkeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/StateComponents";

export function ClienteDetailPage() {
  const { id } = useParams();
  const { data: cliente, isLoading } = useQuery({
    queryKey: ["cliente", id],
    queryFn: () => clientesApi.getById(Number(id)),
    enabled: Boolean(id),
  });

  return (
    <div className="space-y-5">
      <Link to="/clientes" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
        <ArrowLeft size={15} /> Volver a pacientes
      </Link>

      {isLoading || !cliente ? (
        <TableSkeleton rows={4} cols={4} />
      ) : (
        <>
          <div className="card p-5">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              {cliente.apellido}, {cliente.nombre}
            </h1>
            <div className="mt-3 flex flex-wrap gap-5 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5"><CreditCard size={14} /> DNI {cliente.dni}</span>
              {cliente.obraSocial && (
                <span className="flex items-center gap-1.5"><ShieldPlus size={14} /> {cliente.obraSocial}</span>
              )}
              {cliente.telefono && (
                <span className="flex items-center gap-1.5"><Phone size={14} /> {cliente.telefono}</span>
              )}
              {cliente.email && (
                <span className="flex items-center gap-1.5"><Mail size={14} /> {cliente.email}</span>
              )}
            </div>
            {cliente.observaciones && (
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 border-t border-border dark:border-border-dark pt-3">
                {cliente.observaciones}
              </p>
            )}
          </div>

          <div className="card">
            <div className="p-4 border-b border-border dark:border-border-dark">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Historial de atenciones</h2>
            </div>
            {cliente.atenciones.length === 0 ? (
              <EmptyState title="Sin atenciones registradas" />
            ) : (
              <div className="overflow-x-auto">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Profesional</th>
                      <th>Prestación</th>
                      <th>Importe</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cliente.atenciones.map((a: any) => (
                      <tr key={a.id}>
                        <td>{formatDate(a.fecha)}</td>
                        <td>{a.profesional}</td>
                        <td>{a.prestacion}</td>
                        <td className="font-mono">{formatCurrency(a.importe)}</td>
                        <td>{a.factura && <EstadoBadge estado={a.factura.estado} />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
