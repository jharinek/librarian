import { Request, Response } from "express";
import { Author } from "../models/Author";
import { getConnection } from "typeorm";

export class AuthorsController {
  public async index(req: Request, res: Response) {
    const query: string = req.query.q;
    let authors: Author[];
    
    if(query && query.length > 0){
      authors = await getConnection()
        .createQueryBuilder()
        .select("author")
        .from(Author, "author")
        .where("author.firstName ilike :query", { query: `%${query}%` })
        .orWhere("author.lastName ilike :query", { query: `%${query}%` })
        .getMany();
    } else{
      authors = await Author.find();
    }

    res.status(200).send({
      message: `OK ${authors.length}`
    });
  }

  public async create(req: Request, res: Response) {
    const newAuthor: Author = Author.create(this.authorParams(req));

    await newAuthor.save();

    res.status(200).send({
      message: "OK"
    });
  }

  public async update(req: Request, res: Response) {
    const id: number = req.params.id;
    const author: Author = await Author.findOne(id);
    
    await Author.update(author, this.authorParams(req));
    
    res.status(200).send({
      message: `update: ${author.firstName}`
    });
  }

  public async show(req: Request, res: Response) {
    const id: number = req.params.id;
    const author: Author = await Author.findOne(id);

    res.status(200).send({
      message: `get: ${author.firstName}`
    });
  }

  public async destroy(req: Request, res: Response) {
    const id: number = req.params.id;
    const author: Author = await Author.findOne(id);
    
    await author.remove();

    res.status(200).send({
      message: `destroy ${id}`
    });
  }

  private authorParams(req: Request): {firstName: string, lastName: string} {
    const authorParams = req.body.author

    return {
      firstName: authorParams["firstName"], 
      lastName: authorParams["lastName"]
    }
  }
}

export const authorsController = new AuthorsController();
