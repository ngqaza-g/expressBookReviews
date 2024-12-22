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
  const user = req.body.user;

  if(!user) return res.status(404).json({ message: "Body Empty"});

  if(authenticatedUser(user.username, user.password)){
    const accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: 60 * 60 });
    req.session.authorization = {accessToken};
    return res.send("User sucessfully logged in");
  }

  return res.status(404).json({message: "User Credentials inccorect"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
