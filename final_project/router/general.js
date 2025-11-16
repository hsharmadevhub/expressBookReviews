const express = require("express");
let books = require("./booksdb.js");
let doesUserExist = require("./auth_users.js").doesUserExist;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(404).json({ message: "Username and password are required" });
  }

  if (doesUserExist(req.body.username)) {
    return res.status(404).json({ message: "Username already exists" });
  }

  users.push({"username": req.body.username, "password": req.body.password});

  return res.status(200).json({ message: `User ${req.body.username} registered successfully` });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const matchingBooksByAuthor = Object.values(books).filter(book => book.author.toLowerCase().includes(req.params.author.toLowerCase()));

  if (matchingBooksByAuthor.length == 0) {
    return res.status(404).json({ messsage: `No books found with the author: ${req.params.author}` });
  }

  return res.status(200).json(matchingBooksByAuthor);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const matchingBooksByTitle = Object.values(books).filter(book => book.title.toLowerCase().includes(req.params.title.toLowerCase()));

  if (matchingBooksByTitle.length == 0) {
    return res.status(404).json({ messsage: `No books found with the title: ${req.params.title}` });
  }

  return res.status(200).json(matchingBooksByTitle);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
