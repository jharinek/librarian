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

    this.router.post("/", (req: express.Request, res: express.Response, next: Function) => 
      authorsController.create(req, res)
        .then(() => next())
        .catch(err => next(err))
    );

    this.router.patch("/:id", (req: express.Request, res: express.Response) => 
      authorsController.update(req, res)
    );

    this.router.get("/:id", (req: express.Request, res: express.Response) => 
      authorsController.show(req, res)
    );

    this.router.delete("/:id", (req: express.Request, res: express.Response) => 
      authorsController.destroy(req, res)
    );
  }
}

export const authorsRoutes = new AuthorsRoutes().router;
