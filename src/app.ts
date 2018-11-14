import "reflect-metadata";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { authorsRoutes } from "./routes/AuthorsRoutes";
import { booksRoutes } from "./routes/BooksRoutes";
import { ModelValidationError } from "./errors/ModelValidationError";

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
    
    this.app.use((err: ModelValidationError, req: Request, res: Response, next: Function) => {
      if(err instanceof ModelValidationError){
        res.status(200).send({
          data: null,
          errors: err.errorMessages()
        });
      } else{
        next(err);
      }
      
    });

    this.app.use((err: Error, req: Request, res: Response, next: Function) => {
      console.log(err.stack);

      res.status(500).send({
        data: null,
        errors: ["Server encountered an error."]
      });
    });
  }
}

export default new App().app;
