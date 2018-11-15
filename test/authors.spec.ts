process.env.NODE_ENV = "test";

import app from "../src/app";
import chai from "chai";
import chaiHttp from "chai-http";
import { createConnection, getConnectionOptions } from "typeorm";

chai.use(chaiHttp);
const expect = chai.expect
let server = app.listen(3011);

before(async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  await createConnection({...connectionOptions, name: "default"});
});

describe('Hello API Request', () => {
  it('should return response on call', () => {
    return chai.request(server).get('/api/authors')
      .then(res => {
        expect(res.text).to.eql('{"data":{"authors":[]}}');
      })
  })
})