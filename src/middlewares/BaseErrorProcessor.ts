import { Request, Response } from "express";

export const baseErrorProcessor = (err: Error, req: Request, res: Response, next: Function) => {
  console.log(err.stack);

  res.status(500).send({
    data: null,
    errors: ["Server encountered an error."]
  });
}