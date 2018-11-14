import { Request, Response } from "express";
import { Book } from "../models/Book";
import { Author } from "../models/Author";
import { getConnection } from "typeorm";
import { RecordNotFound } from "../errors/RecordNotFound";

export class BooksController {
  public async index(req: Request, res: Response) {
    const query: string = req.query.q;
    let books: Book[];

    if(query && query.length > 0){
      books = await getConnection()
        .createQueryBuilder()
        .select("book")
        .from(Book, "book")
        .leftJoinAndSelect("book.author", "author")
        .where("book.title ilike :query", { query: `%${query}%` })
        .orWhere("book.description ilike :query", { query: `%${query}%` })
        .getMany();
    } else{
      books = await Book.find({ relations: ["author"] } );
    }

    res.status(200).send({
      data: {
        books: books.map(book => book.serialize())
      }
    });
  }

  public async create(req: Request, res: Response) {
    const params = this.bookParams(req);
    const newBook: Book = Book.create(params);
    const author: Author = await Author.findOne(params["authorId"]);    
    newBook.author = author;
    
    await newBook.save();

    res.status(200).send({
      data: {
        book: newBook.serialize()
      }
    })
  }

  public async update(req: Request, res: Response) {
    const id: number = req.params.id;
    const book: Book = await Book.findOne(id, {relations: ["author"]});
    const updateParams = this.bookParams(req);
    const author: Author = await Author.findOne(updateParams["authorId"]); 
    
    book.title = updateParams.title || book.title;
    book.description = updateParams.description || book.description;
    book.author = author || book.author;

    await book.save();
  
    res.status(200).send({
      data: {
        book: book.serialize()
      }
    });
  }

  public async show(req: Request, res: Response) {
    const id: number = req.params.id
    const book: Book = await Book.findOne(id, {relations: ["author"]});
    
    if(!book){
      throw new RecordNotFound(id);
    }

    res.status(200).send({
      data: {
        book: book.serialize()
      }
    })
  }

  public async destroy(req: Request, res: Response) {
    const id: number = req.params.id;
    let book: Book = await Book.findOne(id, {relations: ["author"]});

    await book.remove();

    res.status(200).send({
      data: {
        book: book.serialize()
      }
    });
  }

  private bookParams(req: Request): {title: string, description: string, authorId: number} {
    const bookObject = req.body.book

    return {
      title: bookObject && bookObject["title"], 
      description: bookObject && bookObject["description"],
      authorId: bookObject && bookObject["authorId"]
    }
  }
}

export const booksController = new BooksController();
