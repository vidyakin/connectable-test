const validateToken = require('./utils').validateToken;
const cors = require('cors');
const fileUpload = require('express-fileupload');
const latinize = require('latinize');

const serializers = require('./serializers');
const projectSerializer = require('./serializers/projectSerializer').projectSerializer;
const inviteSerializer = require('./serializers/inviteSerializer').inviteSerializer;

require('dotenv').config();

const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser');

const { 
    User,
    Post,
    Like,
    Comment,
    Event,
    GroupParticipant,
    GroupInvite,
    ProjectParticipant,
    Project,
    Department,
    Notification,
    Message,
    Structure
} = require('./models')

const app = express();
const port = process.env.PORT || 4000;

// HTTPS :
// const server = require('https').createServer({
//     key: fs.readFileSync('./certs/server.key'),
//     cert: fs.readFileSync('./certs/server.crt')
// },app)
// HTTP :
const server = require('http').createServer(app);

const io = require('socket.io')(server,  {'transports': ['websocket', 'polling']});
io.set('transports', ["websocket", "polling"]);
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

/**
 * New way to link API section to entire module of app
 */
app.use('/api/user', validateToken, require('./modules/users'))
app.use('/api/clients', validateToken, require('./modules/clients'))
app.use('/api/group', validateToken, require('./modules/groups'))
app.use('/api/dept_users', validateToken, require('./modules/dept_users'))
app.use('/api/structure', validateToken, require('./modules/structure'))

/**
 * Old way
 */
app.use('/api/post', validateToken, require('./crud')(Post, serializers.postSerializer));
app.use('/api/like', validateToken, require('./crud')(Like, serializers.serializer));
app.use('/api/comment', validateToken, require('./crud')(Comment, serializers.commentSerializer));
app.use('/api/event', validateToken, require('./crud')(Event, serializers.serializer));
app.use('/api/groupParticipant', validateToken, require('./crud')(GroupParticipant, serializers.serializer));
app.use('/api/groupInvite', validateToken, require('./crud')(GroupInvite, inviteSerializer));
app.use('/api/projectParticipant', validateToken, require('./crud')(ProjectParticipant, serializers.serializer));
app.use('/api/project', validateToken, require('./crud')(Project, projectSerializer));

app.use('/api/message', validateToken, require('./crud')(Message, serializers.serializer));

app.use('/api/outlook', require('./auth/outlook/'));
app.use('/api/outlook/event', require('./calendar'));
app.use('/api/google/event', require('./google'));
app.use("/role", require('./role/routes'));

var mailer = require('./email/index');

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

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.log.bind(console, "> Mongo connection error"));
db.once('open', function(callback){ 
    console.log("> Mongo connection succeeded"); 
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
    const user = await User.findOne({email: req.params.email}, '_id client_id')
    console.log((new Date()).toLocaleString() + ' , user:'+user);    
    try {
        const docs = await Event.find({client_id: user.client_id})
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

/**
 * All events of all client's users (entrypoint for admin view)
 */
app.get('/api/event/byClient/:workspace', async (req, res) => {
    try {
        const events = await Event.find({client_id: req.params.workspace})
        res.send(events)
    } catch (err) {
        res.status(500).send("Error while getting events of client: "+err.message)
    }
})

/**
 * Временная функция для установки клиента всем событиям
 */
app.put('/api/event/client_all/:workspace', async (req,res) => {
    try {
        const cnt = await Event.updateMany({client_id: null}, {client_id: req.params.workspace})
        res.send(`Изменено событий: ${cnt.nModified}`)
    } catch (error) {
        res.status(500).send(error)
    }
})

server.listen(port, () => console.log(`[Server]: Listening on port ${port}`));
