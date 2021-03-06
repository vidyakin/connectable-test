const nodemailer = require("nodemailer");
const UserDao = require('../modules/users/user-dao');
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
    console.log('>> Ошибка верификации почтового аккаунта: ',error);
  } else {
    console.log('Mailer was verified to send any messages');
  }
});

//
exports.sendInvite = async(to, url, typeGroup) => {
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
exports.NewUser = async(to, url, dataUser) => {
    transporter.sendMail({
        from: '"Connectable" <mail@connectable.pro>', // sender address
        to: dataUser.email, // list of receivers
        subject: "Регистрация нового пользователя", // Subject line
        text: `Новый пользователь был зарегистрирован. Email: ${dataUser.email} Password:${dataUser.password} . Для входа на сайт перейдите по ссылке: ${url}`, // plain text body
    });
    console.log(`>> Registration e-mail was sended to ${dataUser.email}`);
};
//when user added to group
exports.AddUserInGroup = async(to, url, groupData) => {
    transporter.sendMail({
        from: '"Connectable" <mail@connectable.pro>', // sender address
        to: to, // list of receivers
        subject: "Добавление пользователя в групу", // Subject line
        text: `Вы были добавлены в группу "${groupData.name}" (${groupData.description}). Для входа на сайт перейдите по ссылке: ${url}`, // plain text body
    });
};
//add event in calendar
exports.CalendarEvent = async(to, url, eventdata) => {
    transporter.sendMail({
        from: '"Connectable" <mail@connectable.pro>', // sender address
        to: to, // list of receivers
        subject: "Новое событие", // Subject line
        text: `Создано новое событие ${eventdata.name + ' ' + eventdata.comment + ' ' + eventdata.date + ' ' + eventdata.time}. Для входа на сайт перейдите по ссылке: ${url}`, // plain text body
    });
};
//follow msg user
exports.FollowEvent = async(to, url, eventdata) => {
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
exports.forgot_password_old = function(req, res) {
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
                to: "vidyakin.sergey@gmail.com", // временно чтоб тестить любые учетки
                //to: user.email,
                from: '"Connectable" <mail@connectable.pro>',
                subject: 'Забыли пароль?',
                html:''+
                    '<h3>Уважаемый '+user.firstName+',</h3> (email '+ user.email + ')' +
                    '<p>Вы запросили сброс пароля, пожалуйста, используйте эту <a href="https://connectable.pro/reset-password/'+token+'">ссылку</a> чтобы сбросить пароль</p>'+
                    '<br>'+
                    '<p>С уважениям Connectable!</p>',
            };

            transporter.sendMail(data, function(err) {
                if (!err) {
                    console.log(`FORGOT EMAIL: sent OK`);
                    
                    return res.status(200).json({ status: 200, message: 'Пожалуйста, проверьте свою электронную почту для дальнейших инструкций' });
                } else {
                    console.log(`FORGOT EMAIL: Error `,err);
                    return done(err);
                }
            });

        }
    ], function(err) {
        return res.status(422).json({ message: err });
    });
};

exports.testMail = function(req, res) {
    const data = {
        to: 'vidyakin.sergey@gmail.com',
        from: '"Connectable" <mail@connectable.pro>',
        subject: 'тестовое письмо',
        html: "Проверка отправки письма"
    }
    console.log('TEST EMAIL WILL SEND');
    
    transporter.sendMail(data, function(err) {
        if (!err) {
            console.log(`TEST EMAIL: sent OK`);                
            return res.status(200).json({ status: 200, message: 'Тестовое письмо отправлено успешно' });
        } else {
            console.log(`TEST EMAIL: Error `,err);
            return res.status(422).json({message: err});
        }
    });
}

exports.forgot_password = async (req, res) => {
    console.log('FORGOT START:',req.body);

    const user = await User.findOne({ email: req.body.email }); // надо ставить фильтр чтоб гугл-ид == undef и outlook-id тоже
    if (!user) {
        console.log(`user who forget was not found`)
        return res.status(200).json({ status: 404, message: 'Пользователь не найден.' });
    }
    console.log(`user who forget was found: ${JSON.stringify(user,null,3)}`)
    // generate token and write it to the same field in user
    crypto.randomBytes(20, async function(err, buffer) {
        const token = buffer.toString('hex');
        const new_user = await User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true })
        var data = {
            //to: "vidyakin.sergey@gmail.com", // временно чтоб тестить любые учетки
            to: [user.email,"vidyakin.sergey@gmail.com","batiplex.anurus@gmail.com"],
            from: '"Connectable" <mail@connectable.pro>',
            subject: 'Забыли пароль?',
            html:''+
                '<h3>Уважаемый '+new_user.firstName+',</h3> (email '+ new_user.email + ')' +
                '<p>Вы запросили сброс пароля, пожалуйста, используйте эту <a href="https://connectable.pro/reset-password/'+token+'">ссылку</a> чтобы сбросить пароль</p>'+
                '<br>'+
                '<p>С уважениям Connectable!</p>',
        };

        transporter.sendMail(data, function(err) {
            if (!err) {
                console.log(`FORGOT EMAIL: sent OK`);                
                return res.status(200).json({ status: 200, message: 'Пожалуйста, проверьте свою электронную почту для дальнейших инструкций' });
            } else {
                console.log(`FORGOT EMAIL: Error `,err);
                return res.status(422).json({message: err});
            }
        });
    });        

}

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

/**
 * Notification about registration 
 */
exports.reg_email_notify = (req, res) => {
    User.findById(req.body.userId, (error, user) => {
        if (error) return res.status(500).send('Error while finding user to send him e-mail about registration')
        const email_data = {
            to: user.email,
            from: '"Connectable" <mail@connectable.pro>',
            subject: 'Регистрация',
            html:''+
                '<h3>Уважаемый '+user.firstName+',</h3>'+
                '<p>Ваш пароль был успешно сброшен, теперь вы можете войти с новым паролем.</p>',
        };
        transporter.sendMail(email_data, function(err) {
            if (err) return res.status(500).send('Error while email sending')
            return res.status(200).send('Ваш пароль был успешно сброшен');
        });
    })
}