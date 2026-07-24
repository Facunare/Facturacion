import { Router } from "express";
import { atencionController } from "../controllers/atencion.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

export const atencionRouter = Router();

atencionRouter.use(requireAuth);

atencionRouter.get("/", atencionController.list);
atencionRouter.get("/profesionales", atencionController.profesionales);
atencionRouter.get("/:id", atencionController.getById);
atencionRouter.post("/", atencionController.create);
atencionRouter.put("/:id", atencionController.update);
atencionRouter.delete("/:id", requireRole("ADMINISTRADOR"), atencionController.remove);
