import { Request, Response } from "express";

export class AuthorsController {
  public index(req: Request, res: Response) {
    res.status(200).send({
      message: "Here are authors!!"
    });
  }

  public create(req: Request, res: Response) {

  }

  public update(req: Request, res: Response) {
    
  }

  public get(req: Request, res: Response) {
    
  }

  public destroy(req: Request, res: Response) {
    
  }
}

export const authorsController = new AuthorsController();
