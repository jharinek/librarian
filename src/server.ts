import { createConnection, getConnectionOptions } from "typeorm";
import app from "./app";

const PORT = process.env.PORT || 3000
const ENV = process.env.NODE_ENV || "development"

export const startServer = async () => {
  const connectionOptions = await getConnectionOptions(ENV);
  await createConnection({...connectionOptions, name: "default"});

  app.listen(PORT, () => {
    console.log("Express server listening on port " + PORT);
  });
}

startServer();
