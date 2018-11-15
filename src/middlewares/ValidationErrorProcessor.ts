import { ModelValidationError } from "../errors/ModelValidationError";
import { Request, Response } from "express";

export const validationErrorProcessor = (err: ModelValidationError, req: Request, res: Response, next: Function) => {
  if(err instanceof ModelValidationError){
    res.status(422).send({
      data: null,
      errors: err.errorMessages()
    });
  } else{
    next(err);
  }
}