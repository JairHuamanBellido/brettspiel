const express = require('express');
const Router =express.Router();
const db = require('../db/database');



// ALL GET METHODS

Router.get('/', (req,res)=>{
    res.render('home')
})

Router.get('/login', (req,res)=>{
    res.render('login')
})

Router.get('/register', (req,res)=>{
    res.render('register');
})

// ALL POST METHODS
Router.post('/register', async(req,res)=>{

    const {first_name,last_name,user_name,password}= req.body;

    await db.insertNewClient(first_name,last_name,user_name,password).then(
        ()=>{
            console.log('New client');
            console.log(req.body);
        }
    );    
    res.redirect('/');

})


module.exports.Router =  Router;