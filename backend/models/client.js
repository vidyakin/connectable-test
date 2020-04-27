const mongoose = require('mongoose');

// schema maps to a collection
const Schema = mongoose.Schema;

/**
 * Модель данных "Клиент сервиса". 
 * Описывает потребителя сервиса со всеми данными, настройками и т.д.
 */
const clientSchema = new Schema({
    code: String,   // Краткий код для удобства опознавания и вывода
    name: String,   // Полное наименование компании
    companyDetails: {
        INN: String,    // ИНН компании
        KPP: String     // КПП компании
    },
    logo: String,       // путь к логотипу компании
    colors: Array,  // массив корпоративных цветов
});

module.exports = mongoose.model('Client', clientSchema);