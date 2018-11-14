import { createConnection } from "typeorm";
import app from "./app";
const PORT = process.env.PORT || 3000

createConnection().then(async connection => {}).catch(error => console.log(`TypeORM connection error: ${error}`));

app.listen(PORT, () => {
  console.log("Express server listening on port " + PORT);
});

