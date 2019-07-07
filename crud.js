const express = require('express');

module.exports = (Collection, serializer, options) => {

    const create = (req, res) => {
        let result = {};
        let status = 201;
        const newEntry = req.body;
        Collection.create(newEntry, (e, data) => {
            if (e) {
                status = 500;
                result.status = status;
                result.error = e;
            } else {
                result.status = status;
                result.result = data;
            }
            res.status(status).send(result);
        });

    };


    const readMany = (req, res) => {
        let query = req.query.filter || {};
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

        Collection.findById(_id, (e, data) => {
            if (e) {
                status = 500;
                result.status = status;
                result.error = e;
            } else {
                result.status = status;
                result.result = data;
            }
            res.status(status).send(result);
        });
    };


    const update = (req, res) => {
        const changedEntry = req.body;
        let result = {};
        let status = 201;

        Collection.update({_id: req.params._id}, {$set: changedEntry}, (e, data) => {
            if (e) {
                status = 500;
                result.status = status;
                result.error = e;
            } else {
                result.status = status;
                result.result = data;
            }
            res.status(status).send(result);
        });
    };


    const remove = (req, res) => {
        let result = {};
        let status = 201;

        Collection.remove({_id: req.params._id}, (e) => {
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