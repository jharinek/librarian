import { getConnectionOptions, createConnection } from "typeorm"
import app from "../src/app";

let loaded = false
let server: any
process.env.NODE_ENV = "test";

export const setup = () => {
  if(loaded) {
    return;
  }

  server = app.listen(3011);

  before(async () => {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    await createConnection({...connectionOptions, name: "default"});
  });

  loaded = true;
}

setup();

export default server;
