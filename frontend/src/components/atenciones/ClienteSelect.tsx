import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Search } from "lucide-react";
import { clientesApi } from "../../services/clientes.api";
import { useDebounce } from "../../hooks/useDebounce";
import { Cliente } from "../../types";

interface ClienteSelectProps {
  value: number | null;
  onChange: (clienteId: number, cliente: Cliente) => void;
  placeholder?: string;
}

export function ClienteSelect({ value, onChange, placeholder = "Buscar paciente por nombre o DNI..." }: ClienteSelectProps) {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const debounced = useDebounce(term, 300);
  const ref = useRef<HTMLDivElement>(null);

  const { data, isFetching } = useQuery({
    queryKey: ["cliente-select", debounced],
    queryFn: () => clientesApi.list({ search: debounced, page: 1, pageSize: 8 }),
    enabled: open,
  });

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="input flex items-center justify-between text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={value ? "text-gray-900 dark:text-gray-100" : "text-gray-400"}>
          {selectedLabel || (value ? `Paciente #${value}` : "Seleccioná un paciente")}
        </span>
        <ChevronDown size={15} className="text-gray-400" />
      </button>

      {open && (
        <div className="absolute z-30 mt-1.5 w-full card p-2 max-h-72 overflow-y-auto">
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
            <input
              autoFocus
              className="input pl-8 !py-1.5 text-sm"
              placeholder={placeholder}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </div>

          {isFetching && <p className="px-2 py-1.5 text-sm text-gray-400">Buscando...</p>}

          {!isFetching && data?.data.length === 0 && (
            <p className="px-2 py-1.5 text-sm text-gray-400">Sin resultados</p>
          )}

          {data?.data.map((c) => (
            <button
              key={c.id}
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-white/5"
              onClick={() => {
                onChange(c.id, c);
                setSelectedLabel(`${c.apellido}, ${c.nombre} · DNI ${c.dni}`);
                setOpen(false);
              }}
            >
              <span>
                {c.apellido}, {c.nombre}
              </span>
              <span className="text-gray-400 font-mono text-xs">{c.dni}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
