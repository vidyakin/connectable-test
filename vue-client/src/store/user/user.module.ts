import {SET_SHOW_IMAGE_HEADER} from "@/store/shower/mutations.type";
import {ADD_EVENT, SET_EVENTS, SET_USER, UPDATE_USER} from "@/store/user/mutations.type";
import {
  CREATE_EVENT, DELETE_EVENT,
  GET_EVENTS,
  GET_INFO_ABOUT_USER,
  LOGIN,
  LOGIN_WITH_GOOGLE,
  UPDATE_USER_INFO
} from "@/store/user/actions.type";
import {getInfoAboutUser, login, loginWithGoogle} from "@/services/auth/auth.service";
import {createEvent, deleteEvent, editUser, getEvents} from "@/services/user.service";

interface State {
  user: any | null,
  currentUser: any | null,
  users: any[] | null,
  events: any[] | null
};

const store: State = {
  user: null,
  currentUser: null,
  users: null,
  events: null,
};

const getters = {
  user(state: State) {
    return state.user;
  },
  currentUser(state: State) {
    return state.user;
  },
  events(state: State) {
    return state.events;
  }
};

const mutations = {
  [SET_USER](state: State, user: any) {
    state.user = user;
  },
  [UPDATE_USER](state: State, user: any) {
    if (user._id === state.user._id) {
      state.user = user;
    }
    state.currentUser = user;
    if (state.users) {
      const userIndex = state.users!.findIndex(({_id}) => _id === user._id);
      state.users = [
        ...state.users!.slice(0, userIndex),
        user,
        ...state.users!.slice(userIndex + 1),
      ]
    }
  },
  [UPDATE_USER](state: State, user: any) {
    if (user._id === state.user._id) {
      state.user = user;
    }
    state.currentUser = user;
    if (state.users) {
      const userIndex = state.users!.findIndex(({_id}) => _id === user._id);
      state.users = [
        ...state.users!.slice(0, userIndex),
        user,
        ...state.users!.slice(userIndex + 1),
      ]
    }
  },
  [SET_EVENTS](state: State, events: any[]) {
    state.events = events;
  },
  [ADD_EVENT](state: State, event: any[]) {
    state.events = [...state.events!, event];
  },
  [DELETE_EVENT](state: State, eventId: any) {
    if (state.events) {
      const index = state.events!.findIndex(({_id}) => _id === eventId);
      state.events = [
        ...state.events!.slice(0, index),
        ...state.events!.slice(index + 1),
      ]
    }
  },
};

const actions = {
  [LOGIN]: login,
  [LOGIN_WITH_GOOGLE]: loginWithGoogle,
  [GET_INFO_ABOUT_USER]: getInfoAboutUser,
  [UPDATE_USER_INFO]: editUser,
  [CREATE_EVENT]: createEvent,
  [GET_EVENTS]: getEvents,
  [DELETE_EVENT]: deleteEvent,


};

export default {
  state: store,
  getters,
  actions,
  mutations,
};