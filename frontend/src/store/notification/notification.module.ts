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
  newSocketMessage
  //markMessagesAsRead
} from './notification.service';

interface State {
  notification: any[];
  messages: any[];
  socketMessage: any;
}

const store: State = {
  notification: [],
  messages: [],
  socketMessage: null
};

const getters = {
  notification(state: State) {
    return state.notification;
  },
  messages(state: State) {
    return state.messages;
  },
  getSocketMessage(state: State) {
    return state.socketMessage
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
    state.socketMessage = msg;
  }
};

const actions = {
  [PUT_NOTIFICATION]: postNotification,
  [GET_NOTIFICATION]: getNotification,
  [CREATE_MESSAGE]: createMessage,
  [GET_MESSAGES]: getMessages,
  //[READ_MESSAGES]: markMessagesAsRead
  "socket_socketMessage": newSocketMessage,    // помещение сообщения в БД и далее вызов SOCKET_NEW_MESSAGE
};

export default {
  state: store,
  getters,
  actions,
  mutations
};
