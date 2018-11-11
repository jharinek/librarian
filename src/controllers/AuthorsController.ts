import { Request, Response } from "express";

export class AuthorsController {
  public index(req: Request, res: Response) {
    res.status(200).send({
      message: "OK"
    });
  }

  public create(req: Request, res: Response) {
    res.status(200).send({
      message: "OK"
    });
  }

  public update(req: Request, res: Response) {
    let id: number = req.params.id;
    res.status(200).send({
      message: `update: ${id}`
    });
  }

  public show(req: Request, res: Response) {
    let id: number = req.params.id;
    res.status(200).send({
      message: `get: ${id}`
    });
  }

  public destroy(req: Request, res: Response) {
    let id: number = req.params.id;
    res.status(200).send({
      message: `destroy ${id}`
    });
  }
}

export const authorsController = new AuthorsController();
