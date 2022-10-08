//console.log("Hello Word");
var msg=require("./salam.js");
msg;

/*
const express = require('express');
const app = express();
 
//route untuk halaman home
app.get('/',(req, res) => {
  res.send('Welcome To Express');
});
 
//route untuk halaman about
app.get('/about',(req, res) => {
  res.send('This is about page');
});
 
app.listen(3000, () => {
  console.log('Server is running at port 3000');
});
*/

const path = require('path');
const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const hbs = require('hbs');
const bodyParser = require('body-parser');

const app = express();

//db config
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodedb'
});
 
//connect db
db.connect( (err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
 
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

//config library session
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 't@1k0ch3ng',
    name: 'secretName',
    cookie: {
        sameSite: true,
        maxAge: 60000
    },
}));

//route login form
app.get('/',(req, res) => {
  res.render('index', {
  title:"User Login"
  })
});

//route proses login
app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let err = false;

    if (username && password) {
     let sql="SELECT * FROM pengguna where username=? and password=? ";
     db.query(sql, [username, password], function(err, results){

        if (err) throw err;
            if (results.length > 0) {

                req.session.loggedin = true;
                req.session.username = username;

                res.render('home', { 
                   title : "My Home Page",
                   username: username,
                   password: password
                });

        } else {
            res.send('Incorrect Username and/or Password!');
            res.end();
        }  
           
        });

    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
});
 
//route about
app.get('/about',(req, res) => {
  res.send('This is about page');
});

//route test
app.get('/test', function(req, res) {

  if (req.session.loggedin==true) {

    //res.send('Welcome back, ' + req.session.username + '!');
    res.render("test", {
      title : "MY Home Page"
    });

  } else {

    res.send('Please login to view this page!');
  }
  
  //res.end();

});

//route get all users
app.get('/users',(req, res) => {
  let sql="SELECT * FROM pengguna";
  let query=db.query(sql, (err, results) => {

      if(err) throw err;
          res.render('user/index', {
          results:results
        });

    });
});

//route insert user data
app.post('/users/save',(req, res) => {
  let data = {username: req.body.username, password: req.body.password};
  let sql = "INSERT INTO pengguna SET ?";
  let query = db.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/users');
  });
});
 
//route update user data
app.post('/users/update',(req, res) => {
  let sql="UPDATE pengguna SET username='"+req.body.username+"', password='"+req.body.password+"', level='"+req.body.level+"' " 
          "WHERE id="+req.body.id;
  let query=db.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/users');
  });
});
 
//route delete user data
app.post('/users/delete',(req, res) => {
  let sql = "DELETE FROM pengguna WHERE id="+req.body.id+"";
  let query = db.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/users');
  });
});

/*
//route untuk halaman dengan parameter name
app.get('/:name', (req, res) => {
  res.render('index', {
    name : req.params.name
  });

});
*/

//route form
app.get('/form',(req, res) => {
  //render file form.hbs
  res.render('form');
});
 
//route submit form
app.post('/post',(req, res) => {
  //render to index.hbs
  res.render('index',{
    //name input element
    name : req.body.textname
  });
});
 
 //server running port 3000
app.listen(3000, () => {
  console.log('Server is running at port 3000');
});