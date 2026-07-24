import { Router } from "express";
import { authRouter } from "./auth.routes";
import { clienteRouter } from "./cliente.routes";
import { atencionRouter } from "./atencion.routes";
import { facturaRouter } from "./factura.routes";
import { dashboardRouter } from "./dashboard.routes";
import { searchRouter } from "./search.routes";
import { importRouter } from "./import.routes";
import { reporteRouter } from "./reporte.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/clientes", clienteRouter);
apiRouter.use("/atenciones", atencionRouter);
apiRouter.use("/facturas", facturaRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/search", searchRouter);
apiRouter.use("/import", importRouter);
apiRouter.use("/reportes", reporteRouter);
