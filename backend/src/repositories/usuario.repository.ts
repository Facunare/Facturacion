import { prisma } from "../config/prisma";

export const usuarioRepository = {
  findByUsername(username: string) {
    return prisma.usuario.findUnique({ where: { username } });
  },
  findById(id: number) {
    return prisma.usuario.findUnique({ where: { id } });
  },
};
