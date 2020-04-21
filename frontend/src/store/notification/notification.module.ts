import {
  SET_NOTIFICATION,

  SET_MESSAGES,
  ADD_MESSAGE,
  SOCKET_NEW_MESSAGE
} from '@/store/notification/mutations.type';

import {
  PUT_NOTIFICATION,
  GET_NOTIFICATION,
  socket_newMessage,
  CREATE_MESSAGE,
  GET_MESSAGES
} from '@/store/notification/actions.type';

import {
  postNotification, 
  getNotification, 
  createMessage,
  getMessages
} from '@/services/notification.service';

interface State {
  notification: any[];
  messages: any[];
}

const store: State = {
  notification: [],
  messages: [],
};

const getters = {
  notification(state: State) {
    return state.notification;
  },
  messages(state: State) {
    return state.messages;
  }
};

const mutations = {
  [SET_NOTIFICATION](state: State, notification: any) {
    state.notification = notification;
  },
  [SET_MESSAGES](state: State, messages: any) {
    state.messages = messages;
  },
  [ADD_MESSAGE](state: State, msg: any) {
    state.messages.push(msg);
  },
  // Только изменение state для обновления UI
  [SOCKET_NEW_MESSAGE](state: State, msg: any) {
    state.messages.push(msg);
  }
};

const actions = {
  [PUT_NOTIFICATION]: postNotification,
  [GET_NOTIFICATION]: getNotification,
  [CREATE_MESSAGE]: createMessage,
  [GET_MESSAGES]: getMessages
  //[socket_newMessage]: newMessage,    // помещение сообщения в БД и далее вызов SOCKET_NEW_MESSAGE
};

export default {
  state: store,
  getters,
  actions,
  mutations
};
