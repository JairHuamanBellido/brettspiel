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
        req.session.userAuthenticated = false;
    }
    next();
}


// ALL GET METHODS


// HOME PAGE
Router.get('/', isUserAuthenticated, async (req, res) => {
    const products = await db.getAllProducts();
    req.session.lastURL = req.path;

    res.render('home', {
        isUserAuthenticated: req.session.userAuthenticated,
        allProduct: products,
        user: req.session.idUser,
        message: req.session.errM,
        error: req.session.errLogin

    });
})


// LOGIN PAGE
// Router.get('/login', AuthenticationError, (req, res) => {
//     res.render('login', {
//         message: req.session.errM,
//         error: req.session.errLogin
//     })
// })


// REGISTER PAGE
Router.get('/register', (req, res) => {
    res.render('register');
})


// PRODUCT PAGE
Router.get('/product/:id', isUserAuthenticated, (req, res) => {

    db.getProduct(req.params.id).then(obj => {
        res.render('product', {
            product: obj[0],
            isUserAuthenticated: req.session.userAuthenticated,
            user: req.session.idUser,
            message: req.session.errM,
            error: req.session.errLogin

        })
    })
    req.session.lastURL = req.path;
})

Router.get('/Perfil', async (req, res) => {



    res.render('profile', {
        user: req.session.idUser,

    })
})

Router.get('/MisBoletas', (req, res) => {
    res.render('Bills', {
        user: req.session.idUser,
    });
})

Router.get('/JuegosFavoritos', (req, res) => {
    res.render('FavoriteGames', {
        user: req.session.idUser,
    });
})

Router.get('/Carrito', (req, res) => {
    res.render('Cart', {
        user: req.session.idUser,
    });
})


// ALL POST METHODS
Router.post('/register', async (req, res) => {

    const { first_name, last_name, email, user_name, password } = req.body;
    await db.insertNewClient(first_name, last_name, email, user_name, password).then(obj => {
        console.log('Accout create')
    }).catch(e => { console.log(e) });
    res.redirect('/');

})


Router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    await db.validationLogin(username, password).then(obj => {
        if (obj.length < 1) {

            req.session.errLogin = true;
            req.session.errM = 'Invalidate Credentials';
            req.session.tryLogin = 1;


        }
        else {
            req.session.userAuthenticated = true;
            req.session.idUser = obj[0];
        }
        res.redirect(req.session.lastURL);
    });
})

Router.post('/logout', (req, res) => {

    req.session.userAuthenticated = false;
    req.session.idUser = undefined;
    res.redirect(req.session.lastURL);
})

module.exports.Router = Router;