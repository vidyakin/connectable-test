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
        text: `Вас было добавлено в группу "${groupData.name}" (${groupData.description}). Для входа на сайт перейдите по ссылке: ${url}`, // plain text body
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

