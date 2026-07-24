import { api } from "./api";
import { Usuario } from "../types";

export const authApi = {
  async login(username: string, password: string) {
    const { data } = await api.post<{ token: string; user: Usuario }>("/auth/login", { username, password });
    return data;
  },
};
