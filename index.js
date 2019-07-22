const validateToken = require('./utils').validateToken;
const cors = require('cors');
const fileUpload = require('express-fileupload');

const serializers = require('./serializers');
const groupSerializer = require('./groupSerializer').groupSerializer;

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const User = require('./models').User;
const Post = require('./models').Post;
const Like = require('./models').Like;
const Comment = require('./models').Comment;
const Event = require('./models').Event;
const Group = require('./models').Group;


const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(fileUpload({
  limits: {fileSize: 50 * 1024 * 1024},
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('static'));

app.use('/api/user/me', validateToken, require('./auth/authRouter'));
app.use('/api', require('./auth/authRouter'));
app.use('/api/user', validateToken, require('./crud')(User, serializers.serializer));
app.use('/api/group', validateToken, require('./crud')(Group, groupSerializer));
app.use('/api/post', validateToken, require('./crud')(Post, serializers.postSerializer));
app.use('/api/like', validateToken, require('./crud')(Like, serializers.serializer));
app.use('/api/comment', validateToken, require('./crud')(Comment, serializers.commentSerializer));
app.use('/api/event', validateToken, require('./crud')(Event, serializers.serializer));

app.post('/upload', (req, res, next) => {
  let imageFile = req.files.files;
  const fileName = `/public/${Date.now()}${imageFile.name}`;
  imageFile.mv(`${__dirname}/static${fileName}`, function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.json({file: {type: imageFile.mimetype.split('/')[0], src: `${process.env.DEFAULT_URL}/${fileName}`}});
  });

});

app.listen(port, () => console.log(`[Server]: Listening on port ${port}`));