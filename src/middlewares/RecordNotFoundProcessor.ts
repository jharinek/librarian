import { RecordNotFound } from "../errors/RecordNotFound";
import { Request, Response } from "express";

export const recordNotFoundProcessor = (err: RecordNotFound, req: Request, res: Response, next: Function) => {
  if(err instanceof RecordNotFound){
    res.status(404).send({
      data: null,
      errors: [err.message]
    });
  } else {
    next(err);
  }
}