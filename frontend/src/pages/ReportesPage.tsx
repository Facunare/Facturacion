import { useState } from "react";
import { Users, Stethoscope, CheckCircle2, Clock, TrendingUp, Download } from "lucide-react";
import toast from "react-hot-toast";
import { reportesApi, ReporteTipo } from "../services/misc.api";
import { getErrorMessage } from "../services/api";

const REPORTES: { tipo: ReporteTipo; title: string; description: string; icon: JSX.Element }[] = [
  { tipo: "pacientes", title: "Pacientes", description: "Listado completo de pacientes registrados.", icon: <Users size={18} /> },
  { tipo: "atenciones", title: "Atenciones", description: "Todas las atenciones registradas con su estado.", icon: <Stethoscope size={18} /> },
  { tipo: "facturadas", title: "Facturadas", description: "Atenciones ya facturadas con número y fecha de factura.", icon: <CheckCircle2 size={18} /> },
  { tipo: "pendientes", title: "Pendientes", description: "Atenciones que todavía no fueron facturadas.", icon: <Clock size={18} /> },
  { tipo: "ingresos-por-mes", title: "Ingresos por mes", description: "Totales facturados agrupados por mes.", icon: <TrendingUp size={18} /> },
];

export function ReportesPage() {
  const [downloading, setDownloading] = useState<ReporteTipo | null>(null);

  async function handleDownload(tipo: ReporteTipo) {
    setDownloading(tipo);
    try {
      await reportesApi.descargar(tipo);
      toast.success("Reporte descargado");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Reportes</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Exportá la información a Excel para compartir o archivar.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTES.map((r) => (
          <div key={r.tipo} className="card p-5 flex flex-col">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400 mb-3">
              {r.icon}
            </div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{r.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex-1">{r.description}</p>
            <button
              className="btn-secondary mt-4 self-start"
              onClick={() => handleDownload(r.tipo)}
              disabled={downloading === r.tipo}
            >
              <Download size={15} />
              {downloading === r.tipo ? "Generando..." : "Descargar Excel"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
