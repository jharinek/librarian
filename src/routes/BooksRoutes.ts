import * as express from "express";
import { booksController } from "../controllers/BooksController";

class BooksRoutes {
  public router: express.Router = express.Router();

  constructor() {
    this.config();
  }

  private config(): void {
    this.router.get("/", (req: express.Request, res: express.Response, next: Function) => 
      booksController.index(req, res)
        .then(() => next())
        .catch(err => next(err))
    );

    this.router.post("/", (req: express.Request, res: express.Response, next: Function) => 
      booksController.create(req, res)
        .then(() => next())
        .catch(err => next(err))
    );

    this.router.patch("/:id", (req: express.Request, res: express.Response, next: Function) => 
      booksController.update(req, res)
        .then(() => next())
        .catch(err => next(err))
    );

    this.router.get("/:id", (req: express.Request, res: express.Response, next: Function) => 
      booksController.show(req, res)
        .then(() => next())
        .catch(err => next(err))
    );

    this.router.delete("/:id", (req: express.Request, res: express.Response, next: Function) => 
      booksController.destroy(req, res)
        .then(() => next())
        .catch(err => next(err))
    );
  }
}

export const booksRoutes = new BooksRoutes().router;
