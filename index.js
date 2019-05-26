const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const router =  require('./src/router/router')
const session =  require('express-session');

app.set('trust proxy', 1)
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))


// MIDDLEWARES SETTTING
app.use(express.urlencoded({extended:false}));


app.use('/',router.Router);
app.use('/public', express.static(__dirname+'/public'));
app.use(express.static( __dirname+'/views'));

app.set('view engine','ejs')

app.listen(process.env.PORT, ()=>{
    console.log('Listen at PORT  '+ process.env.PORT);
})


