const express = require('express');
const mail = require('./email/index');
const jwt = require('jsonwebtoken');
var moment = require('moment');

module.exports = (Collection, serializer, options) => {

    const create = (req, res) => {
        let result = {};
        let status = 201;
        const newEntry = req.body;
        //console.log(req.body);
        Collection.create(newEntry, async (e, data) => {

            if (e) {
                status = 500;
                result.status = status;
                result.error = e;
            } else {
                if (Collection.collection.collectionName === 'groupinvites') {
                    mail.sendInvite(data.userId, `https://connectable.pro/invite/${data._id}`, req.body.groupType)
                }
                if (Collection.collection.collectionName === 'groups') {

                    if(req.body.emailSend) {
                    mail.AddUserInGroup(req.body.userEmail, `https://connectable.pro/login/`, {name:data.name, description:data.description});
                    }
                }
                if (Collection.collection.collectionName === 'events') {

                    if(req.body.emailSend) {
                    mail.CalendarEvent(req.body.userEmail, `https://connectable.pro/login/`, {name:data.name, comment:data.comment, date:moment(data.date).locale('ru').format("MMM Do YY"), time:data.time})
                    }
                }
                if (Collection.collection.collectionName === 'posts') {
                    if(req.body.emailSend) {
                        mail.FollowEvent(data.author.followersEmail, `https://connectable.pro/login/`, {userName:data.author.firstName, msg:data.message});
                    }

                }
                result.status = status;
                result.result = await serializer(data);
            }
            res.status(status).send(result);
        });

    };


    const readMany = (req, res) => {
        let query = req.query.filter || '{}';
        query = JSON.parse(query);
        let result = {};
        let status = 201;
        Collection.find(query, async (e, data) => {
            if (e) {
                status = 500;
                result.status = status;
                result.error = e;
            } else {
                result.status = status;
                result.result = await serializer(data);
            }
            res.status(status).send(result);
        });
    };


    const readOne = (req, res) => {
        const {_id} = req.params;
        let result = {};
        let status = 201;

        Collection.findById(_id, async (e, data) => {
            if (e) {
                status = 500;
                result.status = status;
                result.error = e;
            } else {
                result.status = status;
                result.result = await serializer(data);
            }
            res.status(status).send(result);
        });
    };


    const update = (req, res) => {
        const changedEntry = req.body;
        let result = {};
        let status = 201;

        Collection.updateOne({_id: req.params._id}, changedEntry, (e, data) => {
            if (e) {
                status = 500;
                result.status = status;
                result.error = e;
                res.status(status).send(result);
            } else {
                result.status = status;
                Collection.findById(req.params._id, async (e, data) => {
                    if (e) {
                        status = 500;
                        result.status = status;
                        result.error = e;
                    }
                    else {
                        result.status = 200;
                        data.password = '';
                        const payload = {result: data};
                        const secret = process.env.JWT_SECRET;
                        const token = jwt.sign(payload, secret, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        result.token = token;
                        result.result = await serializer(data);


                    }
                    return res.status(status).send(result);
                });
            }
        });
    };


    const remove = (req, res) => {
        let result = {};
        let status = 201;

        Collection.deleteOne({_id: req.params._id}, (e, data) => {
            if (e) {
                status = 500;
                result.status = status;
                result.error = e;
            } else {
                result.status = status;
                result.result = req.params._id;
            }
            res.status(status).send(result);
        });
    };


    let router = express.Router();

    router.post('/', create);
    router.get('/', readMany);
    router.get('/:_id', readOne);
    router.put('/:_id', update);
    router.delete('/:_id', remove);

    return router;

};