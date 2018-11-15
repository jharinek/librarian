import "./setup";
import chai from "chai";
import chaiHttp from "chai-http";
import { Author } from "../src/models/Author";
import { Book } from "../src/models/Book";
import server from "./setup";
import { getConnection } from "typeorm";

chai.use(chaiHttp);
const expect = chai.expect
describe("Author routes", () => {
  before(async () => {
    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Author)
    .execute();
  });

  describe("GET /authors", async () => {
    before(async () => {
      let author1: Author = Author.create({firstName: "James", lastName: "Cook"});
      let author2: Author = Author.create({firstName: "Mike", lastName: "Well"});
      await author1.save();
      await author2.save();
      let book: Book = Book.create({title: "The Book", description: "This is an importatnt test book", author: author1});
      await book.save();
    });
  
    it("Returns all authors call", () => {
  
      return chai.request(server).get('/api/authors')
        .then(res => {
          let authorsData = res.body.data.authors;
          let jamesData = authorsData[0];
  
          expect(authorsData.length).to.eql(2);
          expect(jamesData.firstName).to.eql("James");
          expect(jamesData.lastName).to.eql("Cook");
          expect(jamesData.books[0].title).to.eql("The Book");
          expect(jamesData.books[0].description).to.eql("This is an importatnt test book");
        })
    })
  
    it("Returns authors that comply with query", () => {
  
      return chai.request(server).get('/api/authors?q=james')
        .then(res => {
          let authorsData = res.body.data.authors;
          let jamesData = authorsData[0];
  
          expect(authorsData.length).to.eql(1);
          expect(jamesData.firstName).to.eql("James");
          expect(jamesData.lastName).to.eql("Cook");
        })
    })
  })
  
  describe("POST /authors", async () => {
  
    it("Creates a new author", () => {
  
      return chai.request(server).post('/api/authors').type("form").send({
        "author[firstName]": "John",
        "author[lastName]": "Doe" 
      })
        .then(res => {
          let authorData = res.body.data.author;
  
          expect(authorData.firstName).to.eql("John");
          expect(authorData.lastName).to.eql("Doe");
        })
    })
  
    it("Returns an error if parameter is missing", () => {
  
      return chai.request(server).post('/api/authors')
        .then(res => {
          expect(res.status).to.eql(422);
          expect("firstName should not be empty").to.be.oneOf(res.body.errors);
          expect("lastName should not be empty").to.be.oneOf(res.body.errors);
        })
    })
  })
  
  describe("GET /authors/:id", async () => {
    let author: Author
  
    before(async () => {
      author = Author.create({firstName: "Mike", lastName: "Well"});
      await author.save();
      let book: Book = Book.create({title: "Another Book", description: "This is second importatnt test book", author: author});
      await book.save();
    });
  
    it("Returns author with given id", () => {
  
      return chai.request(server).get(`/api/authors/${author.id}`)
        .then(res => {
          let authorData = res.body.data.author;
  
          expect(authorData.firstName).to.eql("Mike");
          expect(authorData.lastName).to.eql("Well");
          expect(authorData.books[0].title).to.eql("Another Book");
          expect(authorData.books[0].description).to.eql("This is second importatnt test book");
        })
    })
  })
  
  describe("PATCH /authors/:id", async () => {
    let author: Author
  
    before(async () => {
      author = Author.create({firstName: "Oliver", lastName: "Queen"});
      await author.save();
    });
  
    it("Updates author with given id", () => {
  
      return chai.request(server).patch(`/api/authors/${author.id}`).type("form").send({
        "author[firstName]": "John"
      })
        .then(res => {
          let authorData = res.body.data.author;
  
          expect(authorData.firstName).to.eql("John");
          expect(authorData.lastName).to.eql("Queen");
        })
    })
  })
  
  describe("DELETE /authors/:id", async () => {
    let author: Author
  
    before(async () => {
      author = Author.create({firstName: "Ernest", lastName: "Hemingway"});
      await author.save();
    });
  
    it("Deletes author with given id", () => {
  
      return chai.request(server).del(`/api/authors/${author.id}`)
        .then(res => {
          let authorData = res.body.data.author;
  
          expect(authorData.firstName).to.eql("Ernest");
          expect(authorData.lastName).to.eql("Hemingway");
        })
    })
  })  
})