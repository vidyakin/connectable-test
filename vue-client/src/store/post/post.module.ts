import {SET_SHOW_IMAGE_HEADER} from "@/store/shower/mutations.type";
import {GET_POSTS, SEND_COMMENT, SEND_LIKE, SEND_NEW_POST} from "@/store/post/actions.type";
import {getPosts, sendComment, sendLike, sendNewPost} from "@/services/post.service";
import {ADD_LIKE_FOR_POST, ADD_POST, SET_POSTS} from "@/store/post/mutations.type";

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
  [SEND_LIKE]: sendLike,
  [SEND_COMMENT]: sendComment,
};

const mutations = {
  [SET_POSTS](state: State, posts: any[]) {
    state.posts = posts;
  },
  [ADD_POST](state: State, post: any) {
    state.posts = [post, ...state.posts];
  },
  [ADD_LIKE_FOR_POST](state: State, like: any) {
    const postIndex = state.posts.findIndex(post => post._id === like.parent.id);
    state.posts = [...state.posts.slice(0, postIndex),
      {...state.posts[postIndex],
        likes: [...state.posts[postIndex].likes, like]
      },
      ...state.posts.slice(postIndex + 1)];
  },
};

export default {
  state: store,
  getters,
  actions,
  mutations,
};