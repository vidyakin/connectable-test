const validateToken = require('./utils').validateToken;
const cors = require('cors');
const fileUpload = require('express-fileupload');

const serializers = require('./serializers');

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const User = require('./models').User;
const Post = require('./models').Post;
const Like = require('./models').Like;
const Comment = require('./models').Comment;


const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(fileUpload());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use('/api/user/me', validateToken, require('./auth/authRouter'));
app.use('/api', require('./auth/authRouter'));
app.use('/api/user', validateToken, require('./crud')(User, serializers.serializer));
app.use('/api/post', validateToken, require('./crud')(Post, serializers.postSerializer));
app.use('/api/like', validateToken, require('./crud')(Like, serializers.serializer));
app.use('/api/comment', validateToken, require('./crud')(Comment, serializers.serializer));

app.post('/upload', (req, res, next) => {
  console.log(req);
  let imageFile = req.files.file;

  imageFile.mv(`${__dirname}/public/${req.body.filename}.jpg`, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.json({file: `public/${req.body.filename}.jpg`});
  });

})

app.listen(port, () => console.log(`[Server]: Listening on port ${port}`));