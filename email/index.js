const nodemailer = require("nodemailer");
const UserDao = require('../dao/user-dao');

  let transporter = nodemailer.createTransport({
    host: "mail.connectable.pro",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'mail@connectable.pro',
      pass: 'ISOc^s^v7alo'
    }
  });

transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});
//
module.exports.sendInvite = async(to, url) => {
  let email = await UserDao.findById(to);
  email = email.email;
 transporter.sendMail({
    from: '"Connectable" <mail@connectable.pro>', // sender address
    to: email, // list of receivers
    subject: "Приглашение в закрытую группу", // Subject line
    text: `Здравствуйте, вас приглашают в закрытую группу, принять или отклонить приглашение вы можете по ссылке ${url}`, // plain text body
  });
 };

