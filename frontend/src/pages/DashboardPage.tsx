import { useQuery } from "@tanstack/react-query";
import { Users, Stethoscope, Clock, CheckCircle2, Wallet, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { dashboardApi } from "../services/misc.api";
import { StatCard } from "../components/ui/StateComponents";
import { CardSkeleton } from "../components/ui/Skeleton";
import { formatCurrency, monthLabel } from "../utils/format";

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardApi.getStats,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Estado general de la facturación de la clínica</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {isLoading || !data ? (
          Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Pacientes" value={String(data.cantidadPacientes)} icon={<Users size={17} />} />
            <StatCard label="Atenciones" value={String(data.cantidadAtenciones)} icon={<Stethoscope size={17} />} />
            <StatCard
              label="Pendientes de facturar"
              value={String(data.cantidadPendiente)}
              icon={<Clock size={17} />}
              accentClass="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
            />
            <StatCard
              label="Facturadas"
              value={String(data.cantidadFacturada)}
              icon={<CheckCircle2 size={17} />}
              accentClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            />
            <StatCard
              label="Monto pendiente"
              value={formatCurrency(data.montoTotalPendiente)}
              icon={<Wallet size={17} />}
              accentClass="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
            />
            <StatCard
              label="Facturado este mes"
              value={formatCurrency(data.montoFacturadoEsteMes)}
              icon={<TrendingUp size={17} />}
              accentClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            />
          </>
        )}
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Ingresos facturados por mes</h2>
        {isLoading || !data ? (
          <div className="h-64 animate-pulse bg-gray-100 dark:bg-white/5 rounded-lg" />
        ) : data.ingresosPorMes.length === 0 ? (
          <p className="text-sm text-gray-400 py-10 text-center">Todavía no hay facturación registrada.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.ingresosPorMes.map((d) => ({ ...d, label: monthLabel(d.mes) }))}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200 dark:stroke-white/10" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={70}
                tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }}
              />
              <Bar dataKey="total" fill="#7c6ff0" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
