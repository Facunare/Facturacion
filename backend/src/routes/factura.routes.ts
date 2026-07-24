import { Router } from "express";
import { facturaController } from "../controllers/factura.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

export const facturaRouter = Router();

facturaRouter.use(requireAuth);

facturaRouter.get("/pendientes", facturaController.listPendientes);
facturaRouter.patch("/:id/marcar-facturada", facturaController.marcarFacturada);
facturaRouter.patch("/:id/cancelar", requireRole("ADMINISTRADOR"), facturaController.cancelar);
facturaRouter.patch("/:id/reabrir", requireRole("ADMINISTRADOR"), facturaController.reabrir);
