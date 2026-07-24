import { Request, Response } from "express";
import type ExcelJS from "exceljs";
import { asyncHandler } from "../utils/asyncHandler";
import { reporteService } from "../services/reporte.service";

function sendExcel(res: Response, buffer: ExcelJS.Buffer, filename: string) {
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(Buffer.from(buffer));
}

export const reporteController = {
  pacientes: asyncHandler(async (_req: Request, res: Response) => {
    const buffer = await reporteService.exportPacientes();
    sendExcel(res, buffer, "pacientes.xlsx");
  }),
  atenciones: asyncHandler(async (_req: Request, res: Response) => {
    const buffer = await reporteService.exportAtenciones();
    sendExcel(res, buffer, "atenciones.xlsx");
  }),
  facturadas: asyncHandler(async (_req: Request, res: Response) => {
    const buffer = await reporteService.exportFacturadas();
    sendExcel(res, buffer, "facturadas.xlsx");
  }),
  pendientes: asyncHandler(async (_req: Request, res: Response) => {
    const buffer = await reporteService.exportPendientes();
    sendExcel(res, buffer, "pendientes.xlsx");
  }),
  ingresosPorMes: asyncHandler(async (_req: Request, res: Response) => {
    const buffer = await reporteService.exportIngresosPorMes();
    sendExcel(res, buffer, "ingresos_por_mes.xlsx");
  }),
};
