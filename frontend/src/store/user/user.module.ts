import { SET_SHOW_IMAGE_HEADER } from '@/store/shower/mutations.type';
import {
  ADD_EVENT,
  CHANGE_EVENT,
  SET_CURRENT_USER, // данные редактируемого пользователя
  SET_USER_DATA,    // данные залогиненного пользователя
  SET_EVENTS,
  SET_USER,
  SET_USERS,
  UPDATE_USER,
  IS_LOGGED_IN,
  CURRENT_USER_DATA,
  ERROR_REGISTER,
  ERROR_LOGIN,
  SUCCESS_REGISTER,
  FORGOT_INFO,
  RESET_INFO,
  ADD_ROLE, REMOVE_ROLE
} from '@/store/user/mutations.type';
import {
  GET_EVENTS, GET_EVENTS_BY_CLIENT, CREATE_EVENT, DELETE_EVENT, UPDATE_EVENT,
  GET_INFO_ABOUT_USER, GET_USER, GET_USERS,
  LOGIN, LOGIN_WITH_GOOGLE, LOGIN_WITH_OUTLOOK, LOGOUT,
  EDIT_USER, INSERT_USER_INFO, CHECK_USER_INFO,
  FORGOT_PASSWORD, RESET_PASSWORD,
  MARK_USER_DELETED, UNMARK_USER_DELETED,
  INSERT_ROLE, DELETE_ROLE
} from '@/store/user/actions.type';
import { getInfoAboutUser, login, loginWithGoogle, loginWithOutlook, logout, forgotPasword, resetPassword }
  from '@/services/auth/auth.service';
import {
  createEvent, deleteEvent, updateEvent, editUser, getEvents,
  getUser, getUsers, insertNewUser, checkUserInfo, markUserAsDeleted, unmarkUserAsDeleted,
  getEventsByClient,
  insertRole, deleteRole
}
  from '@/services/user.service';

interface State {
  user: any | null;
  currentUser: any | null;
  users: any[];
  events: any[] | null;
  isLoggedIn: any | null;
  currentUserData: any | null;
  errorRegister: any | null;
  errorLogin: any | null;
  successMessage: any | null;
  userData: any | null;
  forgotInfo: any | null;
  resetInfo: any | null;
}

const store: State = {
  user: null,
  currentUser: null,
  users: [],
  events: [],
  isLoggedIn: null,
  currentUserData: null,
  errorRegister: null,
  errorLogin: null,
  successMessage: null,
  userData: null,
  forgotInfo: null,
  resetInfo: null
};

const getters = {
  user(state: State) {
    return state.user;
  },
  forgotInfo(state: State) {
    return state.forgotInfo;
  },
  resetInfo(state: State) {
    return state.resetInfo;
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
  },
  userData(state: State) {
    return state.userData;
  },
  userIsSuperAdmin(state: State) {
    return state.userData?.result.roles.includes('superadmin')
  },
  userIsAdmin(state: State) {
    const roles = state.userData?.result.roles
    return roles?.includes('admin') || roles?.includes('superadmin')
  },
  userHasRole(state: State, role: string) {
    return state.userData?.roles.includes(role)
  }
};

const mutations = {
  [SET_USER](state: State, user: any) {
    state.user = user;
  },
  [FORGOT_INFO](state: State, forgotInfo: any) {
    state.forgotInfo = forgotInfo;
  },
  [RESET_INFO](state: State, resetInfo: any) {
    state.resetInfo = resetInfo;
  },

  [UPDATE_USER](state: State, user: any) {
    if (!state.user || user._id === state.user._id) {
      state.user = user;
    }
    if (state.users) {
      const userIndex = state.users!.findIndex(({ _id }) => _id === user._id);
      state.users.splice(userIndex, 1, user)
    }
  },
  [SET_EVENTS](state: State, events: any[]) {
    state.events = events;
  },
  [ADD_EVENT](state: State, event: any[]) {
    state.events = [...state.events!, event];
  },
  [CHANGE_EVENT](state: State, event: any) {
    if (state.events) {
      const index = state.events!.findIndex(({ _id }) => _id === event._id);
      state.events.splice(index, 1, event)
    }
  },
  [DELETE_EVENT](state: State, eventId: any) {
    if (state.events) {
      const index = state.events!.findIndex(({ _id }) => _id === eventId);
      state.events.splice(index, 1)
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
  [SET_USER_DATA](state: State, userData: any) {
    state.userData = userData;
  },
  // можно заменить на UPDATE_USER если отправлять его целиком с бэка
  [ADD_ROLE](state: State, data: { user_id: string, role: string }) {
    const i = state.users.findIndex(e => e._id == data.user_id)
    const user = state.users[i]
    if (!user.roles.includes(data.role)) {
      user.roles.push(data.role)
      state.users.splice(i, 1, user)
    }
  },
  [REMOVE_ROLE](state: State, data: { user_id: string, role: string }) {
    const i = state.users.findIndex(e => e._id == data.user_id)
    const user = state.users[i]
    if (user.roles.includes(data.role)) {
      user.roles.splice(user.roles.indexOf(data.role), 1)
      state.users.splice(i, 1, user)
    }
  }

};

const actions = {
  [LOGIN]: login,
  [FORGOT_PASSWORD]: forgotPasword,
  [RESET_PASSWORD]: resetPassword,
  [LOGIN_WITH_GOOGLE]: loginWithGoogle,
  [LOGIN_WITH_OUTLOOK]: loginWithOutlook,
  [GET_INFO_ABOUT_USER]: getInfoAboutUser,
  [EDIT_USER]: editUser,
  [INSERT_USER_INFO]: insertNewUser,
  [CREATE_EVENT]: createEvent,
  [UPDATE_EVENT]: updateEvent,
  [GET_EVENTS]: getEvents,
  [GET_EVENTS_BY_CLIENT]: getEventsByClient,
  [DELETE_EVENT]: deleteEvent,
  [GET_USERS]: getUsers,
  [GET_USER]: getUser,
  [LOGOUT]: logout,
  [CHECK_USER_INFO]: checkUserInfo,
  [MARK_USER_DELETED]: markUserAsDeleted,
  [UNMARK_USER_DELETED]: unmarkUserAsDeleted,
  [INSERT_ROLE]: insertRole,
  [DELETE_ROLE]: deleteRole
};

export default {
  state: store,
  getters,
  actions,
  mutations
};
