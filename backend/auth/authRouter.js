const router = require('express').Router();

const User = require('../models').User;

router.post('/login', require('./login')); // router = /api/login  (общая точка логина для всех способов)

module.exports = router;