import { Router } from "express";
import { importController } from "../controllers/import.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { excelUpload } from "../config/multer";

export const importRouter = Router();

importRouter.use(requireAuth);
importRouter.post("/pacientes", excelUpload.single("file"), importController.importPacientes);
