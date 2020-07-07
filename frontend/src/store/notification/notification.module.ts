import {
  SET_NOTIFICATION,

  SET_MESSAGES,
  //MARK_MESSAGE_READ,
  ADD_MESSAGE,
  SOCKET_NEW_MESSAGE
} from '@/store/notification/mutations.type';

import {
  PUT_NOTIFICATION,
  GET_NOTIFICATION,
  CREATE_MESSAGE,
  GET_MESSAGES,
  //READ_MESSAGES
} from '@/store/notification/actions.type';

import {
  postNotification,
  getNotification,
  createMessage,
  getMessages,
  //markMessagesAsRead
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
  // [MARK_MESSAGE_READ](state: State, msg: any) {
  //   const i = state.messages.findIndex(m => m._id == msg._id);
  //   state.messages.splice(i, 1, msg)
  // },
  [ADD_MESSAGE](state: State, msg: any) {
    state.messages = [msg, ...state.messages];
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
  [GET_MESSAGES]: getMessages,
  //[READ_MESSAGES]: markMessagesAsRead
  //[socket_newMessage]: newMessage,    // помещение сообщения в БД и далее вызов SOCKET_NEW_MESSAGE
};

export default {
  state: store,
  getters,
  actions,
  mutations
};
