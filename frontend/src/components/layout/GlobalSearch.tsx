import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, User, FileText, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { searchApi } from "../../services/misc.api";

export function GlobalSearch() {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(term, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data, isFetching } = useQuery({
    queryKey: ["global-search", debounced],
    queryFn: () => searchApi.search(debounced),
    enabled: debounced.trim().length >= 2,
  });

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const hasResults =
    data && (data.clientes.length > 0 || data.atenciones.length > 0 || data.facturas.length > 0);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        <input
          className="input pl-9"
          placeholder="Buscar paciente, DNI, factura o prestación..."
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </div>

      {open && debounced.trim().length >= 2 && (
        <div className="absolute z-40 mt-1.5 w-full card p-2 max-h-96 overflow-y-auto">
          {isFetching && <p className="px-3 py-2 text-sm text-gray-400">Buscando...</p>}

          {!isFetching && !hasResults && (
            <p className="px-3 py-2 text-sm text-gray-400">Sin resultados para “{debounced}”</p>
          )}

          {data?.clientes.map((c) => (
            <button
              key={`c-${c.id}`}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-white/5"
              onClick={() => {
                navigate(`/clientes/${c.id}`);
                setOpen(false);
              }}
            >
              <User size={15} className="text-accent-500 shrink-0" />
              <span className="truncate">
                {c.apellido}, {c.nombre} <span className="text-gray-400">· DNI {c.dni}</span>
              </span>
            </button>
          ))}

          {data?.atenciones.map((a) => (
            <button
              key={`a-${a.id}`}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-white/5"
              onClick={() => {
                navigate(`/atenciones?clienteId=${a.clienteId}`);
                setOpen(false);
              }}
            >
              <Stethoscope size={15} className="text-accent-500 shrink-0" />
              <span className="truncate">
                {a.prestacion} <span className="text-gray-400">· {a.cliente?.apellido}, {a.cliente?.nombre}</span>
              </span>
            </button>
          ))}

          {data?.facturas.map((f: any) => (
            <button
              key={`f-${f.id}`}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-white/5"
              onClick={() => {
                navigate(`/facturacion`);
                setOpen(false);
              }}
            >
              <FileText size={15} className="text-accent-500 shrink-0" />
              <span className="truncate">
                Factura {f.numeroFactura} <span className="text-gray-400">· {f.atencion?.cliente?.apellido}, {f.atencion?.cliente?.nombre}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
