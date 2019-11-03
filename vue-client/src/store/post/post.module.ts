import {SET_SHOW_IMAGE_HEADER} from '@/store/shower/mutations.type';
import {
  DELETE_POST,
  EDIT_POST,
  GET_POSTS,
  REPOST,
  SEND_COMMENT,
  SEND_LIKE,
  SEND_NEW_POST,
  DELETE_LIKE,
} from '@/store/post/actions.type';
import {deletePost, editPost, getPosts, repost, sendComment, sendLike, sendNewPost, dislike} from '@/services/post.service';
import {
  ADD_ANSWER_FOR_COMMENT,
  ADD_COMMENT_FOR_POST,
  ADD_LIKE_FOR_COMMENT,
  ADD_LIKE_FOR_POST,
  ADD_POST, CHANGE_POST,
  REMOVE_POST, SET_EDIT_POST_VISIBLE, SET_POST_FOR_EDITING,
  SET_POSTS,
} from '@/store/post/mutations.type';
import {DELETE_EVENT} from '@/store/user/actions.type';

interface State {
  posts: any[];
  postForEditing: any;
  editPostVisible: boolean;
}

const store: State = {
  posts: [],
  postForEditing: null,
  editPostVisible: false,
};

const getters = {
  posts(state: State) {
    return state.posts;
  },
  postForEditing(state: State) {
    return state.postForEditing;
  },
  editPostVisible(state: State) {
    return state.editPostVisible;
  },
};

const actions = {
  [SEND_NEW_POST]: sendNewPost,
  [GET_POSTS]: getPosts,
  [SEND_LIKE]: sendLike,
  [DELETE_LIKE]: dislike,
  [SEND_COMMENT]: sendComment,
  [DELETE_POST]: deletePost,
  [REPOST]: repost,
  [EDIT_POST]: editPost,
};

const mutations = {
  [SET_POSTS](state: State, posts: any[]) {
    state.posts = posts;
  },
  [ADD_POST](state: State, post: any) {
    state.posts = [post, ...state.posts];
  },
  [ADD_LIKE_FOR_POST](state: State, like: any) {
    const postIndex = state.posts.findIndex((post) => post._id === like.parent.id);
    state.posts = [...state.posts.slice(0, postIndex),
      {
        ...state.posts[postIndex],
        likes: [...state.posts[postIndex].likes, like],
      },
      ...state.posts.slice(postIndex + 1)];
  },
  [ADD_LIKE_FOR_COMMENT](state: State, like: any) {
    let commentIndex: any;
    const postIndex = state.posts.findIndex((post) => {
      commentIndex = post.comments.findIndex((comment: any) => comment._id === like.parent.id);
      return commentIndex !== -1;
    });
    state.posts = [...state.posts.slice(0, postIndex),
      {
        ...state.posts[postIndex],
        comments: [
          ...state.posts[postIndex].comments.slice(0, commentIndex),
          {
            ...state.posts[postIndex].comments[commentIndex],
            likes: [...state.posts[postIndex].comments[commentIndex].likes, like],
          },
          ...state.posts[postIndex].comments.slice(commentIndex + 1),
        ],
      },
      ...state.posts.slice(postIndex + 1)];
  },
  [ADD_COMMENT_FOR_POST](state: State, comment: any) {
    const postIndex = state.posts.findIndex((post) => post._id === comment.parent.id);
    state.posts = [...state.posts.slice(0, postIndex),
      {
        ...state.posts[postIndex],
        comments: [...state.posts[postIndex].comments, comment],
      },
      ...state.posts.slice(postIndex + 1)];
  },

  [ADD_ANSWER_FOR_COMMENT](state: State, answer: any) {
    let commentIndex: any;
    const postIndex = state.posts.findIndex((post) => {
      commentIndex = post.comments.findIndex((comment: any) => comment._id === answer.parent.id);
      return commentIndex !== -1;
    });
    state.posts = [...state.posts.slice(0, postIndex),
      {
        ...state.posts[postIndex],
        comments: [
          ...state.posts[postIndex].comments.slice(0, commentIndex),
          {
            ...state.posts[postIndex].comments[commentIndex],
            answers: [...state.posts[postIndex].comments[commentIndex].answers, answer],
          },
          ...state.posts[postIndex].comments.slice(commentIndex + 1),
        ],
      },
      ...state.posts.slice(postIndex + 1)];
  },
  [REMOVE_POST](state: State, postId: any) {
    if (state.posts) {
      const index = state.posts!.findIndex(({_id}) => _id === postId);
      state.posts = [
        ...state.posts!.slice(0, index),
        ...state.posts!.slice(index + 1),
      ];
    }
  },
  [CHANGE_POST](state: State, post: any) {
    if (state.posts) {
      const index = state.posts!.findIndex(({_id}) => _id === post._id);
      state.posts = [
        ...state.posts!.slice(0, index),
        post,
        ...state.posts!.slice(index + 1),
      ];
    }
  },
  [SET_POST_FOR_EDITING](state: State, post: any) {
    state.postForEditing = post;
  },
  [SET_EDIT_POST_VISIBLE](state: State, visible: any) {
    state.editPostVisible = visible;
  },
};

export default {
  state: store,
  getters,
  actions,
  mutations,
};
