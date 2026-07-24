import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { facturaService } from "../services/factura.service";
import { listPendientesQuerySchema, marcarFacturadaSchema } from "../validators/factura.validators";

export const facturaController = {
  listPendientes: asyncHandler(async (req: Request, res: Response) => {
    const query = listPendientesQuerySchema.parse(req.query);
    const result = await facturaService.listPendientes(query);
    res.json(result);
  }),

  marcarFacturada: asyncHandler(async (req: Request, res: Response) => {
    const input = marcarFacturadaSchema.parse(req.body);
    const factura = await facturaService.marcarFacturada(Number(req.params.id), input);
    res.json(factura);
  }),

  cancelar: asyncHandler(async (req: Request, res: Response) => {
    const isAdmin = req.user?.role === "ADMINISTRADOR";
    const factura = await facturaService.cancelar(Number(req.params.id), isAdmin);
    res.json(factura);
  }),

  reabrir: asyncHandler(async (req: Request, res: Response) => {
    const isAdmin = req.user?.role === "ADMINISTRADOR";
    const factura = await facturaService.reabrir(Number(req.params.id), isAdmin);
    res.json(factura);
  }),
};
