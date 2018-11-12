import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import { authorsRoutes } from "./routes/AuthorsRoutes";
import { booksRoutes } from "./routes/BooksRoutes";

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
  }
}

export default new App().app;
