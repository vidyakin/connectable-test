const validateToken = require('./utils').validateToken;

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const User = require('./models').User;


const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api/user', validateToken, require('./crud')(User));
app.post('/api/login', require('./auth/login'));



app.listen(port, () => console.log(`[Server]: Listening on port ${port}`));