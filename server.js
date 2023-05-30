import express from 'express'
import bodyParser from 'body-parser'
import bcrypt from 'bcrypt-nodejs'
import cors from 'cors'
import knex from 'knex';

import { handleRegister } from './controllers/register.js'
import { handleSignin } from './controllers/signin.js';
import { handleProfile } from './controllers/profile.js';
import { handleImage, handleApiCall } from './controllers/image.js';


const connection = {
  host: process.env.DATABASE_HOST,
  port: 5432,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PW,
  database: process.env.DATABASE_DB,
  connectionString: process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false}
};

const db = knex({
  client: 'pg',
  connection
});

// db.select('*').from('users').then(data => {
//   console.log(data)
// })


const app = express();

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
  // db.select('*').from('users').then(data => {
  //   res.json(data)
  // })
  res.send('home')
})

app.post('/signin', handleSignin(bcrypt, db))

app.post('/register', handleRegister(bcrypt, db))

app.get('/profile/:id', handleProfile(db) )

app.put('/image', handleImage(db))

app.post('/imageurl', handleApiCall)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
})