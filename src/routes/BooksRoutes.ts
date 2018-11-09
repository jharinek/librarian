import * as express from "express";
import { booksController } from "../controllers/BooksController";

class BooksRoutes {
  public router: express.Router = express.Router();

  constructor() {
    this.config();
  }

  private config(): void {
    this.router.get("/", (req: express.Request, res: express.Response) => 
      booksController.index(req, res)
    );
  }
}

export const booksRoutes = new BooksRoutes().router;
