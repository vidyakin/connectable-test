const express = require('express')
const authCtrl = require('./auth.ctrl') 

const router = express.Router()

router.get('/login-url', authCtrl.getLoginURL)

router.post('/login', authCtrl.login)

module.exports = router;
