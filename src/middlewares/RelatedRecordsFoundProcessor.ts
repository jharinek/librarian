import { RelatedRecordsFound } from "../errors/RelatedRecordsFound";
import { Request, Response } from "express";

export const relatedRecordsFoundProcessor = (err: RelatedRecordsFound, req: Request, res: Response, next: Function) => {
  if(err instanceof RelatedRecordsFound){
    res.status(422).send({
      data: null,
      errors: [err.message]
    });
  } else {
    next(err);
  }
}
