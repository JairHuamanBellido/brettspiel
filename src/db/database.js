
const { Pool, Client } = require('pg');
const pool = new Pool({
    user: process.env.USERDB,
    host: process.env.HOSTDB,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORTDB
})

getData = async () => {
    const res = await pool.query('SELECT * FROM person');
    await pool.end();
    return res.rows;
}


// return all data of DB Person
// module.exports.data =  getData();
