import * as express from "express";
import { authorsController } from "../controllers/AuthorsController";

class AuthorsRoutes {
  public router: express.Router = express.Router();

  constructor() {
    this.config();
  }

  private config(): void {
    this.router.get("/", (req: express.Request, res: express.Response) => 
      authorsController.index(req, res)
    );
  }
}

export const authorsRoutes = new AuthorsRoutes().router;
