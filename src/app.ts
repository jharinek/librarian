import express from "express";
import bodyParser from "body-parser";
import { authorsRoutes } from "./routes/AuthorsRoutes";
import { booksRoutes } from "./routes/BooksRoutes";
import { searchRoutes } from "./routes/SearchRoutes";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use("/api/authors", authorsRoutes);
    this.app.use("/api/books", booksRoutes);
    this.app.use("/api/search", searchRoutes);
  }
}

export default new App().app;
