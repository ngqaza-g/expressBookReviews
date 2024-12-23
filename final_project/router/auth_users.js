const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const JWT_SECRET = 'secretString';

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let isUsernameValid = true;
  users.forEach(user =>{
    if(user.username === username) isUsernameValid = false;
  })
  return isUsernameValid;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

  let isuserAuthenticated = false;
  users.forEach(user=>{
    if(user.username === username && user.password === password) isuserAuthenticated = true;
  })

  return isuserAuthenticated;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const {username, password} = req.body;

  if(!username || !password) return res.status(404).json({ message: "Body Empty"});

  if(authenticatedUser(username, password)){
    const accessToken = jwt.sign({username, password}, JWT_SECRET, { expiresIn: 60 * 60 });
    req.session.authorization = {accessToken};
    return res.send("User sucessfully logged in");
  }

  return res.status(404).json({message: "User Credentials inccorect"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});

  const { isbn }  = req.params;
  const { review } = req.body
  const user = req.user;

  if(books[isbn]){
    books[isbn].reviews[user.username] = review;
  
    console.log(books[isbn].reviews);
    res.send("Review Added");
  }else{
    res.status(404).send("Book not found");
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.user;
  const { isbn } = req.params;

  if(books[isbn]){
  delete books[isbn].reviews[user.username];
  console.log(books[isbn].reviews);
  res.send("Review deleted");
  }else{
    res.status(404).send("Book not found");
  }

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
