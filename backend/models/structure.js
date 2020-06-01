const mongoose = require('mongoose');

// schema maps to a collection
const Schema = mongoose.Schema;

/**
 * Модель данных "Структура компании". 
 * Описывает структуру отделов клиента
 */
const structureSchema = new Schema({
  client_id: String,       // код клиента
  orgTree: Schema.Types.Mixed // дерево структуры целиком
});

module.exports = mongoose.model('Structure', structureSchema);