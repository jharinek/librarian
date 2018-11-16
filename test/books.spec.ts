import "./setup";
import chai from "chai";
import chaiHttp from "chai-http";
import { Author } from "../src/models/Author";
import { Book } from "../src/models/Book";
import server from "./setup";
import { getConnection } from "typeorm";

chai.use(chaiHttp);
const expect = chai.expect

describe("Book routes", () => {
  before(async () => {
    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Book)
    .execute();

    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Author)
    .execute();
  });

  describe("GET /books", async () => {
    before(async () => {
      let author1: Author = Author.create({firstName: "John", lastName: "Tolkien"});
      let author2: Author = Author.create({firstName: "Clive", lastName: "Lewis"});
      await author1.save();
      await author2.save();
      let book1: Book = Book.create({title: "Lord of the Rings", description: "This is awesome!", authors: [author1]});
      await book1.save();
      let book2: Book = Book.create({title: "The Chronicles Narnia", description: "Must read this!", authors: [author2]});
      await book2.save();
    });
  
    it("Returns all books", () => {
  
      return chai.request(server).get('/api/books')
        .then(res => {
          let booksData = res.body.data.books;
  
          expect(booksData.length).to.eql(2);
          expect(booksData[0].title).to.eql("Lord of the Rings");
          expect(booksData[0].description).to.eql("This is awesome!");
          expect(booksData[0].authors[0].firstName).to.eql("John");
          expect(booksData[0].authors[0].lastName).to.eql("Tolkien");
          expect(booksData[1].title).to.eql("The Chronicles Narnia");
          expect(booksData[1].description).to.eql("Must read this!");
          expect(booksData[1].authors[0].firstName).to.eql("Clive");
          expect(booksData[1].authors[0].lastName).to.eql("Lewis");
        })
    })
  
    it("Returns books that comply with query", () => {
  
      return chai.request(server).get('/api/books?q=ring')
        .then(res => {
          let booksData = res.body.data.books;
  
          expect(booksData.length).to.eql(1);
          expect(booksData[0].title).to.eql("Lord of the Rings");
          expect(booksData[0].description).to.eql("This is awesome!");
        })
    })
  })
  
  describe("POST /books", async () => {
  
    it("Creates a new book with multiple authors", async () => {
      let author1 = await Author.create({firstName: "George", lastName: "Orwell"}).save();
      let author2 = await Author.create({firstName: "Juraj", lastName: "Well"}).save();
      
      return chai.request(server).post('/api/books').type("form").send({
        "book[title]": "Homage to Catalonia",
        "book[description]": "A firsthand account of the brutal conditions of the Spanish Civil War.",
        "book[authorIds]": `[${author1.id}, ${author2.id}]`
      })
        .then(async res => {
          let bookData = res.body.data.book;
  
          expect(bookData.title).to.eql("Homage to Catalonia");
          expect(bookData.description).to.eql("A firsthand account of the brutal conditions of the Spanish Civil War.");
          expect(bookData.authors[0].firstName).to.eql("George");
          expect(bookData.authors[0].lastName).to.eql("Orwell");
          expect(bookData.authors[1].firstName).to.eql("Juraj");
          expect(bookData.authors[1].lastName).to.eql("Well");

          let bookFromDb = await Book.findOne({title: "Homage to Catalonia"})
          expect(bookFromDb.title).to.eql("Homage to Catalonia");
        })
    })
  
    it("Returns an error if parameter is missing", () => {
  
      return chai.request(server).post('/api/books')
        .then(res => {
          expect(res.status).to.eql(422);
          expect("title should not be empty").to.be.oneOf(res.body.errors);
          expect("description should not be empty").to.be.oneOf(res.body.errors);
          expect("authors should not be empty").to.be.oneOf(res.body.errors)
        })
    })
  })
  
  describe("GET /books/:id", async () => {
    let author: Author
    let book: Book
  
    before(async () => {
      author = Author.create({firstName: "Mike", lastName: "Reader"});
      await author.save();
      book = Book.create({title: "A Book", description: "This is not importatnt test book", authors: [author]});
      await book.save();
    });
  
    it("Returns book with given id", () => {
  
      return chai.request(server).get(`/api/books/${book.id}`)
        .then(res => {
          let bookData = res.body.data.book;
  
          expect(bookData.title).to.eql("A Book");
          expect(bookData.description).to.eql("This is not importatnt test book");
          expect(bookData.authors[0].firstName).to.eql("Mike");
          expect(bookData.authors[0].lastName).to.eql("Reader");
        })
    })
  })
  
  describe("PATCH /books/:id", async () => {
    let book: Book
  
    before(async () => {
      let author = Author.create({firstName: "Oliver", lastName: "Queen"});
      await author.save();
      book = Book.create({title: "Api handbook", description: "Created via API", authors: [author]})
      await book.save();
    });
  
    it("Updates book with given id", () => {
  
      return chai.request(server).patch(`/api/books/${book.id}`).type("form").send({
        "book[description]": "Updated via API"
      })
        .then(async res => {
          let bookData = res.body.data.book;
          
          expect(bookData.title).to.eql("Api handbook");
          expect(bookData.description).to.eql("Updated via API");

          let bookFromDb = await Book.findOne({title: "Api handbook"})
          expect(bookFromDb.title).to.eql("Api handbook");
        })
    })
  })
  
  describe("DELETE /books/:id", async () => {
    let book: Book
  
    before(async () => {
      let author = Author.create({firstName: "Ernest", lastName: "Hemingway"});
      await author.save();
      book = Book.create({title: "Trash book", description: "Created via API", authors: [author]})
      await book.save();
    });
  
    it("Deletes book with given id", () => {
  
      return chai.request(server).del(`/api/books/${book.id}`)
        .then(async res => {
          let bookData = res.body.data.book;
  
          expect(bookData.title).to.eql("Trash book");
          expect(bookData.description).to.eql("Created via API");

          let bookFromDb = await Book.findOne({title: "Trash book"})
          expect(bookFromDb).to.eql(undefined);
        })
    })
  })  
})
