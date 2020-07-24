const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require ('knex');

const register = require ('./controllers/register');
const signin = require ('./controllers/signin');
const profile = require ('./controllers/profile');
const image = require ('./controllers/image');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex ({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl:true,
    }
  });

//  db.select('*').from('users').then (data =>{
//      console.log(data)
//  });


const app = express();
app.use(bodyParser.json());
app.use(cors())

app.get ('/', (req, res) => { res.json('it is working')})
//signin

app.post('/signin', (req, res) => {signin.handleSignin (req, res, bcrypt, db)})

//register

app.post ('/register', (req, res) =>{register.handleRegister ( req, res,bcrypt, db)})
    
//profile

app.get('/profile/:id', (req, res)=> {profile.handleProfile (req, res, db)})

//image: the number of images will determine the number of entries of the user

app.put('/image', (req, res)=>  {image.handleImage (req, res, db)})

//Face detection, using the API
app.post ('/imageUrl', (req, res) => {image.handleApiCall(req, res)})

app.listen(process.env.PORT ||3000, () => {
    console.log (`app is running on port ${process.env.PORT}`)

})