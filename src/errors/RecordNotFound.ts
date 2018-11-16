export class RecordNotFound extends Error {
  constructor(id: number | number[]){
    super(`Record with id: ${id} was not found!`);
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
