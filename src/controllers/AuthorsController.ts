import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Author } from "../models/Author";

export class AuthorsController {

  public index(req: Request, res: Response) {
    res.status(200).send({
      message: "OK"
    });
  }

  public async create(req: Request, res: Response) {
    // TODO: whitelist params and assign them as an object
    const authorParams = req.body.author
    const newAuthor: Author = new Author();

    newAuthor.firstName = authorParams.firstName;
    newAuthor.lastName = authorParams.lastName;
    await newAuthor.save();

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
