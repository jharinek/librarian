import { Request, Response } from "express";
import { Author } from "../models/Author";
import { getConnection } from "typeorm";
import { RecordNotFound } from "../errors/RecordNotFound";

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
      data: {
        authors: authors.map(author => author.serialize())
      }
    });
  }

  public async create(req: Request, res: Response) {
    const newAuthor: Author = Author.create(this.authorParams(req));

    await newAuthor.save();

    res.status(200).send({
      data: {
        author: newAuthor.serialize()
      }
    });
  }

  public async update(req: Request, res: Response) {
    const id: number = req.params.id;
    const author: Author = await Author.findOne(id);
    const updateParams = this.authorParams(req);
    
    author.firstName = updateParams.firstName || author.firstName;
    author.lastName = updateParams.lastName || author.lastName;
    
    await author.save();
    
    res.status(200).send({
      data: {
        author: author.serialize()
      }
    });
  }

  public async show(req: Request, res: Response) {
    const id: number = req.params.id;
    const author: Author = await Author.findOne(id)

    if(!author){
      throw new RecordNotFound(id);
    }

    res.status(200).send({
      data: {
        author: author.serialize()
      }
    });
  }

  public async destroy(req: Request, res: Response) {
    const id: number = req.params.id;
    const author: Author = await Author.findOne(id);
    
    await author.remove();

    res.status(200).send({
      data: {
        author: author.serialize()
      }
    });
  }

  private authorParams(req: Request): {firstName: string, lastName: string} {
    const authorParams = req.body.author

    return {
      firstName: authorParams &&  authorParams["firstName"], 
      lastName: authorParams && authorParams["lastName"]
    }
  }
}

export const authorsController = new AuthorsController();
