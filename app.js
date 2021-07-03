//jshint esversion:6
//require all the modules
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");



//use the required modules
//connect to DB
mongoose.connect("mongodb://localhost:27017/usersDB", { useNewUrlParser : true });
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

//create a schema
const userSchema = new mongoose.Schema({
  password : String,
  email : String
});



userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);

app.get("/",(req,res)=>{
  res.render("home");
});

app.get("/login",(req,res)=>{
  res.render("login");
});

app.get("/register",(req,res)=>{
  res.render("register");
});

app.post("/register",(req,res)=>{
  const newUser = new User ({
    email : req.body.email,
    password : req.body.password
  });

  newUser.save((err)=>{
    if(!err){
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});

app.post("/login",(req,res)=>{
  User.findOne({ email : req.body.email}, (err,userDetail)=>{
    if(!err){
      if(userDetail){
        if(userDetail.password === req.body.password){
          res.render("secrets");
        }
      } else {
        res.redirect("/register");
      }
    } else {
      console.log(err);
    }
  });
});

app.listen(3000,(req,res)=>{
  console.log("The Website is live!");
});
