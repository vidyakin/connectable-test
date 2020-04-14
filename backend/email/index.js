const nodemailer = require("nodemailer");
const UserDao = require('../dao/user-dao');
const User = require('../models').User;
const async = require('async');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
var transporter = nodemailer.createTransport({
    host: "mail.connectable.pro",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'mail@connectable.pro',
      pass: 'ISOc^s^v7alo'
    }
  });
var hbs = require('nodemailer-express-handlebars'),
    path = require('path');

transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

//
module.exports.sendInvite = async(to, url, typeGroup) => {
  let email = await UserDao.findById(to);
  email = email.email;

  const typeGroupStr = ['открытую группу','закрытую группу','приватную группу'][typeGroup];
  transporter.sendMail({
    from: '"Connectable" <mail@connectable.pro>', // sender address
    to: email, // list of receivers
    subject: `Приглашение в ${typeGroupStr}`, // Subject line
    text: `Здравствуйте, вас приглашают в ${typeGroupStr}, принять или отклонить приглашение вы можете по ссылке ${url}`, // plain text body
  });
};

//register new user
module.exports.NewUser = async(to, url, dataUser) => {
    transporter.sendMail({
        from: '"Connectable" <mail@connectable.pro>', // sender address
        to: dataUser.email, // list of receivers
        subject: "Регистрация нового пользователя", // Subject line
        text: `Новый пользователь был зарегистрирован. Email: ${dataUser.email} Password:${dataUser.password} . Для входа на сайт перейдите по ссылке: ${url}`, // plain text body
    });
};
//when user added to group
module.exports.AddUserInGroup = async(to, url, groupData) => {
    transporter.sendMail({
        from: '"Connectable" <mail@connectable.pro>', // sender address
        to: to, // list of receivers
        subject: "Добавление пользователя в групу", // Subject line
        text: `Вы были добавлены в группу "${groupData.name}" (${groupData.description}). Для входа на сайт перейдите по ссылке: ${url}`, // plain text body
    });
};
//add event in calendar
module.exports.CalendarEvent = async(to, url, eventdata) => {
    transporter.sendMail({
        from: '"Connectable" <mail@connectable.pro>', // sender address
        to: to, // list of receivers
        subject: "Новое событие", // Subject line
        text: `Создано новое событие ${eventdata.name + ' ' + eventdata.comment + ' ' + eventdata.date + ' ' + eventdata.time}. Для входа на сайт перейдите по ссылке: ${url}`, // plain text body
    });
};
//follow msg user
module.exports.FollowEvent = async(to, url, eventdata) => {
    transporter.sendMail({
        from: '"Connectable" <mail@connectable.pro>', // sender address
        to: to.join(','), // list of receivers
        subject: `Новый пост от ${eventdata.userName}`, // Subject line
        text: `Добавлен пост: ${eventdata.msg}. Для входа на сайт перейдите по ссылке: ${url}`, // plain text body
    });
};

exports.render_forgot_password_template = function(req, res) {
    return res.sendFile(path.resolve('./public/forgot-password.html'));
};

exports.render_reset_password_template = function(req, res) {
    return res.sendFile(path.resolve('./public/reset-password.html'));
};

/**
 * Forgot password
 */
exports.forgot_password = function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({
                email: req.body.email // надо ставить фильтр чтоб гугл-ид == undef и outlook-id тоже
            }).exec(function(err, user) {
                if (user) {
                    done(err, user);
                    console.log(`user found: ${JSON.stringify(user,null,3)}`)
                } else {
                    return res.status(200).json({ status: 404, message: 'Пользователь не найден.' });
                    //done('Пользователь не найден.');
                }
            });
        },
        function(user, done) {
            // create the random token
            crypto.randomBytes(20, function(err, buffer) {
                var token = buffer.toString('hex');
                done(err, user, token);
            });
        },
        function(user, token, done) {
            User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
                done(err, token, new_user);
            });
        },
        function(token, user, done) {
            var data = {
                to: user.email,
                from: '"Connectable" <mail@connectable.pro>',
                subject: 'Забыли пароль?',
                html:''+
                    '<h3>Уважаемый '+user.firstName+',</h3>'+
                    '<p>Вы запросили сброс пароля, пожалуйста, используйте эту <a href="https://connectable.pro/reset-password/'+token+'">ссылку</a> чтобы сбросить пароль</p>'+
                    '<br>'+
                    '<p>С уважениям Connectable!</p>',
            };

            transporter.sendMail(data, function(err) {
                if (!err) {
                    return res.status(200).json({ status: 200, message: 'Пожалуйста, проверьте свою электронную почту для дальнейших инструкций' });
                } else {
                    return done(err);
                }
            });

        }
    ], function(err) {
        return res.status(422).json({ message: err });
    });
};

/**
 * Reset password
 */
exports.reset_password = function(req, res, next) {

    User.findOne({
        reset_password_token: req.body.token,
        reset_password_expires: {
            $gt: Date.now()
        }
    }).exec(function(err, user) {
        if (!err && user) {
            if (req.body.newPassword === req.body.verifyPassword) {
                user.password = bcrypt.hashSync(req.body.newPassword, 10);
                user.reset_password_token = undefined;
                user.reset_password_expires = undefined;
                user.save(function(err) {
                    if (err) {
                        return res.status(422).send({
                            message: err
                        });
                    } else {
                        var data = {
                            to: user.email,
                            from: '"Connectable" <mail@connectable.pro>',
                            subject: 'Сброс пароля',
                            html:''+
                                '<h3>Уважаемый '+user.firstName+',</h3>'+
                                '<p>Ваш пароль был успешно сброшен, теперь вы можете войти с новым паролем.</p>',
                        };

                        transporter.sendMail(data, function(err) {
                            if (!err) {
                                return res.status(200).json({ status: 200, message: 'Ваш пароль был успешно сброшен' });
                            } else {
                                return done(err);
                            }
                        });
                    }
                });
            } else {
                return res.status(200).json({ status: 422, message: 'Пароли не соответствуют' });
            }
        } else {
            return res.status(200).json({ status: 400, message: 'Токен сброса пароля недействителен или срок его действия истек.' });
        }
    });
};