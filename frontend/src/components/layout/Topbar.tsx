import { Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { GlobalSearch } from "./GlobalSearch";

export function Topbar() {
  const { isDark, toggle } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center gap-4 border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-4 md:px-6 shrink-0">
      <GlobalSearch />

      <div className="flex-1" />

      <button
        onClick={toggle}
        className="btn-ghost !p-2"
        aria-label="Cambiar tema"
        title="Cambiar tema"
      >
        {isDark ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      <div className="flex items-center gap-3 pl-3 border-l border-border dark:border-border-dark">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{user?.nombre}</p>
          <p className="text-[11px] text-gray-400 leading-tight">
            {user?.role === "ADMINISTRADOR" ? "Administrador" : "Administrativo"}
          </p>
        </div>
        <button onClick={logout} className="btn-ghost !p-2" aria-label="Cerrar sesión" title="Cerrar sesión">
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
