import {SET_SHOW_IMAGE_HEADER} from '@/store/shower/mutations.type';
import {
  ADD_EVENT,
  SET_CURRENT_USER,
  SET_EVENTS,
  SET_USER,
  SET_USERS,
  UPDATE_USER,
  IS_LOGGED_IN,
  CURRENT_USER_DATA,
  ERROR_REGISTER,
  ERROR_LOGIN,
  SUCCESS_REGISTER
} from '@/store/user/mutations.type';
import {
  CREATE_EVENT, DELETE_EVENT,
  GET_EVENTS,
  GET_INFO_ABOUT_USER, GET_USER, GET_USERS,
  LOGIN,
  LOGIN_WITH_GOOGLE, LOGOUT,
  UPDATE_USER_INFO,
  INSERT_USER_INFO,
  CHECK_USER_INFO,
} from '@/store/user/actions.type';
import {getInfoAboutUser, login, loginWithGoogle, logout} from '@/services/auth/auth.service';
import {createEvent, deleteEvent, editUser, getEvents, getUser, getUsers, insertNewUser, checkUserInfo} from '@/services/user.service';

interface State {
  user: any | null;
  currentUser: any | null;
  users: any[] | null;
  events: any[] | null;
  isLoggedIn: any | null;
  currentUserData: any | null;
  errorRegister: any | null;
  errorLogin: any | null;
  successMessage: any | null;
}

const store: State = {
  user: null,
  currentUser: null,
  users: null,
  events: [],
  isLoggedIn: null,
  currentUserData: null,
  errorRegister: null,
  errorLogin: null,
  successMessage: null
};

const getters = {
  user(state: State) {
    return state.user;
  },
  currentUser(state: State) {
    return state.currentUser;
  },
  events(state: State) {
    return state.events;
  },
  users(state: State) {
    return state.users;
  },
  isLoggedIn(state: State) {
    return state.isLoggedIn;
  },
  currentUserData(state: State) {
    return state.currentUserData;
  },
  errorRegister(state: State) {
    return state.errorRegister;
  },
  errorLogin(state: State) {
    return state.errorLogin;
  },
  successMessage(state: State) {
    return state.successMessage;
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
      ];
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
      ];
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
      ];
    }
  },
  [SET_USERS](state: State, users: any[]) {
    state.users = users;
  },
  [SET_CURRENT_USER](state: State, user: any) {
    state.currentUser = user;
  },
  [CURRENT_USER_DATA](state: State, currentUserData: any) {
    state.currentUserData = currentUserData;
  },
  [IS_LOGGED_IN](state: State, isLoggedIn: any) {
    state.isLoggedIn = isLoggedIn;
  },
  [ERROR_REGISTER](state: State, errorRegister: any) {
    state.errorRegister = errorRegister;
  },
  [ERROR_LOGIN](state: State, errorLogin: any) {
    state.errorLogin = errorLogin;
  },
  [SUCCESS_REGISTER](state: State, successMessage: any) {
    state.successMessage = successMessage;
  },
};

const actions = {
  [LOGIN]: login,
  [LOGIN_WITH_GOOGLE]: loginWithGoogle,
  [GET_INFO_ABOUT_USER]: getInfoAboutUser,
  [UPDATE_USER_INFO]: editUser,
  [INSERT_USER_INFO]: insertNewUser,
  [CREATE_EVENT]: createEvent,
  [GET_EVENTS]: getEvents,
  [DELETE_EVENT]: deleteEvent,
  [GET_USERS]: getUsers,
  [GET_USER]: getUser,
  [LOGOUT]: logout,
  [CHECK_USER_INFO]: checkUserInfo
};

export default {
  state: store,
  getters,
  actions,
  mutations
};
