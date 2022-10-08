
const express = require('express');
const router = express.Router();
const db  = require('../config/db.js');

/* GET view Login */
router.get('/', (req, res) => {
     res.render('index', { 
     title: 'User Login' });
});

//proses login
router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let errors = false;

    if (username && password) {
     sql="SELECT * FROM pengguna where username=? and password=? ";
     db.query(sql, [username, password], function(error, results, fields){

        if (error) throw err
            if (results.length > 0) {

                req.session.loggedin = true;
                req.session.username = username;

                res.render('home', { 
                    username: username,
                    password: password
                });

        } else {
            res.send('Incorrect Username and/or Password!');
        }  
            res.end();
        });

    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }

});

module.exports = router;