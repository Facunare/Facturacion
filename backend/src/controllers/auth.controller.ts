import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authService } from "../services/auth.service";
import { loginSchema } from "../validators/auth.validators";

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    res.json(result);
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    res.json({ user: req.user });
  }),
};
