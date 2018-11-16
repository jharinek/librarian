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
        .leftJoinAndSelect("book.authors", "author")
        .where("book.title ilike :query", { query: `%${query}%` })
        .orWhere("book.description ilike :query", { query: `%${query}%` })
        .getMany();
    } else{
      books = await Book.find({ relations: ["authors"] } );
    }

    res.status(200).send({
      data: {
        books: books.map(book => book.serialize())
      }
    });
  }

  public async create(req: Request, res: Response) {
    const createParams = this.bookParams(req);
    const newBook: Book = Book.create(createParams);
    let authors: Author[] 
    
    if(createParams["authorIds"]){
      authors = await Author.findByIds(createParams["authorIds"])
      
      if(authors.length === 0){
        throw new RecordNotFound(createParams["authorIds"]);
      }
    }
    newBook.authors = authors;
    
    await newBook.save();

    res.status(200).send({
      data: {
        book: newBook.serialize()
      }
    })
  }

  public async update(req: Request, res: Response) {
    const id: number = req.params.id;
    const book: Book = await Book.findOne(id, {relations: ["authors"]});
    const updateParams = this.bookParams(req);
    let authors: Author[]
    
    if(updateParams["authorIds"]){
      authors = await Author.findByIds(updateParams["authorIds"]); 
    }
    
    book.title = updateParams.title || book.title;
    book.description = updateParams.description || book.description;
    book.authors = authors || book.authors;

    await book.save();
  
    res.status(200).send({
      data: {
        book: book.serialize()
      }
    });
  }

  public async show(req: Request, res: Response) {
    const id: number = req.params.id
    const book: Book = await Book.findOne(id, {relations: ["authors"]});
    
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
    let book: Book = await Book.findOne(id, {relations: ["authors"]});

    await book.remove();

    res.status(200).send({
      data: {
        book: book.serialize()
      }
    });
  }

  private bookParams(req: Request): {title: string, description: string, authorIds: number[]} {
    const bookObject = req.body.book

    return {
      title: bookObject && bookObject["title"], 
      description: bookObject && bookObject["description"],
      authorIds: bookObject && bookObject["authorIds"] && JSON.parse(bookObject["authorIds"])
    }
  }
}

export const booksController = new BooksController();
