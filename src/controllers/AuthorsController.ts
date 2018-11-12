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
    const authorParams = req.body.author
    const newAuthor: Author = new Author();

    newAuthor.firstName = authorParams.firstName;
    newAuthor.lastName = authorParams.lastName;
    await newAuthor.save();

    res.status(200).send({
      message: "OK"
    });
  }

  public async update(req: Request, res: Response) {
    const authorParams = req.body.author
    const id: number = req.params.id;

    await getConnection()
      .createQueryBuilder()
      .update(Author)
      .set(authorParams)
      .where("id = :id", { id: id })
      .execute();

    const author: Author = await Author.findOne(id);

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
    
    await Author.delete(id);

    res.status(200).send({
      message: `destroy ${id}`
    });
  }
}

export const authorsController = new AuthorsController();
