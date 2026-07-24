import { Router } from "express";
import { reporteController } from "../controllers/reporte.controller";
import { requireAuth } from "../middlewares/auth.middleware";

export const reporteRouter = Router();

reporteRouter.use(requireAuth);
reporteRouter.get("/pacientes", reporteController.pacientes);
reporteRouter.get("/atenciones", reporteController.atenciones);
reporteRouter.get("/facturadas", reporteController.facturadas);
reporteRouter.get("/pendientes", reporteController.pendientes);
reporteRouter.get("/ingresos-por-mes", reporteController.ingresosPorMes);
