
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

    const allUser = await pool.query('SELECT * FROM client');
    const values = [firstName, lastName, email, username, password, 1, allUser.rows.length +1];
    console.log(allUser.rows.length + 1);
    await pool.query(`INSERT INTO ${process.env.CART_TABLE}(name) VALUES($1)`, [username]).then(async () => {
        console.log('Creando carrito');        
        const text = `INSERT INTO ${process.env.CLIENT_TABLE}(first_name,last_name,email,username,password,membership,cart) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
        await pool.query(text, values).then( ()=>{
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