const validateToken = require('./utils').validateToken;
const cors = require('cors');
const fileUpload = require('express-fileupload');
var latinize = require('latinize');

const serializers = require('./serializers');
const groupSerializer = require('./groupSerializer').groupSerializer;
const projectSerializer = require('./projectSerializer').projectSerializer;
const inviteSerializer = require('./inviteSerializer').inviteSerializer;

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const User = require('./models').User;
const Post = require('./models').Post;
const Like = require('./models').Like;
const Comment = require('./models').Comment;
const Event = require('./models').Event;
const Group = require('./models').Group;
const GroupParticipant = require('./models').GroupParticipant;
const GroupInvite = require('./models').GroupInvite;
const ProjectParticipant = require('./models').ProjectParticipant;
const Project = require('./models').Project;
const Department = require('./models').Department;

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
app.use('/api/groupParticipant', validateToken, require('./crud')(GroupParticipant, serializers.serializer));
app.use('/api/groupInvite', validateToken, require('./crud')(GroupInvite, inviteSerializer));
app.use('/api/projectParticipant', validateToken, require('./crud')(ProjectParticipant, serializers.serializer));
app.use('/api/project', validateToken, require('./crud')(Project, projectSerializer));
app.use('/api/project', validateToken, require('./crud')(Project, projectSerializer));

app.post('/api/upload', (req, res, next) => {
  let imageFile = req.files.files;
  const fileName = `/public/${Date.now()}${imageFile.name}`;
  imageFile.mv(`${__dirname}/static${fileName}`, function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.json({file: {type: imageFile.mimetype.split('/')[0], src: `${process.env.DEFAULT_URL}${fileName}`}});
  });

});

app.get('/api/checkParticipant/:participantId/group/:groupId', (req, res, next) => {
  const {participantId, groupId} = req.params;
  GroupParticipant.findOne({participantId, groupId, approved: false}, (e, data) => {
    if (e) {
      res.status(500).send();
    } else {
      res.send(data !== null);
    }

  })
});

app.post('/api/approveParticipant/:participantId/group/:groupId', (req, res, next) => {
  const {participantId, groupId} = req.params;
  GroupParticipant.updateMany({participantId, groupId}, {approved: true}, (e, data) => {
    if (e) {
      res.status(500).send();
    } else {
      res.status(200).send();
    }

  })
});

app.post('/api/approveInvite/:inviteId', (req, res, next) => {
  const {inviteId} = req.params;
  GroupInvite.findByIdAndDelete(inviteId, (e, data) => {
    if (e) {
      res.status(500).send();
    } else {
      GroupParticipant.create({participantId: data.userId, groupId: data.groupId}, (err, data) => {
        res.status(200).send();
      })
    }

  })
});
app.post('/api/cancelInvite/:inviteId', (req, res, next) => {
  const {inviteId} = req.params;
  GroupInvite.findByIdAndDelete(inviteId, (e, data) => {
    if (e) {
      res.status(500).send();
    } else {
      res.status(200).send();
    }

  })
});

app.delete('/api/deleteParticipant/:participantId/group/:groupId', (req, res, next) => {
  const {participantId, groupId} = req.params;
  GroupParticipant.deleteMany({participantId, groupId}, (e, data) => {
    if (e) {
      res.status(500).send();
    } else {
      res.status(200).send();
    }

  })
});
//register form
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
});
//register page
const mail = require('./email/index');
app.post('/api/register', function(req,res){
    let firstName = req.body.firstName,
        lastname = req.body.lastName,
        email = req.body.email,
        password = req.body.password,
        data = {
            "firstName": firstName,
            "lastName":lastname,
            "email":email,
            "password":password,
        };
    let result = {};
    let status = 200;

    User.findOne({email}, (err, user) => {
        if (!err && user) {
            bcrypt.compare(password, user.password).then(match => {
                if (match) {
                    status = 202;
                    result.email = user.email;
                    result.status = status;
                    res.status(status).send(result);
                } else {
                    status = 401;
                    result.status = status;
                    result.error = `Authentication error`;
                }

                res.status(status).send(result);
            }).catch(err => {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            });
        } else {
            bcrypt.hash(password, 10, function (err, hash) {
                if (err) {
                    console.log('Error hashing password for user', email);
                    next(err);
                }
                else {
                    data.password = hash;
                    db.collection('users').insertOne(data,function(err, collection){
                        if (err) return res.status(500).send("There was a problem registering the user.");
                    });
                    mail.NewUser(email, `https://connectable.pro/login/`, {email:email, password:password})
                }
            });

            status = 200;
            const payload = {user: email};
            const secret = process.env.JWT_SECRET;
            const token = jwt.sign(payload, secret, {
                expiresIn: 86400 // expires in 24 hours
            });

            result.token = token;
            result.status = status;
            //result.result = user;

            res.status(status).send(result);

        }
    });

});
//login page
app.post('/api/loginPage', function(req,res){

    let email =req.body.email,
        password = req.body.password,
        result = {},
        status = 200,
        invalidFields = {};

    User.findOne({email}, (err, user) => {
        if (!err && user) {
            bcrypt.compare(password, user.password).then(match => {
                if (match) {
                    status = 200;
                    user.password = '';
                    const payload = {result: user};
                    const secret = process.env.JWT_SECRET;
                    const token = jwt.sign(payload, secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });

                    result.token = token;
                    result.status = status;
                    result.result = user;
                } else {
                    status = 202;
                    result.status = status;
                    result.error = `Authentication error`;
                    result.password = password;
                }

                res.status(status).send(result);
            }).catch(err => {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            });
        } else {
            status = 202;
            result.status = status;
            result.error = `Authentication error`;
            result.email = email;
            res.status(status).send(result);
        }
    });
});
//Section Structure
app.post('/api/department', (req, res) => {
    let dataList =req.body,
        depData = {
            "name": dataList.name,
            "parent":dataList.depVal,
            "users": dataList.members,
            "slug":latinize(dataList.name.toLowerCase().replace(/ /g,'_')),
        },
        slug = depData.slug,
        level = '',
        result = {},
        status = 200;
    if(depData.parent) {
        let name = depData.parent.label;
        Department.findOne({name}, (err, dep) => {
            if (!err && dep) {
                if(dep.level) {
                    depData.level = dep.level;
                    depData.level += 1;
                }
            }
        });
    }
    else {
        depData.level = 1;
    }
    Department.findOne({slug}, (err, department) => {
        if (!err && !department) {
            //console.log(depData);
            db.collection('departments').insertOne(depData,function(err, collection){
                if (err) return res.status(500).send("There was a problem registering the user.");
            });
        }
        else {
            console.log('розділ уже існує');
        }

        //res.status(status).send(result);

    });
});
//display all departments
app.get('/api/department', (req, res) => {
    let status = 200;
    Department.find({}, (err, department) => {
        if (!err && department) {
            res.status(status).send(department);
        }
    });
});



app.listen(port, () => console.log(`[Server]: Listening on port ${port}`));
