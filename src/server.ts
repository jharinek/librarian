import { createConnection } from "typeorm";
import app from "./app";
const PORT = 3000;

createConnection().then(async connection => {
  app.listen(PORT, () => {
    console.log("Express server listening on port " + PORT);
  });
}).catch(error => console.log(`TypeORM connection error: ${error}`));
