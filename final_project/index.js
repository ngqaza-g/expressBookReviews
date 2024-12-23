const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const PORT =5000;
const JWT_SECRET = 'secretString';

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if(!req.session.authorization) return res.status(403).json({ message: "User not logged in"});
    
    let token = req.session.authorization['accessToken'];
    console.log(token);
    jwt.verify(token, JWT_SECRET, (err, user)=>{
        if(err) return res.status(403).json({ messagge: "User not authenticated" });
        req.user = user;
        console.log(user);

        next();
    })

});
 


app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
