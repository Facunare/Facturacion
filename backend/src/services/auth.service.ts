import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { usuarioRepository } from "../repositories/usuario.repository";
import { LoginInput } from "../validators/auth.validators";
import { ApiError } from "../utils/ApiError";

export const authService = {
  async login({ username, password }: LoginInput) {
    const usuario = await usuarioRepository.findByUsername(username);
    if (!usuario) {
      throw ApiError.unauthorized("Usuario o contraseña incorrectos");
    }

    const passwordOk = await bcrypt.compare(password, usuario.password);
    if (!passwordOk) {
      throw ApiError.unauthorized("Usuario o contraseña incorrectos");
    }

    const payload = {
      id: usuario.id,
      username: usuario.username,
      nombre: usuario.nombre,
      role: usuario.role,
    };

    const token = jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as any });

    return { token, user: payload };
  },
};
