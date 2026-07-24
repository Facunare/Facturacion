import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { clienteService } from "../services/cliente.service";
import { createClienteSchema, listClientesQuerySchema, updateClienteSchema } from "../validators/cliente.validators";

export const clienteController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = listClientesQuerySchema.parse(req.query);
    const result = await clienteService.list(query);
    res.json(result);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const cliente = await clienteService.getById(Number(req.params.id));
    res.json(cliente);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const input = createClienteSchema.parse(req.body);
    const cliente = await clienteService.create(input);
    res.status(201).json(cliente);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const input = updateClienteSchema.parse(req.body);
    const cliente = await clienteService.update(Number(req.params.id), input);
    res.json(cliente);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await clienteService.remove(Number(req.params.id));
    res.status(204).send();
  }),

  obrasSociales: asyncHandler(async (_req: Request, res: Response) => {
    const data = await clienteService.obrasSociales();
    res.json(data);
  }),
};
