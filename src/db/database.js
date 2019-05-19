
const { Pool, Client } = require('pg');
const pool = new Pool({
    user: process.env.USERDB,
    host: process.env.HOSTDB,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORTDB
})


// REGISTER A NEW CLIENT
module.exports.insertNewClient = async (firstName, lastName, email, username, password) => {

    const lastCartNumber = await pool.query('SELECT last_Value FROM cart_id_seq');
    const values = [firstName, lastName, email, username, password, 1, parseInt(lastCartNumber.rows[0].last_value) + 1];

    await pool.query(`INSERT INTO ${process.env.CART_TABLE}(name) VALUES($1)`, [username + 'cart']).then(async () => {
        console.log('Creando carrito');
        const text = `INSERT INTO ${process.env.CLIENT_TABLE}(first_name,last_name,email,username,password,membership,cart) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
        await pool.query(text, values).then(() => {
            console.log('Valores insertados');
        });
    });
}


// AUTHENTICATION USERNAME & PASSWORD
module.exports.validationLogin = async (username, password) => {
    const res = await pool.query(`SELECT * FROM  ${process.env.CLIENT_TABLE} WHERE username='${username}' AND password='${password}'`);
    return res.rows;
}


// SHARE ALL PRODUCTS
module.exports.getAllProducts = async () => {
    const query = `SELECT * FROM ${process.env.PRODUCT_TABLE} LIMIT 20`;
    const res = await pool.query(query);
    return res.rows;
}

// GET A PRODUCT
module.exports.getProduct = async (id) => {
    const query = `SELECT * FROM  ${process.env.PRODUCT_TABLE} WHERE id=${id}`;
    const res = await pool.query(query);
    return res.rows;
}


// ADD PRODUCT TO CART 
module.exports.addProductToCart = async (idProduct, idCart) => {
    const values = [idCart, idProduct];
    const query = `INSERT INTO ${process.env.PRODUCT_CART_TABLE} (cart_id,product_id) VALUES ($1,$2)`;
    await pool.query(query, values)
        .then(() => {
            console.log("Añadido al carrito");
        })
        .catch(
            e => {
                console.error("Algo paso mal! ");
                console.log(e)
            }
        );
}

module.exports.getProductFromCart = async (idUser) => {

    const res = await pool.query(`SELECT product_id FROM ${process.env.PRODUCT_CART_TABLE} WHERE cart_id = ${idUser}`)
        .then(ojb => {
            return ojb.rows;
        })
        .then(async (obj) => {

            if (obj.length > 0) {
                const idProducts = obj.reduce((prev, current) => {

                    if (prev != '') {
                        current.product_id += (',' + prev);
                    }
                    else {
                        current.product_id += (prev);
                    }

                    return current.product_id;

                }, '')


                return await pool.query(`SELECT * from ${process.env.PRODUCT_TABLE} WHERE id IN(${idProducts})`);
            }
            else {
                return { rows: [] };
            }
        })

    return res.rows;
}

// VERIFICA SI EL PRODUCTO ESTUVO EN EL CARRO
module.exports.isProductInCart = async (idCart, idProduct) => {
    const result = await pool.query(`SELECT * FROM ${process.env.PRODUCT_CART_TABLE} WHERE cart_id = ${idCart} AND product_id = ${idProduct} `);

    return (result.rows.length > 0) ? true : false;

}

// AGREGAR UNA NUEVA LISTA DE JUEGOS FAVORITOS
module.exports.addNewFavoriteList = async (name, id) => {
    const data = [name, id];
    const query = `INSERT INTO ${process.env.LISTFAVORITEGAME_TABLE}(name,client_id) VALUES ($1,$2)`;
    await pool.query(query, data).then(() => {
        console.log("Lista de juegos creada con exito en la bd");
    }).catch(e => {
        console.log(e);
    })
}

// CONSULTA TODAS LAS LISTA DE JUEGOS FAVORITES DEL CLIENTE
module.exports.getAllFavoriteList = async (id) => {
    const result = await pool.query(`SELECT * FROM ${process.env.LISTFAVORITEGAME_TABLE} WHERE client_id = ${id}`);
    return result.rows;
}


// ELIMINAR UN PRODUCTO DEL CARRITO

module.exports.removeProductFromCart = async (cart_id, product_id) => {

    const query = `DELETE FROM ${process.env.PRODUCT_CART_TABLE} WHERE cart_id =${cart_id} AND product_id =${product_id}`;
    await pool.query(query).then(() => {
        console.log("Se removio el producto del carrito desde la base de datos");
    });


}

// ELIMINAR UN LISTA DE JUEGOS FAVORITOS
module.exports.removeListFavoriteGames = async (idListGame) => {
    const query = `DELETE FROM ${process.env.LISTFAVORITEGAME_TABLE} WHERE id = ${idListGame}`;
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

module.exports.getProductFromAllListFavorite = async (idList) => {
    const cpoy = [];
    idList.forEach(obj => {
        cpoy.push(obj.id);
    })

    let listIdS = (cpoy.join(","));

    const query = `SELECT product_id FROM ${process.env.LISTAFAVORITEGAME_PRODUCT_TABLE} WHERE list_id IN(${listIdS})`;
    const res = await pool.query(query).catch(e => { console.log("algo paso mal aqui") });

    if (res.rows.length > 0) {
        const products = res.rows.reduce((prev, acc) => {
            if (prev != '') {
                acc.product_id += (',' + prev);
            }
            else {
                acc.product_id += prev;
            }
            return acc.product_id;
        }, '')

        const queryProduct = `SELECT * FROM ${process.env.PRODUCT_TABLE} WHERE id IN(${products})`;
        const responseProduct = await pool.query(queryProduct);
        return responseProduct.rows;
    }
    else{
        return [];
    }
}
module.exports.getTableListProductByListGame = async (idlist) => {
    const cpoy = [];
    idlist.forEach(obj => {
        cpoy.push(obj.id);
    })

    let listIdS = (cpoy.join(","));

    const query = `SELECT * FROM ${process.env.LISTAFAVORITEGAME_PRODUCT_TABLE} WHERE list_id IN(${listIdS})`;
    const res = await pool.query(query).catch(e => { console.log("algo paso mal aqui") });

    return res.rows;
}