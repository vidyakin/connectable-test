const router = require('express').Router();
const mailer = require('../email/index');
const validateToken = require('../utils').validateToken;

const User = require('../models').User;

router.post('/login', require('./login')); // router = /api/login  (общая точка логина для всех способов)

router.post('/test', validateToken, (req, res) => {
  console.log(`>> POST '/api/test' has been affected`);
  if (req.body.action == 'test_email') {
      mailer.testMail(req, res)
  } else {
      res.status(200).send('protected test path was requested, body is: '+JSON.stringify(req.body,null,3))
  }  
})

router.post('/upload', (req, res, next) => {
  let imageFile = req.files.files;
  const fileName = `/public/${Date.now()}${imageFile.name}`;
  imageFile.mv(`${__dirname}/static${fileName}`, function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.json({file: {type: imageFile.mimetype.split('/')[0], src: `${process.env.DEFAULT_URL}${fileName}`}});
  });
});

//register and login page
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/register', function(req,res){
  let { firstName, lastName, email, password, emailSend } = req.body;
      data = {
          firstName,
          lastName,
          email,
          password,
          client_id: req.body.workspace
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
                      mailer.NewUser(email, `https://connectable.pro/login/`, {email:email, password:password});
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
router.post('/loginPage', async function(req,res){

  let { email,password,workspace } = req.body
  // workspace can be empty only for superadmin
  if (workspace) {
      const user = await User.findOne({client_id: workspace})
      if (!user) {
          result = { status: 202, workspace: true, error: `Нет компании с таким кодом`}
          return res.status(202).send(result)
      }
  }
  User.findOne({email}, (err, user) => {
      let result = {};
      if (!err && user) {
          // TODO: реализовать нормальное определение роли
          const isSuperAdmin = user.email == 'w.project.portal3@gmail.com'
          console.log(`wp: '${workspace}', user.wp: '${user.client_id}'`);
          // check user deletion mark
          if (user.deletion_mark) {
              result = { status: 202, deleted: true, error: `Enter not allowed - you are not a user of system yet`}
              return res.status(result.status).send(result);
          }
          // If workspace is blank and user is not superadmin - it is error
          if (!isSuperAdmin) {
              if (!workspace) {
                  result = { status: 202, workspace: true, error: `Нужно указать код компании`}
                  return res.status(202).send(result);
              }
              // check user workspace
              if (user.client_id != workspace) {
                  result = { status: 202, workspace: true, error: `Неверный код компании`}
                  return res.status(202).send(result);
              }
          } 

          bcrypt.compare(password, user.password)
          .then(match => {
              if (match) {
                  user.password = '';
                  if (isSuperAdmin) user.roles.push('superadmin'); // по идее тут уже в базе будет роль
                  const payload = {result: user};
                  const secret = process.env.JWT_SECRET;
                  const token = jwt.sign(payload, secret, {
                      expiresIn: 86400 // expires in 24 hours
                  });
                  result = {token, status: 200, result: user}
                  console.log('token: ', token);
                  //console.log('user: ', user);
              } else {
                  result = { status: 202, password, error: 'Authentication error' }
              }
              res.status(result.status).send(result);
          }).catch(error => {
              result = { status: 500, error }
              res.status(result.status).send(result);
          });
      } else {
          result = { status: 202, email, error: 'Authentication error' }
          res.status(result.status).send(result);
      }
  });
});

router.route('/forgot_password')
  .get(mailer.render_forgot_password_template)
  .post(mailer.forgot_password);

router.route('/reset_password/:token')
    .get(mailer.render_reset_password_template)
    .post(mailer.reset_password);

module.exports = router;