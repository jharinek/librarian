process.env.NODE_ENV = "test";

import app from "../src/app";
import chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);
const expect = chai.expect
let server = app.listen(3011);

after(done => { 
  server.close(done);
});

describe('Hello API Request', () => {
  it('should return response on call', () => {
    return chai.request(server).get('/api/authors')
      .then(res => {
        expect(res.text).to.eql('{"data":{"authors":[]}}');
      })
  })
})