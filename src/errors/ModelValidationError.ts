import { ValidationError } from "class-validator";

export class ModelValidationError extends Error {
  public modelErrors: ValidationError[];

  constructor(message?: string, modelErrors?: ValidationError[]){
    super(message);
    this.modelErrors = modelErrors;
    Object.setPrototypeOf(this, new.target.prototype)
  }

  public errorMessages(): string[] {
    return this.modelErrors.map(error => {
      let errorMessage: string = "";

      for(let key in error.constraints){
        errorMessage += `${error.constraints[key]}, `;
      }

      return errorMessage
    });
  }
}
