import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Stethoscope, Receipt, FileSpreadsheet, Upload, Activity } from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clientes", label: "Pacientes", icon: Users },
  { to: "/atenciones", label: "Atenciones", icon: Stethoscope },
  { to: "/facturacion", label: "Facturación", icon: Receipt },
  { to: "/reportes", label: "Reportes", icon: FileSpreadsheet },
  { to: "/importar", label: "Importar", icon: Upload },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-60 flex-col border-r border-border dark:border-border-dark bg-surface dark:bg-surface-dark shrink-0">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-border dark:border-border-dark">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-white">
          <Activity size={17} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 leading-tight">Chequeo Facturación</p>
          <p className="text-[11px] text-gray-400 leading-tight">Gestión clínica</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
              )
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
