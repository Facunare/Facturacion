import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { searchService } from "../services/search.service";

export const searchController = {
  search: asyncHandler(async (req: Request, res: Response) => {
    const term = String(req.query.q || "");
    const result = await searchService.globalSearch(term);
    res.json(result);
  }),
};
