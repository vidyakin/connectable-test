import {SET_SHOW_IMAGE_HEADER} from "@/store/shower/mutations.type";
import {SET_USER, UPDATE_USER} from "@/store/user/mutations.type";
import {GET_INFO_ABOUT_USER, LOGIN, LOGIN_WITH_GOOGLE, UPDATE_USER_INFO} from "@/store/user/actions.type";
import {getInfoAboutUser, login, loginWithGoogle} from "@/services/auth/auth.service";
import {editUser} from "@/services/user.service";

interface State {
  user: any | null,
  currentUser: any | null,
  users: any[] | null
};

const store: State = {
  user: null,
  currentUser: null,
  users: null,
};

const getters = {
  user(state: State) {
    return state.user;
  },
  currentUser(state: State) {
    return state.user;
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
  }
};

const actions = {
  [LOGIN]: login,
  [LOGIN_WITH_GOOGLE]: loginWithGoogle,
  [GET_INFO_ABOUT_USER]: getInfoAboutUser,
  [UPDATE_USER_INFO]: editUser,


};

export default {
  state: store,
  getters,
  actions,
  mutations,
};