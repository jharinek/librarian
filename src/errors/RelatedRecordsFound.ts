export class RelatedRecordsFound extends Error {
  constructor(parentModelName: string, relatedModelName: string){
    super(`${parentModelName} has related instances of ${relatedModelName} and can't be deleted! Resolve this first!`);
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
