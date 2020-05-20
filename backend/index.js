const validateToken = require('./utils').validateToken;
const cors = require('cors');
const fileUpload = require('express-fileupload');
const latinize = require('latinize');

const serializers = require('./serializers');
const groupSerializer = require('./serializers/groupSerializer').groupSerializer;
const projectSerializer = require('./serializers/projectSerializer').projectSerializer;
const inviteSerializer = require('./serializers/inviteSerializer').inviteSerializer;

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const { 
    User,
    Post,
    Like,
    Comment,
    Event,
    Group,
    GroupParticipant,
    GroupInvite,
    ProjectParticipant,
    Project,
    Department,
    Notification,
    Message,
    Structure,
    UsersInDepartment
} = require('./models')

const app = express();
const port = process.env.PORT || 4000;

const server = require('http').createServer(app)
const io = require('socket.io')(server);
io.on('connection', socket=>{
    console.log("-> socket.io user connected: ", socket.id);
    socket.on('disconnect',()=>{
        console.log("<- socket.io user disconnected: ", socket.id);
    })
    // Универсальное событие для всех, что и как обрабатываетс - задается в data
    socket.on("to all", data => {
        console.log(`${new Date().toLocaleString()}: SERVER Message to all: ${data.type} `);
        socket.broadcast.emit("socketMessage", data);
    });
    // Универсальное событие для одного, что и как обрабатываетс - задается в data
    socket.on("to one", data => {
        console.log(`${new Date().toLocaleString()}: SERVER Message to one: ${data.type}`);
        socket.to(data.socket_id).emit("socketMessage", data);
    });
})

app.use(cors());
app.use(fileUpload({
  limits: {fileSize: 50 * 1024 * 1024},
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('static'));

app.use('/api', require('./auth/authRouter')); // ???
app.use('/api/user/me', validateToken, require('./auth/authRouter'));
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

app.use('/api/message', validateToken, require('./crud')(Message, serializers.serializer));
app.use('/api/structure', validateToken, require('./crud')(Structure, serializers.serializer));
//app.use('/api/dept_users', validateToken, require('./crud')(UsersInDepartment, serializers.serializer));

app.use('/api/outlook', require('./auth/outlook/'));
app.use('/api/outlook/event', require('./calendar'));
app.use('/api/google/event', require('./google'));
app.use("/role", require('./role/routes'));

var userHandlers = require('./email/index.js');
var userDAO = require('./dao/user-dao');

app.put('/api/user/delete/:userId', userDAO.delUserById)
app.put('/api/user/undelete/:userId', userDAO.undelUserById)

app.get('/', (req, res) => {
    res.send('Connectable backend says Hello!!!');
});

app.route('/auth/forgot_password')
    .get(userHandlers.render_forgot_password_template)
    .post(userHandlers.forgot_password);
app.route('/auth/reset_password/:token')
    .get(userHandlers.render_reset_password_template)
    .post(userHandlers.reset_password);

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
var db = mongoose.connection;
db.on('error', console.log.bind(console, "> Mongo connection error"));
db.once('open', function(callback){ 
    console.log("> Mongo connection succeeded"); 
});

//register page
const mail = require('./email/index');
app.post('/api/register', function(req,res){
    let firstName = req.body.firstName,
        lastname = req.body.lastName,
        email = req.body.email,
        password = req.body.password,
        emailSend = req.body.emailSend,
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
                    result.status = status;
                    result.error = `Authentication error. This email is already registered`;
                } else {
                    status = 202;
                    result.status = status;
                    result.error = `Authentication error. This email is already registered`;
                }

                res.status(status).send(result);
            });
        } else {
            bcrypt.hash(password, 10, function (err, hash) {
                if (err) {
                    next(err);
                }
                else {
                    data.password = hash;
                    db.collection('users').insertOne(data,function(err, collection){
                        if (err) return res.status(500).send("There was a problem registering the user.");
                    });
                    if (emailSend) {
                        console.log(`>> '/api/register' sending email to ${email}`);
                        mail.NewUser(email, `https://connectable.pro/login/`, {email:email, password:password});
                    }

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
        if (!err && user && user.deletion_mark) {
            result = { status: 403, deleted: true, error: `Enter not allowed - you are not a user of system yet`}
        } else 
        if (!err && user) {
            bcrypt.compare(password, user.password).then(match => {
                if (match) {
                    //status = 200;
                    user.password = '';
                    const payload = {result: user};
                    const secret = process.env.JWT_SECRET;
                    const token = jwt.sign(payload, secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    result = {token, status: 200, result: user}
                    // result.token = token;
                    // result.status = status;
                    // result.result = user;
                } else {
                    result = { status: 202, password, error: 'Authentication error' }
                    // status = 202;
                    // result.status = status;
                    // result.error = `Authentication error`;
                    // result.password = password;
                }

                //res.status(status).send(result);
            }).catch(error => {
                result = { status: 500, error }
                // status = 500;
                // result.status = status;
                // result.error = error;
                //res.status(status).send(result);
            });
        } else {
            result = { status: 202, email, error: 'Authentication error' }
            // status = 202;
            // result.status = status;
            // result.error = `Authentication error`;
            // result.email = email;
            //res.status(status).send(result);
        }
        res.status(status).send(result);
    });
});
//Section Structure
app.post('/api/department', (req, res, next) => {
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
                Department.findOne({slug}, (error, department) => {
                    if (!error && !department) {

                        db.collection('departments').insertOne(depData,function(error, collection){
                            if (error) return res.status(500).send("There was a problem registering the user.");
                        });
                    }
                });
            }

        });
    }
    else {
        depData.level = 1;
        Department.findOne({slug}, (error, department) => {
            if (!error && !department) {
                //console.log(depData);
                db.collection('departments').insertOne(depData,function(error, collection){
                    if (error) return res.status(500).send("There was a problem registering the user.");
                });
            }
        });
    }
    Department.find({}, (err, department) => {
        if (!err && department) {
            res.status(status).send(department);
        }
        else {
            res.status(500).send('ERROR. No data in database');
        }

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
//delete department
app.delete('/api/department/:depId', (req, res) => {
    let {depId} = req.params;

    Department.deleteOne({ _id:depId },function(error, collection){
        if (error) return res.status(500).send("There was a problem registering the user.");
        else {
            Department.find({}, (err, department) => {
                if (!err && department) {
                    res.status(200).send(department);
                }
            });
        }
    });
});
//update department
app.put('/api/department', (req, res) => {
    let {_id, name, users} = req.body;
    let slug = latinize(req.body.name.toLowerCase().replace(/ /g,'_'));
    Department.findByIdAndUpdate(_id, {$set: { name:name, users:users, slug:slug }},{new: true}, function(error, collection){ console.log(error);
        if (error) return res.status(500).send("There was a problem registering the user.");
        else {
            Department.find({}, (err, department) => {
                if (!err && department) {
                    res.status(200).send(department);
                }
            });
        }
    });

});
//app.put('/api/department', validateToken, require('./crud')(Department, serializers.serializer));

// Сотрудники в отделах клиента
app.get('/api/dept_users/:client_id', validateToken, (req,res) => {
    UsersInDepartment.find({client_id: req.params.client_id}, (err, users_in_depts) => {
        if (err) return res.status(500).send("Error during getting employees in departments");
        if (users_in_depts == null)
            res.status(404).send("No users in depts for client "+req.params.client_id)
        else
            res.status(200).send(users_in_depts) 
    })
})

// Добавление сотрудников в отдел клиента
app.post('/api/dept_users/:client_id/:dept_id', (req,res) => {
    // пытаемся найти запись о сотрудниках данного отдела
    UsersInDepartment.findOne({...req.params}, (err, users_in_dept) => {
        if (err) return res.status(500).send("Error during find employees in department");
        // если не нашли - создаем новую запись
        if (users_in_dept == null)
            UsersInDepartment.create({
                ...req.params,
                users: req.body.users, // список сотрудников должен быть передан в теле
                headUser: ""
            }, (err,data) => {
                if (err) return res.status(500).send('Error of create employees in dept: '+err)
                res.status(200).send(data)
            })
            //res.status(404).send("No users in depts for client "+req.params.client_id)
        else {
            users_in_dept.users = [...new Set(users_in_dept.users.concat(req.body.users))] // trick for unduplicate itemsafter concat
            UsersInDepartment.findOneAndUpdate({...req.params}, users_in_dept, {new: true}, (err, data) => {
                if (!err) res.status(200).send(data)
                else res.status(500).send("Error when update emloyees for dept "+req.params.dept_id+": "+err)
            })
        }
    })
})

// удаление сотрудника из отдела
app.delete('/api/dept_users', (req,res)=>{
    // В теле должны быть указаны client_id, dept_id и user_id
    const q = {
        client_id: req.body.client_id, 
        dept_id: req.body.dept_id
    }
    
    UsersInDepartment.findOne(q, (err, dept_users)=>{
        if (err) return res.status(500).send("Error during find employees in department to delete one");
        if (dept_users == null) return res.status(404).send(`No data found by client id='${q.client_id}' and dept_id ='${q.dept_id}'`)

        const i = dept_users.users.indexOf(req.body.user_id)
        dept_users.users.splice(i,1)
        UsersInDepartment.findByIdAndUpdate(dept_users._id, dept_users, (err, data)=>{
            if (err) return res.status(500).send("Error during update employees in department after delete");
            res.status(200).send(data)
        })
    })
})

// установка начальника отдела
app.put('/api/dept_users', (req, res) => {
    // В теле должны быть указаны client_id, dept_id и user_id
    console.log(`edit dept_users API: ${JSON.stringify(req.body,null,2)}`);
    const q = {
        client_id: req.body.client_id, 
        dept_id: req.body.dept_id
    }
    UsersInDepartment.findOne(q, (err, dept_users)=>{
        if (err) return res.status(500).send("Error during find employees in department to set chief");
        dept_users.headUser = req.body.user_id
        UsersInDepartment.findByIdAndUpdate(dept_users._id, dept_users, (err, data)=>{
            if (err) return res.status(500).send("Error during set employee as chief in the department");
            res.status(200).send(data)
        })
    })
})

//put notifications
app.post('/api/notification', (req, res, next) => {
    let notifi =req.body,
        status = 200,
        result = '';
    console.log(notifi);
    Notification.findOne({}, (err, resbd) => {
        if(!err) {
            if (!err && resbd) {
                let arr_keys = Object.keys(resbd._doc),
                    data = [],
                    obj_result = {};

                for (let i = 0; i < arr_keys.length; i++) {
                    if(arr_keys[i] != '_id') {
                        if(!Object.is(resbd[arr_keys[i]], notifi[arr_keys[i]])) {
                            data[arr_keys[i]] = false;
                        }
                    }
                }
                let obj_data = Object.assign({}, data);
                if(!Object.values(notifi).length) {
                    obj_result = { $set: obj_data };
                }
                else {
                    obj_result = { $set: obj_data, $set: notifi };
                }
                Notification.updateMany({userId:notifi.userId},
                    obj_result
                ).then(result => {
                    if(result.n > 0) {
                        res.status(status).send('Настройки сохранены');
                    }
                    else {
                        db.collection('notifications').insertOne(notifi,function(err, collection){
                            if (err) return res.status(500).send("There was a problem registering the user.");
                            else {
                                res.status(status).send('Настройки сохранены');
                            }
                        });
                    }

                }).catch(err => console.error(`Failed to update items: ${err}`));

            }
            else if(!resbd) {
                db.collection('notifications').insertOne(notifi,function(err, collection){
                    if (err) return res.status(500).send("There was a problem registering the user.");
                    else {
                        res.status(status).send('Настройки сохранены');
                    }
                });
            }
            else {
                console.error(`Failed to update items: ${err}`);
                res.status(status).send(`Failed to update items: ${err}`);
            }
        }
    });
});
//display status notification
app.get('/api/notification/:userId', (req, res) => {
    let userId = req.params.userId,
        status = 200;
    Notification.findOne({userId}, (err, notifications) => {
        if (!err && notifications) {
            res.status(status).send(notifications);
        }
        else {
            res.status(status).send();
        }
    });
});
//follow
app.post('/api/follow', (req, res) => {
    let {userID, curentUserID, userEmail} = req.body;
    User.findByIdAndUpdate(userID, {$push: { followers:curentUserID, followersEmail:userEmail } },{}, function(error, collection){
        if (error) return res.status(500).send("There was a problem registering the user.");
        else res.status(200).send(curentUserID);
    });

});
//unfollow
app.post('/api/unfollow', (req, res) => {
    let {userID, curentUserID, userEmail} = req.body;
    User.findByIdAndUpdate(userID, {$pull: { followers:curentUserID, followersEmail:userEmail } },{}, function(error, collection){
        if (error) return res.status(500).send("There was a problem registering the user.");
        else res.status(200).send(curentUserID);
    });
});
//dislike
app.post('/api/dislike', (req, res) => {
    let authorId = req.body;
    Like.deleteOne({parent : authorId.parent, author: authorId.author},function(error, collection){
        if (error) return res.status(500).send("There was a problem with dislike.");
        else {
            res.status(200).send('Like deleted');
        }
    });
});

  
// Поиск событий где пользователь и автор и участник
app.get('/api/events/:email', async (req,res) => {
    const user = await User.findOne({email: req.params.email}, '_id')
    console.log((new Date()).toLocaleString() + ' , user:'+user);    
    try {
        const docs = await Event.find()
            .or([
                {"userId": user._id}, 
                {"attendees.email": {$eq: req.params.email}}
            ])
        console.log('docs:', docs.length);
        res.status(200).send(docs)
    } catch (err) {
        return res.status(500).send("Error while getting events as author: "+err.message)
    }
})


server.listen(port, () => console.log(`[Server]: Listening on port ${port}`));
