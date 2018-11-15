import "reflect-metadata";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { authorsRoutes } from "./routes/AuthorsRoutes";
import { booksRoutes } from "./routes/BooksRoutes";
import { validationErrorProcessor } from "./middlewares/ValidationErrorProcessor";
import { recordNotFoundProcessor } from "./middlewares/RecordNotFoundProcessor";
import { baseErrorProcessor } from "./middlewares/BaseErrorProcessor";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    
    this.app.use("/api/authors", authorsRoutes);
    this.app.use("/api/books", booksRoutes);
    
    this.app.use(validationErrorProcessor);
    this.app.use(recordNotFoundProcessor);
    this.app.use(baseErrorProcessor);
  }
}

export default new App().app;
