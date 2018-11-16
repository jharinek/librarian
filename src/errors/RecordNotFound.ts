export class RecordNotFound extends Error {
  constructor(modelName: string, id: number | number[]){
    super(`${modelName} with id ${id} was not found!`);
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
