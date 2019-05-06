const express = require('express');
const Router =express.Router();
const db = require('../db/database');



// ALL GET METHODS

Router.get('/', (req,res)=>{
    res.render('home')
})

Router.get('/login', (req,res)=>{
    if (++req.session.tryLogin > 2) {
        req.session.err = false;
        req.session.tryLogin = 1;
    }
    console.log(req.session.err);
    res.render('login', {
        message: req.session.errM,
        error: req.session.err
    })

})

Router.get('/register', (req,res)=>{
    res.render('register');
})

// ALL POST METHODS
Router.post('/register', async(req,res)=>{

    const {first_name,last_name,user_name,password}= req.body;

    await db.insertNewClient(first_name,last_name,user_name,password);
    res.redirect('/');

})


Router.post('/login', async(req,res)=>{
    const {username,password} = req.body;
    await db.validationLogin(username,password).then( obj=>{
        if(obj.length<1){
            
            req.session.err = true;
            req.session.errM = 'Invalidate Credentials';
            req.session.tryLogin = 1;

            res.redirect('/login');
        }
        else{
            res.redirect('/')
        }
    });
})


module.exports.Router =  Router;