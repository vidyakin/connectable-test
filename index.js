const validateToken = require('./utils').validateToken;
const cors = require('cors');

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const User = require('./models').User;
const Post = require('./models').Post;


const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use('/api/user/me', validateToken, require('./auth/authRouter'));
app.use('/api', require('./auth/authRouter'));
app.use('/api/user', validateToken, require('./crud')(User));
app.use('/api/post', validateToken, require('./crud')(Post));



app.listen(port, () => console.log(`[Server]: Listening on port ${port}`));