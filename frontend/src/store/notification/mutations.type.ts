export const SET_NOTIFICATION = 'SET_NOTIFICATION';

// для автоматической привязки мутации к событию сокета - оповещению о новых сообщениях
export const SOCKET_NEW_MESSAGE = 'SOCKET_NEW_MESSAGE';
// добавление и получение сообщений
export const ADD_MESSAGE = 'ADD_MESSAGE'; // добавить новое сообщения
export const SET_MESSAGES = 'SET_MESSAGES'; // поместить в стор все сообщения
export const MARK_MESSAGE_READ = 'MARK_MESSAGE_READ';  // пометить прочитанным одно сообщение
