import {
  SET_NOTIFICATION
} from '@/store/notification/mutations.type';
import {
  PUT_NOTIFICATION,
  GET_NOTIFICATION
} from '@/store/notification/actions.type';
import {postNotification, getNotification} from '@/services/notification.service';
interface State {
  notification: any[];
}

const store: State = {
  notification: [],
};

const getters = {
  notification(state: State) {
    return state.notification;
  },
};

const mutations = {
  [SET_NOTIFICATION](state: State, notification: any) {
    state.notification = notification;
  },
};

const actions = {
  [PUT_NOTIFICATION]: postNotification,
  [GET_NOTIFICATION]: getNotification,
};

export default {
  state: store,
  getters,
  actions,
  mutations
};
