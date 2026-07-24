import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { importService } from "../services/import.service";
import { ApiError } from "../utils/ApiError";

export const importController = {
  importPacientes: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest("Debés adjuntar un archivo Excel (.xlsx)");
    const result = await importService.importPacientesFromExcel(req.file.buffer);
    res.json(result);
  }),
};
