import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const hasToken = Boolean(localStorage.getItem("token"));

  if (!user || !hasToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
