import { Request, Response } from "express";
import { Book } from "../models/Book";
import { Author } from "../models/Author";
import { getConnection } from "typeorm";

export class BooksController {
  public async index(req: Request, res: Response) {
    const query: string = req.query.q;
    let books: Book[];

    if(query && query.length > 0){
      books = await getConnection()
        .createQueryBuilder()
        .select("book")
        .from(Book, "book")
        .where("book.title ilike :query", { query: `%${query}%` })
        .orWhere("book.description ilike :query", { query: `%${query}%` })
        .getMany();
    } else{
      books = await Book.find();
    }

    res.status(200).send({
      message: `Books count: ${books.length}`
    });
  }

  public async create(req: Request, res: Response) {
    const bookParams = req.body.book
    const newBook: Book = new Book();
    const author: Author = await Author.findOne(bookParams.authorId);

    newBook.title = bookParams.title;
    newBook.description = bookParams.description;
    newBook.author = author;
    await newBook.save;

    res.status(200).send({
      data: {
        book: {
          title: newBook.title,
          description: newBook.description,
          author: {
            firstName: newBook.author.firstName,
            lastName: newBook.author.lastName
          }
        }
      }
    })
  }

  public async update(req: Request, res: Response) {
    const bookParams = req.body.book
    const id: number = req.params.id;

    await getConnection()
      .createQueryBuilder()
      .update(Author)
      .set(bookParams)
      .where("id = :id", { id: id })
      .execute();

    const book: Book = await Book.findOne(id);

    res.status(200).send({
      message: `update: ${book.title}`
    });
  }

  public async show(req: Request, res: Response) {
    const id: number = req.params.id
    const book: Book = await Book.findOne(id);

    res.status(200).send({
      message: `get book: ${book.title}`
    })
  }

  public async destroy(req: Request, res: Response) {
    const id: number = req.params.id;

    await Book.delete(id);

    res.status(200).send({
      message: `book destoryed: ${id}`
    });
  }
}

export const booksController = new BooksController();
