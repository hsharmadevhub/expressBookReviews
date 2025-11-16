const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const doesUserExist = (username)=>{ //returns boolean
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  if (!doesUserExist(username)) {
    return false;
  }

  const matchingUser = users.find(user => user.username === username);
  return matchingUser.password === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(404).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(req.body.username, req.body.password)) {
    return res.status(404).json({ message: "Incorrect username and/or password" });
  }

  let accessToken = jwt.sign({
    username: req.body.username
  }, "fingerprint_customer", { expiresIn: 60 * 60 });

  req.session.authorization = {
    accessToken,
    username: req.body.username
  }

  return res.status(200).json({message: "User successfully logged in"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.doesUserExist = doesUserExist;
module.exports.users = users;
