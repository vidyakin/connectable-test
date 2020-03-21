import {SET_SHOW_IMAGE_HEADER} from '@/store/shower/mutations.type';

interface State {
  showHeaderImage: boolean;
}

const store: State = {
  showHeaderImage: true,
};

const getters = {
  showHeaderImage(state: State) {
    return state.showHeaderImage;
  },
};

const mutations = {
  [SET_SHOW_IMAGE_HEADER](state: State, show: boolean) {
    state.showHeaderImage = show;
  },
};

export default {
  state: store,
  getters,
  // actions,
  mutations,
};
