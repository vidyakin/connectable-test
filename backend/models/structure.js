const mongoose = require('mongoose');

// schema maps to a collection
const Schema = mongoose.Schema;

/**
 * Модель данных "Структура компании". 
 * Описывает структуру отделов клиента
 */
const structureSchema = new Schema({
  client_id: String, // код клиента
  code: String,   // Краткий код (число или строка)
  name: String,   // Полное наименование головного департамента
  children: Schema.Types.Mixed // подчиненные узлы
});

module.exports = mongoose.model('Structure', structureSchema);