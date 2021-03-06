const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
  client_id: String,       // код клиента
  msgType: String,   // тип сообщения, для разделения бизнес-логики - "NEW_GROUP","YOU_ADDED_IN_GROUP", ""
  dateCreated: { type: Date, default: Date.now },
  text: String,   // текст сообщения
  senderId: String,   // id отправителя
  listenerType: String,
  // expireTime: { type: Date } // обсудить, надо ли делать временными и автоматически удалять
  addUser: { type: Boolean, default: false },
  linkedObjType: String, // связанный объект - группа, проект, и т.д.
  linkedObjId: String,
  was_read: {     // статус прочитанности
      type: Boolean,
      default: false
  }
});

module.exports = mongoose.model('Message', MessagesSchema)
