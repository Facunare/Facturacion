import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UploadCloud, FileSpreadsheet, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { importApi, ImportResult } from "../services/misc.api";
import { getErrorMessage } from "../services/api";

export function ImportarPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: (f: File) => importApi.importPacientes(f),
    onSuccess: (data) => {
      setResult(data);
      toast.success(`Importación completa: ${data.creados} creados, ${data.actualizados} actualizados`);
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  function handleFile(f: File | null) {
    if (!f) return;
    if (!f.name.match(/\.(xlsx|xls)$/i)) {
      toast.error("Solo se permiten archivos Excel (.xlsx, .xls)");
      return;
    }
    setFile(f);
    setResult(null);
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Importar pacientes</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Subí un Excel con tus pacientes históricos. Las columnas se mapean automáticamente por nombre de encabezado
          (nombre, apellido, DNI, obra social, teléfono, email, observaciones).
        </p>
      </div>

      <div
        className={`card p-10 flex flex-col items-center justify-center text-center border-2 border-dashed transition-colors ${
          dragActive ? "border-accent-400 bg-accent-50/50 dark:bg-accent-500/5" : "border-border dark:border-border-dark"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        <div className="h-12 w-12 rounded-full bg-accent-50 dark:bg-accent-500/10 text-accent-500 flex items-center justify-center mb-3">
          <UploadCloud size={22} />
        </div>
        <p className="font-medium text-gray-800 dark:text-gray-100">Arrastrá tu archivo Excel acá</p>
        <p className="text-sm text-gray-400 mt-1">o hacé clic para seleccionarlo desde tu computadora</p>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
        />
        <button className="btn-secondary mt-4" onClick={() => inputRef.current?.click()}>
          Seleccionar archivo
        </button>

        {file && (
          <div className="mt-5 flex items-center gap-2 rounded-lg bg-gray-50 dark:bg-white/5 px-3 py-2 text-sm">
            <FileSpreadsheet size={16} className="text-accent-500" />
            <span className="text-gray-700 dark:text-gray-200">{file.name}</span>
          </div>
        )}

        <button
          className="btn-primary mt-4"
          disabled={!file || importMutation.isPending}
          onClick={() => file && importMutation.mutate(file)}
        >
          {importMutation.isPending ? "Importando..." : "Importar pacientes"}
        </button>
      </div>

      {result && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Resultado de la importación</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-500/10 p-3 text-center">
              <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">{result.creados}</p>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">Creados</p>
            </div>
            <div className="rounded-lg bg-accent-50 dark:bg-accent-500/10 p-3 text-center">
              <p className="text-lg font-semibold text-accent-600 dark:text-accent-400">{result.actualizados}</p>
              <p className="text-xs text-accent-600/80 dark:text-accent-400/80">Actualizados</p>
            </div>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-500/10 p-3 text-center">
              <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">{result.omitidos}</p>
              <p className="text-xs text-amber-600/80 dark:text-amber-400/80">Omitidos</p>
            </div>
          </div>

          {result.omitidos > 0 && (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {result.detalle
                .filter((d) => d.status === "omitido")
                .map((d) => (
                  <div key={d.row} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <AlertTriangle size={13} className="text-amber-500 shrink-0" />
                    Fila {d.row}: {d.motivo}
                  </div>
                ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-400 mt-3 pt-3 border-t border-border dark:border-border-dark">
            {result.omitidos === 0 ? (
              <CheckCircle2 size={14} className="text-emerald-500" />
            ) : (
              <XCircle size={14} className="text-amber-500" />
            )}
            {result.totalFilas} filas procesadas en total
          </div>
        </div>
      )}
    </div>
  );
}
