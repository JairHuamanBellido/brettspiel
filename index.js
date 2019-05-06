const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const router =  require('./src/router/router')



// MIDDLEWARES SETTTING
app.use(express.urlencoded({extended:false}));


app.use('/',router.Router);
app.use(express.static( __dirname+'/views'));

app.set('view engine','ejs')

app.listen(process.env.PORT, ()=>{
    console.log('Listen at PORT  '+ process.env.PORT);
})


