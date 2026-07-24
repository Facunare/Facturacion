import axios from "axios";

// En desarrollo, Vite proxea /api hacia el backend local (ver vite.config.ts).
// En producción (frontend y backend en dominios distintos, p. ej. Vercel + Render),
// definí VITE_API_URL con la URL completa del backend, por ejemplo:
// VITE_API_URL=https://mi-backend.onrender.com/api
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "Ocurrió un error inesperado";
  }
  if (error instanceof Error) return error.message;
  return "Ocurrió un error inesperado";
}
