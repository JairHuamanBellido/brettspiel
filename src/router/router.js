const express = require('express');
const Router = express.Router();
const db = require('../db/database');
const ejs = require('ejs');

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
                isProductInCart: false,
                snacks:await db.getAllSnacks()
            })
        }
        else {
            const ar = await db.getAllFavoriteList(req.session.idUser.id);
            
            let ar2 = undefined;
            if (ar.length > 0) {
                ar2 = await db.getTableListProductByListGame(ar);
            }

            res.render('product', {
                product: obj[0],
                isUserAuthenticated: true,
                user: req.session.idUser,
                isProductInCart: await db.isProductInCart(req.session.idUser.id, req.params.id),
                listFavoriteGame: await db.getAllFavoriteList(req.session.idUser.id),
                isProductInFavoriteList: (productId, listId) => {
                    if (typeof ar2 !== 'undefined') {
                        let result = ar2.some(obj => { return obj.list_id == listId && obj.product_id == productId; })

                        return result;
                    }
                    else {
                        return false;
                    }
                },
                snacks: await db.getAllSnacks()

            })
        }
    })
    req.session.lastURL = req.path;
})

// USER PAGE
Router.get('/Perfil', async (req, res) => {
    req.session.lastURL = req.path;

    res.render('profile', {
        user: req.session.idUser,

    })
})

// BOLETAS PAGE
Router.get('/MisBoletas', (req, res) => {
    req.session.lastURL = req.path;

    res.render('Bills', {
        user: req.session.idUser,
    });
})

// LISTA DE JUEGOS FAVORITOS PAGE
Router.get('/JuegosFavoritos', async (req, res) => {
    req.session.lastURL = req.path;
    await db.getAllFavoriteList(req.session.idUser.id).then(async (gameList) => {

        if (gameList.length > 0) {


            const ar = await db.getTableListProductByListGame(gameList);
            res.render('FavoriteGames', {
                user: req.session.idUser,
                ListFavoriteGame: gameList,
                products: await db.getProductFromAllListFavorite(req.session.idUser.id),
                isProductInList: (productId, listId) => {

                    if (ar.length > 0) {
                        let result = ar.some(obj => { return obj.list_id == listId && obj.product_id == productId; })
                        return result;
                    }
                    else {
                        return false;
                    }

                }

            })
        }
        else {
            res.render('FavoriteGames', {
                user: req.session.idUser,
                ListFavoriteGame: gameList,

            })
        }
    })

})


// CARRITO PAGE
Router.get('/Carrito', async (req, res) => {
    req.session.lastURL = req.path;
    res.render('Cart', {
        user: req.session.idUser,
        products: await db.getProductFromCart(req.session.idUser.id)
    });
})





// ALL POST METHODS

//REGISTER POST
Router.post('/register', async (req, res) => {

    const { first_name, last_name, email, user_name, password } = req.body;
    await db.insertNewClient(first_name, last_name, email, user_name, password).then(obj => {
        console.log('Accout create')
    }).catch(e => { console.log(e) });
    res.redirect(req.session.lastURL);

})

// LOGIN POST
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

// CERRAR SESION LOGOUT
Router.post('/logout', (req, res) => {

    req.session.userAuthenticated = false;
    req.session.idUser = undefined;
    res.redirect('/');
})


// AGREGAR PRODCUTO AL CARRITO POST
Router.post('/addToCart', async (req, res) => {

    await db.addProductToCart(req.session.product, req.session.idUser.id);
    res.redirect(req.session.lastURL);
})

// AGREGAR UNA LISTA DE JUEGOS FAVORITOS POST
Router.post('/addNewListGame', async (req, res) => {
    const { favoriteList } = req.body;

    await db.addNewFavoriteList(favoriteList, req.session.idUser.id);


    res.redirect(req.session.lastURL);
})


// ELIMINAR UN PRODUCT DEL CARRITO POST
Router.post('/deleteProductFromCart/:idProduct/:idCart', async (req, res) => {

    const { idProduct, idCart } = req.params;
    await db.removeProductFromCart(idCart, idProduct).then(() => {
        res.redirect(req.session.lastURL);

    });
})

// ELIMINAR UNA LISTA DE JUEGO FAVORITA POST
Router.post('/deleteFavoriteList/:idList', async (req, res) => {

    const { idList } = req.params;
    await db.removeListFavoriteGames(idList).then(() => {
        res.redirect(req.session.lastURL);
    })
})

// AGREGAR UN PRODUCTO A UNA LISTA DE JUEGOS FAVORITAS
Router.post('/addProductToFavoriteList/:idList/:idProduct', async (req, res) => {
    const { idList, idProduct } = req.params;
    await db.addProductToFavoriteList(idList, idProduct).then(() => {
    }).then(() => {
        res.redirect(req.session.lastURL);
    })

})

// ELIMINAR UN PRODUCTO DE UNA LISTA DE JUEGOS
Router.post('/deleteProductFromFavoriteList/:idProduct/:idList', async (req, res) => {

    const { idProduct, idList } = req.params;
    await db.removeProductFromList(idProduct, idList).then(() => {

        res.redirect(req.session.lastURL);
    })

    
})


Router.post('/createBill/:idProduct/:idClient', async (req,res)=>{
    
    const {fechaDeRecogida,
        fechaDeEntrega,
        cantidadDeProductos,
        PiqueoSnax,
        Pringles,
        IncaKola,
        SnacksTotal,
        RentTotal,
        TotalOrder,
        numeroDeTarjeta,
        fechaDeExpiracionTarjeta,
        CCV}  =  req.body; 
        
        const totalSnacks = [Pringles,IncaKola,PiqueoSnax];
        await db.createBill(fechaDeRecogida,fechaDeEntrega,parseInt(cantidadDeProductos),totalSnacks,
                            parseFloat(SnacksTotal),parseFloat(RentTotal),parseFloat(TotalOrder),numeroDeTarjeta,fechaDeExpiracionTarjeta,CCV,
                            req.params.idProduct,req.params.idClient);
        //console.log(req.params);
    res.redirect('/');
})


module.exports.Router = Router;