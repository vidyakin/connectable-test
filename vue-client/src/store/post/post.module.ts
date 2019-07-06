import {SET_SHOW_IMAGE_HEADER} from "@/store/shower/mutations.type";
import {GET_POSTS, SEND_NEW_POST} from "@/store/post/actions.type";
import {getPosts, sendNewPost} from "@/services/post.service";
import {ADD_POST, SET_POSTS} from "@/store/post/mutations.type";

interface State {
  posts: any[],
};

const store: State = {
  posts: [],
};

const getters = {
  posts(state: State) {
    return state.posts;
  }
};

const actions = {
  [SEND_NEW_POST]: sendNewPost,
  [GET_POSTS]: getPosts,
};

const mutations = {
  [SET_POSTS](state: State, posts: any[]) {
    state.posts = posts;
  },
  [ADD_POST](state: State, post: any) {
    state.posts = [post, ...state.posts];
  },
};

export default {
  state: store,
  getters,
  actions,
  mutations,
};