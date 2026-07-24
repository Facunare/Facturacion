import { Router } from "express";
import { clienteController } from "../controllers/cliente.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

export const clienteRouter = Router();

clienteRouter.use(requireAuth);

clienteRouter.get("/", clienteController.list);
clienteRouter.get("/obras-sociales", clienteController.obrasSociales);
clienteRouter.get("/:id", clienteController.getById);
clienteRouter.post("/", clienteController.create);
clienteRouter.put("/:id", clienteController.update);
clienteRouter.delete("/:id", requireRole("ADMINISTRADOR"), clienteController.remove);
