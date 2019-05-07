
const { Pool, Client } = require('pg');
const pool = new Pool({
    user: process.env.USERDB,
    host: process.env.HOSTDB,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORTDB
})


// REGISTER A NEW CLIENT
module.exports.insertNewClient = async (firstName, lastName, username, password) => {
    
    const values = [firstName, lastName, username, password];
    const text = `INSERT INTO ${process.env.CLIENT_TABLE}(first_name,last_name,user_name,password) VALUES ($1,$2,$3,$4)`;
    const res = await pool.query(text, values);

}


// AUTHENTICATION USERNAME & PASSWORD
module.exports.validationLogin = async(username,password)=>{
    const res =  await pool.query(`SELECT * FROM  ${process.env.CLIENT_TABLE} WHERE user_name='${username}' AND password='${password}'`);
    return res.rows;
}


// SHARE ALL PRODUCTS
module.exports.getAllProducts = async()=>{
    const query = `SELECT * FROM ${process.env.PRODUCT_TABLE} LIMIT 10`;
    const res =  await pool.query(query);
    return res.rows;
}