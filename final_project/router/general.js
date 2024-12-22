const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});

  const { username, password } = req.body;

  if(!username || !password) res.status(403).json({ message: "Please provide username and password"});
  else{
    if(isValid(username)){
      users.push({username, password});
      res.send("User registered successfully"); 
      console.log(users); 
    }else{
      res.status(403).json({ message: "Username already exist. Please provide a unique username"});
    }
  }


  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  if(!books) res.status(404).json({ messsage: "List of books not found"});
  else res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  console.log(books[isbn]);
  if(!books[isbn]) res.status(404).json({ message: `Book with ISBN ${isbn} not found`});
  else res.send(JSON.stringify(books[isbn]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const keys = Object.keys(books);
  const books_by_author = [];

  keys.forEach(key =>{
    // console.log(key)
    if(books[key].author === req.params.author){
      books_by_author.push(books[key]);
    }
  })

  res.send(books_by_author);

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});

  let book = {};
  const keys = Object.keys(books);

  keys.forEach(key =>{
    // console.log(key)
    if(books[key].title === req.params.title){
      book = books[key];
    }
  });

  res.send(book);

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});

  res.send(JSON.stringify(books[req.params.isbn].review));
});

module.exports.general = public_users;
