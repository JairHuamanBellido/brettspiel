const express = require('express');
const Router = express.Router();
const db = require('../db/database');


AuthenticationError = (req, res, next) => {
    if (++req.session.tryLogin > 2) {
        req.session.errLogin = false;
        req.session.tryLogin = 1;
    }
    next();
}

isUserAuthenticated = (req, res, next) => {
    if (typeof req.session.userAuthenticated === 'undefined') {
        //console.log('Seteando a false el valor errLogin');
        req.session.userAuthenticated = false;
    }

    next();
}


// ALL GET METHODS

Router.get('/', isUserAuthenticated, async(req, res) => {
    //console.log('Autentificacion del usuario: '+req.session.userAuthenticated);
    const products =  await db.getAllProducts();
    
    console.log(req.session.idUser);


    res.render('home', {
        isUserAuthenticated: req.session.userAuthenticated,
        allProduct: products,
        user: req.session.idUser
    });
    

})

Router.get('/login', AuthenticationError, (req, res) => {
    res.render('login', {
        message: req.session.errM,
        error: req.session.errLogin
    })
})

Router.get('/register', (req, res) => {
    res.render('register');
})



// ALL POST METHODS
Router.post('/register', async (req, res) => {

    const { first_name, last_name, user_name, password } = req.body;
    await db.insertNewClient(first_name, last_name, user_name, password);
    res.redirect('/');

})


Router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    await db.validationLogin(username, password).then(obj => {
        if (obj.length < 1) {

            req.session.errLogin = true;
            req.session.errM = 'Invalidate Credentials';
            req.session.tryLogin = 1;

            res.redirect('/login');
        }
        else {
            req.session.userAuthenticated = true;
            req.session.idUser = obj[0].id;
            res.redirect('/')
        }
    });
})

Router.post('/logout', (req, res) => {
    req.session.userAuthenticated = false;
    res.redirect('/');
})

module.exports.Router = Router;