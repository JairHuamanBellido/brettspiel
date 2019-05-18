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





// REGISTER PAGE
Router.get('/register', (req, res) => {
    res.render('register');
})


// PRODUCT PAGE
Router.get('/product/:id', isUserAuthenticated, async (req, res) => {



    req.session.product = req.params.id;
    db.getProduct(req.params.id).then(async (obj) => {


        if (req.session.userAuthenticated == false) {
            res.render('product', {
                product: obj[0],
                isUserAuthenticated: false,
                message: req.session.errM,
                error: req.session.errLogin,
                isProductInCart: false

            })
        }
        else {

            res.render('product', {
                product: obj[0],
                isUserAuthenticated: true,
                user: req.session.idUser,
                isProductInCart: await db.isProductInCart(req.session.idUser.id, req.params.id),
                listFavoriteGame: await db.getAllFavoriteList(req.session.idUser.id)

            })
        }
    })
    console.log('Usuario logueado: ' + req.session.userAuthenticated);
    req.session.lastURL = req.path;
})

Router.get('/Perfil', async (req, res) => {
    req.session.lastURL = req.path;

    res.render('profile', {
        user: req.session.idUser,

    })
})

Router.get('/MisBoletas', (req, res) => {
    req.session.lastURL = req.path;

    res.render('Bills', {
        user: req.session.idUser,
    });
})

Router.get('/JuegosFavoritos', async (req, res) => {
    req.session.lastURL = req.path;

    res.render('FavoriteGames', {
        user: req.session.idUser,
        allProducts: await db.getAllFavoriteList(req.session.idUser.id)
    });
})

Router.get('/Carrito', async (req, res) => {
    req.session.lastURL = req.path;
    res.render('Cart', {
        user: req.session.idUser,
        products: await db.getProductFromCart(req.session.idUser.id)
    });
})





// ALL POST METHODS
Router.post('/register', async (req, res) => {

    const { first_name, last_name, email, user_name, password } = req.body;
    await db.insertNewClient(first_name, last_name, email, user_name, password).then(obj => {
        console.log('Accout create')
    }).catch(e => { console.log(e) });
    res.redirect(req.session.lastURL);

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
    res.redirect('/');
})

Router.post('/addToCart', async (req, res) => {
    console.log("Añadido al carro");
    console.log("Product: " + req.session.product);
    console.log("Cart id: " + req.session.idUser.cart);

    await db.addProductToCart(req.session.product, req.session.idUser.cart);
    res.redirect(req.session.lastURL);
})

Router.post('/addNewListGame', async (req, res) => {
    const { favoriteList } = req.body;

    db.addNewFavoriteList(favoriteList, req.session.idUser.id);


    res.redirect(req.session.lastURL);
})
Router.post('/carrito/delete/:idProduct/:idCart', async (req, res) => {

    const { idProduct, idCart } = req.params;
    await db.removeProductFromCart(idCart, idProduct).then(() => {
        res.redirect(req.session.lastURL);

    });
})

Router.post('/JuegosFavoritos/delete/:idList', async (req, res) => {

    const { idList } = req.params;
    await db.removeListFavoriteGames(idList).then(() => {
        res.redirect(req.session.lastURL);

    })
})



module.exports.Router = Router;