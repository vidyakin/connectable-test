const mongoose = require('mongoose');

// schema maps to a collection
const Schema = mongoose.Schema;

/**
 * Модель данных "Клиент сервиса". 
 * Описывает потребителя сервиса со всеми данными, настройками и т.д.
 */
const clientSchema = new Schema({
    workspace: String,   // Краткий код для удобства опознавания и вывода
    name: String,   // Полное наименование компании
    country: String, // Страна
    city: String,   // город компании
    address: String, // Адрес компании
    phone: String,   // основной телефон компании
    director: String, // директор компании
    logo: String,       // путь к логотипу компании
    colors: Array,  // массив корпоративных цветов,
    has_access: { type: Boolean, default: true },   // наличие доступа клиента к системе
    comment: String // дополнительная информация, примечания
});

module.exports = mongoose.model('Client', clientSchema);