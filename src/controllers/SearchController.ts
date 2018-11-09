import { Request, Response } from "express";

export class SearchController {
  public search(req: Request, res: Response) {
    res.status(200).send({
      message: "This is search endpoint"
    });
  }
}

export const searchController = new SearchController();
