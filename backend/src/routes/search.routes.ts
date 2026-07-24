import { Router } from "express";
import { searchController } from "../controllers/search.controller";
import { requireAuth } from "../middlewares/auth.middleware";

export const searchRouter = Router();

searchRouter.use(requireAuth);
searchRouter.get("/", searchController.search);
