import {SET_SHOW_IMAGE_HEADER} from "@/store/shower/mutations.type";
import {SET_USER} from "@/store/auth/mutations.type";
import {LOGIN} from "@/store/auth/actions.type";
import {login} from "@/services/auth/auth.service";

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
};

export default {
  state: store,
  getters,
  actions,
  mutations,
};