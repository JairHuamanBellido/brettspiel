const express = require('express');
const Router =express.Router();




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



module.exports.Router =  Router;