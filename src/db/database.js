
const { Pool, Client } = require('pg');
const pool = new Pool({
    user: process.env.USERDB,
    host: process.env.HOSTDB,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORTDB
})


const PUERTO = 8080;

const RP = require('request-promise')

// REGISTER A NEW CLIENT
module.exports.insertNewClient = async (user, uri) => {



    // await pool.query(`INSERT INTO ${process.env.CART_TABLE}(name) VALUES($1)`, [username + 'cart']).then(async () => {
    //     console.log('Creando carrito');

    // });

    // const text = `INSERT INTO ${process.env.CLIENT_TABLE}(first_name,last_name,email,username,password,membership) VALUES ($1,$2,$3,$4,$5,$6)`;
    // await pool.query(text, values).then(() => {
    //     console.log('Valores insertados');
    // });

    const options = {
        method: 'POST',
        uri: uri,
        body: {
            //nombre_del_campoBD: valor
            email: user.email,
            name: user.firstName,
            password: user.password,
            username: user.username
        },
        json: true
    }

    await RP(options).then(() => {
        console.log("Usuario Ingresado con exito")
    }).catch(e => {
        console.log("Hubo un error en la insercion Furro");
    })

}


// AUTHENTICATION USERNAME & PASSWORD
module.exports.validationLogin = async (username, password) => {
    // const res = await pool.query(`SELECT * FROM  ${process.env.CLIENT_TABLE} WHERE username='${username}' AND password='${password}'`);
    // return res.rows;
 
    const res = await RP(`http://localhost:${PUERTO}/user/${username}/${password}`)
    return res;
}


// SHARE ALL PRODUCTS
module.exports.getAllProducts = async () => {
    //  const query = `SELECT * FROM ${process.env.PRODUCT_TABLE} LIMIT 20`;
    //  const res = await pool.query(query);

    const res = await RP(`http://localhost:${PUERTO}`)
    return res;

}

// GET A PRODUCT
module.exports.getProduct = async (id) => {
    // const query = `SELECT * FROM  ${process.env.PRODUCT_TABLE} WHERE id=${id}`;
    // const res = await pool.query(query);

    const res = await RP(`http://localhost:${PUERTO}/product/${id}`)


    return res;
}


// ADD PRODUCT TO CART 
module.exports.addProductToCart = async (idProduct, idCart) => {
    // const values = [idCart, idProduct];

    // const query = `INSERT INTO ${process.env.PRODUCT_CART_TABLE} (cart_id,product_id) VALUES ($1,$2)`;
    // await pool.query(query, values)
    //     .then(() => {
    //         console.log("Añadido al carrito");
    //     })
    //     .catch(
    //         e => {
    //             console.error("Algo paso mal! ");
    //             console.log(e)
    //         }
    //     );

    const options = {
        method: 'POST',
        uri: `http://localhost:${PUERTO}/`,
        body: {
            //nombre_del_campoBD: valor
            idProduct: idProduct,
            idCart: idCart
        },
        json: true
    }

    await RP(options);
}
// CONSEGUIR LOS PRODUCTOS DEL CARRITO DE  UN CLIENTE
module.exports.getProductFromCart = async (idUser) => {

    // const res = await pool.query(`SELECT prod.* FROM ${process.env.PRODUCT_TABLE} prod, ${process.env.PRODUCT_CART_TABLE} cp WHERE prod.id = cp.product_id AND cp.cart_id = ${idUser};`);
    // return res.rows;

    const res = await RP(`http://localhost:${PUERTO}/${idUser}`)
    return res;

}

// VERIFICA SI EL PRODUCTO ESTUVO EN EL CARRO
module.exports.isProductInCart = async (idCart, idProduct) => {
    // const result = await pool.query(`SELECT * FROM ${process.env.PRODUCT_CART_TABLE} WHERE cart_id = ${idCart} AND product_id = ${idProduct} `);

    // return (result.rows.length > 0) ? true : false;

    const res = await RP(`http://localhost:${PUERTO}/${idCart}/${idProduct}`)
    return (res.length > 0) ? true : false

}

// ELIMINAR UN PRODUCTO DEL CARRITO
module.exports.removeProductFromCart = async (cart_id, product_id) => {

    // const query = `DELETE FROM ${process.env.PRODUCT_CART_TABLE} WHERE cart_id =${cart_id} AND product_id =${product_id}`;
    // await pool.query(query).then(() => {
    //     console.log("Se removio el producto del carrito desde la base de datos");
    // });

    await RP(`http://localhost:${PUERTO}/${cart_id}/${product_id}`);




}


// AGREGAR UNA NUEVA LISTA DE JUEGOS FAVORITOS
module.exports.addNewFavoriteList = async (name, url, idUser) => {
    // const data = [name, id,url];
    // const query = `INSERT INTO ${process.env.LISTFAVORITEGAME_TABLE}(name,client_id,url) VALUES ($1,$2,$3)`;
    // await pool.query(query, data).then(() => {
    //     console.log("Lista de juegos creada con exito en la bd");
    // }).catch(e => {
    //     console.log(e);
    // })

    await RP(`http://localhost:${PUERTO}/${name}/${url}/${idUser}`)
}

// CONSULTA TODAS LAS LISTA DE JUEGOS FAVORITES DEL CLIENTE
module.exports.getAllFavoriteList = async (id) => {
    // const result = await pool.query(`SELECT * FROM ${process.env.LISTFAVORITEGAME_TABLE} WHERE client_id = ${id}`).catch(e => {
    //     console.log("Error en conseguir una lista de juegos favoritos de un cliente")
    // });
    // return result.rows;

    const res = await RP()


}



// ELIMINAR UN LISTA DE JUEGOS FAVORITOS
module.exports.removeListFavoriteGames = async (idListGame) => {
    const query = `DELETE FROM ${process.env.LISTFAVORITEGAME_TABLE} WHERE id = ${idListGame}`;
    await pool.query(`DELETE FROM ${process.env.LISTAFAVORITEGAME_PRODUCT_TABLE} WHERE list_id = ${idListGame}`).then(() => {
        console.log("Eliminados de la lista dE JUEGOS FAVORITOS VS PRODUCTOS");
    })
    await pool.query(query).then(() => {
        console.log("La lista de juego fue eliminada");
    })


}

// AGREGAR UN PRODUCTO A UNA LISTA DE JUEGOS FAVORITOS DE UN USUARIO

module.exports.addProductToFavoriteList = async (idList, idProduct) => {
    const data = [idList, idProduct];
    const query = `INSERT INTO ${process.env.LISTAFAVORITEGAME_PRODUCT_TABLE}(list_id,product_id) VALUES($1,$2)`;
    await pool.query(query, data).then(() => {
        console.log("Producto añadido a la lista de juegos");
    }).catch(e => {
        console.log("Algo malo paso men");
    })


}


// CONSULTA DE LOS PRODUCTOS EN CADA LISTA DE JUEGOS FAVORITOS DE CADA USUARIO
module.exports.getProductFromAllListFavorite = async (idClient) => {

    const query = `SELECT prod.* FROM ${process.env.PRODUCT_TABLE} prod WHERE prod.id IN (SELECT lfp.product_id FROM ${process.env.LISTAFAVORITEGAME_PRODUCT_TABLE} lfp WHERE lfp.list_id IN ( SELECT lfg.id FROM ${process.env.LISTFAVORITEGAME_TABLE} lfg WHERE client_id=${idClient}) )`;
    const res = await pool.query(query);
    return res.rows;

}

// CONSULTA LA TABLA DE LISTA DE JUEGOS FAVORITOS Y PRODUCTOS DE UN CLIENTE
module.exports.getTableListProductByListGame = async (idClient) => {


    const query = `SELECT lfp.* FROM ${process.env.LISTAFAVORITEGAME_PRODUCT_TABLE} lfp WHERE lfp.list_id IN ( SELECT lfg.id FROM ${process.env.LISTFAVORITEGAME_TABLE} lfg WHERE lfg.client_id=${idClient})`;
    const res = await pool.query(query);


    return res.rows;
}

// ELIMINAR UN PRODUCTO DE UNA LISTA DE JUEGOS 
module.exports.removeProductFromList = async (idProduct, idList) => {
    const query = `DELETE FROM ${process.env.LISTAFAVORITEGAME_PRODUCT_TABLE} WHERE list_id = ${idList} AND product_id = ${idProduct}`;
    await pool.query(query).then(() => {
        console.log("Elemento removido de la lista de juego");
    });

}

// CONSULTAR TODO LOS SNACKS

module.exports.getAllSnacks = async () => {
    const query = `SELECT * FROM ${process.env.SNACK_TABLE}`;
    const res = await pool.query(query);

    return res.rows;
}



// AGREGAR UNA BOLETA
module.exports.createBill = async (startRentDate, endrentdate, quantity, Snacks, SnackTotal, RentTotal, OrderTotal, CreditCard, expireDate, CCV, idProduct, idClient) => {

    const bill = [startRentDate, endrentdate, OrderTotal, idClient, RentTotal, SnackTotal];

    const query = `INSERT INTO ${process.env.BILL_TABLE}(startrentdate,endrentdate,totalprice,id_client,totalrent,totalsnack) VALUES ($1,$2,$3,$4,$5,$6)`;




    // AGREGAR SOLO LOS SNACKS QUE FUERON SELECCIONADOS
    Snacks = Snacks.filter(obj => obj.indexOf("true") != -1);


    await pool.query(query, bill).then(async () => {
        const lastIdBill = parseInt((await pool.query(`SELECT last_value FROM ${process.env.BILL_SEQ_TABLE}`)).rows[0].last_value);

        await pool.query(`INSERT INTO ${process.env.PRODUCT_BILL_TABLE}(bill_id,product_id) VALUES(${lastIdBill},${idProduct})`).then(() => {
            console.log("Producto añadido a la boleta")
        });

        if (Snacks.length > 0) {
            Snacks.forEach(async (obj) => {
                await pool.query(`INSERT INTO ${process.env.SNACKS_BILL_TABLE}(bill_id,snack_id,quantity) VALUES (${lastIdBill},${parseInt(obj.slice(7, 8))},${parseInt(obj.slice(5, 6))})`).then(() => {
                    console.log("Snack añadio a la boleta");
                }).catch(e => {
                    console.log("Error insercion snack");
                    console.log(e);
                });
            })
        }

    }).catch(e => {
        console.log(e);
    })
}



module.exports.getAllBillsByClient = async (idClient) => {
    const res = await pool.query(`SELECT * FROM ${process.env.BILL_TABLE} WHERE id_client = ${idClient}`);
    return res.rows;

}

module.exports.getBillInfoById = async (billId) => {
    const res = await pool.query(`SELECT * FROM ${process.env.BILL_TABLE} WHERE id = ${billId}`);
    return res.rows[0];
}


module.exports.getSnacksByBill = async (billId) => {
    const query = `SELECT * FROM ${process.env.SNACK_TABLE} INNER JOIN ${process.env.SNACKS_BILL_TABLE} ON ${process.env.SNACK_TABLE}.id = ${process.env.SNACKS_BILL_TABLE}.snack_id AND bill_id = ${billId}`;
    const res = await pool.query(query);

    return res.rows;
}
module.exports.getProductByBill = async (billId) => {
    const query = `SELECT * FROM ${process.env.PRODUCT_TABLE} INNER JOIN ${process.env.PRODUCT_BILL_TABLE} ON ${process.env.PRODUCT_TABLE}.id = ${process.env.PRODUCT_BILL_TABLE}.product_id AND bill_id= ${billId}`;
    const res = await pool.query(query);
    return res.rows;
}


module.exports.getApiData = async (uri) => {
    const response = await RP(uri);
    return JSON.parse(response);

}