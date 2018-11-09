import * as express from "express";
import { searchController } from "../controllers/SearchController";

class SearchRoutes {
  public router: express.Router = express.Router();

  constructor() {
    this.config();
  }

  private config(): void {
    this.router.get("/", (req: express.Request, res: express.Response) => 
      searchController.search(req, res)
    );
  }
}

export const searchRoutes = new SearchRoutes().router;
