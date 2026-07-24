import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { atencionService } from "../services/atencion.service";
import { createAtencionSchema, listAtencionesQuerySchema, updateAtencionSchema } from "../validators/atencion.validators";

export const atencionController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = listAtencionesQuerySchema.parse(req.query);
    const result = await atencionService.list(query);
    res.json(result);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const atencion = await atencionService.getById(Number(req.params.id));
    res.json(atencion);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const input = createAtencionSchema.parse(req.body);
    const atencion = await atencionService.create(input);
    res.status(201).json(atencion);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const input = updateAtencionSchema.parse(req.body);
    const atencion = await atencionService.update(Number(req.params.id), input);
    res.json(atencion);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const isAdmin = req.user?.role === "ADMINISTRADOR";
    await atencionService.remove(Number(req.params.id), isAdmin);
    res.status(204).send();
  }),

  profesionales: asyncHandler(async (_req: Request, res: Response) => {
    const data = await atencionService.profesionales();
    res.json(data);
  }),
};
