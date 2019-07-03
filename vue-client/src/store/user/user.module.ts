import {SET_SHOW_IMAGE_HEADER} from "@/store/shower/mutations.type";
import {SET_USER} from "@/store/user/mutations.type";
import {GET_INFO_ABOUT_USER, LOGIN, LOGIN_WITH_GOOGLE} from "@/store/user/actions.type";
import {getInfoAboutUser, login, loginWithGoogle} from "@/services/auth/auth.service";

interface State {
  user: any | null,
};

const store: State = {
  user: null,
};

const getters = {
  user(state: State) {
    return state.user;
  }
};

const mutations = {
  [SET_USER](state: State, user: any) {
    state.user = user;
  }
};

const actions = {
  [LOGIN]: login,
  [LOGIN_WITH_GOOGLE]: loginWithGoogle,
  [GET_INFO_ABOUT_USER]: getInfoAboutUser,

};

export default {
  state: store,
  getters,
  actions,
  mutations,
};