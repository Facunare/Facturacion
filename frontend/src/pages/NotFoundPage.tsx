import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-canvas dark:bg-canvas-dark text-center px-4">
      <p className="text-5xl font-bold text-accent-500">404</p>
      <p className="text-gray-600 dark:text-gray-300">La página que buscás no existe.</p>
      <Link to="/" className="btn-primary mt-2">
        Volver al dashboard
      </Link>
    </div>
  );
}
