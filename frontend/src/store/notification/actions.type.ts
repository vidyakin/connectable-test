export const PUT_NOTIFICATION = 'PUT_NOTIFICATION';
export const GET_NOTIFICATION = 'GET_NOTIFICATION';

// Для автоматической обработки событий сокета должно быть такое именование
export const socket_newMessage = 'socket_newMessage';
// добавление сообщений в стор
export const CREATE_MESSAGE = 'CREATE_MESSAGE'; // создать новое
export const GET_MESSAGES = 'GET_MESSAGES'; // прочитать все

// удаление сообщений, которые все прочитали (как определить полный список получателей?)
export const DELETE_READ = 'DELETE_READ' // not implemented
// прочитанность сообщений (1 или все)
export const READ_MESSAGES = 'READ_MESSAGES'  // not implemented