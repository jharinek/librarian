import { Request, Response } from "express";
import { Book } from "../models/Book";
import { Author } from "../models/Author";
import { getConnection, Like, createQueryBuilder } from "typeorm";

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
    const book: Book = await Book.findOne(id);

    await Book.update(book, this.bookParams(req));
  
    res.status(200).send({
      data: {
        book: book.serialize()
      }
    });
  }

  public async show(req: Request, res: Response) {
    const id: number = req.params.id
    const book: Book = await Book.findOne(id);

    res.status(200).send({
      data: {
        book: book.serialize()
      }
    })
  }

  public async destroy(req: Request, res: Response) {
    const id: number = req.params.id;
    let book: Book = await Book.findOne(id);

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
      title: bookObject["title"], 
      description: bookObject["description"],
      authorId: bookObject["authorId"]
    }
  }
}

export const booksController = new BooksController();
