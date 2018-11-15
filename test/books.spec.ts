import "./setup";
import chai from "chai";
import chaiHttp from "chai-http";
import { Author } from "../src/models/Author";
import { Book } from "../src/models/Book";
import server from "./setup";

chai.use(chaiHttp);
const expect = chai.expect

describe("GET /books", async () => {
  before(async () => {
    let author1: Author = Author.create({firstName: "John", lastName: "Tolkien"});
    let author2: Author = Author.create({firstName: "Clive", lastName: "Lewis"});
    await author1.save();
    await author2.save();
    let book1: Book = Book.create({title: "Lord of the Rings", description: "This is awesome!", author: author1});
    await book1.save();
    let book2: Book = Book.create({title: "The Chronicles Narnia", description: "Must read this!", author: author2});
    await book2.save();
  });

  it("Returns all books", () => {

    return chai.request(server).get('/api/books')
      .then(res => {
        let booksData = res.body.data.books;

        expect(booksData.length).to.eql(2);
        expect(booksData[0].title).to.eql("Lord of the Rings");
        expect(booksData[0].description).to.eql("This is awesome!");
        expect(booksData[0].author.firstName).to.eql("John");
        expect(booksData[0].author.lastName).to.eql("Tolkien");
        expect(booksData[1].title).to.eql("The Chronicles Narnia");
        expect(booksData[1].description).to.eql("Must read this!");
        expect(booksData[1].author.firstName).to.eql("Clive");
        expect(booksData[1].author.lastName).to.eql("Lewis");
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

  it("Creates a new book", async () => {
    let author = await Author.create({firstName: "George", lastName: "Orwell"}).save();
    
    return chai.request(server).post('/api/books').type("form").send({
      "book[title]": "Homage to Catalonia",
      "book[description]": "A firsthand account of the brutal conditions of the Spanish Civil War.",
      "book[authorId]": author.id
    })
      .then(res => {
        let bookData = res.body.data.book;

        expect(bookData.title).to.eql("Homage to Catalonia");
        expect(bookData.description).to.eql("A firsthand account of the brutal conditions of the Spanish Civil War.");
        expect(bookData.author.firstName).to.eql("George");
        expect(bookData.author.lastName).to.eql("Orwell");
      })
  })

  it("Returns an error if parameter is missing", () => {

    return chai.request(server).post('/api/books')
      .then(res => {
        expect(res.status).to.eql(422);
        expect("title should not be empty").to.be.oneOf(res.body.errors);
        expect("description should not be empty").to.be.oneOf(res.body.errors);
      })
  })
})

describe("GET /books/:id", async () => {
  let author: Author
  let book: Book

  before(async () => {
    author = Author.create({firstName: "Mike", lastName: "Reader"});
    await author.save();
    book = Book.create({title: "A Book", description: "This is not importatnt test book", author: author});
    await book.save();
  });

  it("Returns book with given id", () => {

    return chai.request(server).get(`/api/books/${book.id}`)
      .then(res => {
        let bookData = res.body.data.book;

        expect(bookData.title).to.eql("A Book");
        expect(bookData.description).to.eql("This is not importatnt test book");
        expect(bookData.author.firstName).to.eql("Mike");
        expect(bookData.author.lastName).to.eql("Reader");
      })
  })
})

describe("PATCH /books/:id", async () => {
  let book: Book

  before(async () => {
    let author = Author.create({firstName: "Oliver", lastName: "Queen"});
    await author.save();
    book = Book.create({title: "Api handbook", description: "Created via API", author: author})
    await book.save();
  });

  it("Updates book with given id", () => {

    return chai.request(server).patch(`/api/books/${book.id}`).type("form").send({
      "book[description]": "Updated via API"
    })
      .then(res => {
        let bookData = res.body.data.book;

        expect(bookData.description).to.eql("Updated via API");
        expect(bookData.title).to.eql("Api handbook");
      })
  })
})

describe("DELETE /books/:id", async () => {
  let book: Book

  before(async () => {
    let author = Author.create({firstName: "Ernest", lastName: "Hemingway"});
    await author.save();
    book = Book.create({title: "Trash book", description: "Created via API", author: author})
    await book.save();
  });

  it("Deletes book with given id", () => {

    return chai.request(server).del(`/api/books/${book.id}`)
      .then(res => {
        let bookData = res.body.data.book;

        expect(bookData.title).to.eql("Trash book");
        expect(bookData.description).to.eql("Created via API");
      })
  })
})
