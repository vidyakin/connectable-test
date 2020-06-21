import { SET_SHOW_IMAGE_HEADER } from '@/store/shower/mutations.type';
import {
  DELETE_POST,
  EDIT_POST,
  GET_POSTS, GET_POSTS_OF_FLWS,
  GET_POST,
  REPOST,
  SEND_COMMENT,
  SEND_LIKE,
  SEND_NEW_POST,
  DELETE_LIKE,
  DELETE_COMMENT,
  EDIT_COMMENT,
} from '@/store/post/actions.type';

import { } from '@/store/post/actions.type';
import {
  deletePost, editPost, getPosts, getPost, repost,
  getPostsOfFollows,
  sendComment, sendLike, sendNewPost, dislike, editComment, deleteComment
} from '@/services/post.service';

import {
  ADD_ANSWER_FOR_COMMENT,
  ADD_COMMENT_FOR_POST,
  ADD_LIKE_FOR_COMMENT,
  ADD_LIKE_FOR_POST,
  ADD_POST, CHANGE_POST, CHANGE_COMMENT, CHANGE_ANSWER,
  REMOVE_POST, SET_EDIT_POST_VISIBLE, SET_POST_FOR_EDITING, SET_EDIT_COMMENT_VISIBLE, SET_COMMENT_FOR_EDITING,
  SET_POSTS, SET_POSTS_OF_FOLLOWS, SET_POST, REMOVE_COMMENT, REMOVE_ANSWER,
} from '@/store/post/mutations.type';
import { DELETE_EVENT } from '@/store/user/actions.type';

interface State {
  posts: any[];
  posts_of_follows: any[],
  currentPost: any,
  comments: any[];
  postForEditing: any;
  commentForEditing: any;
  editPostVisible: boolean;
  editCommVisible: boolean;
}

const store: State = {
  posts: [],
  posts_of_follows: [],
  currentPost: null,
  comments: [],
  postForEditing: null,
  commentForEditing: null,
  editPostVisible: false,
  editCommVisible: false,
};

const getters = {
  posts(state: State) {
    return state.posts;
  },
  currentPost(state: State) {
    return state.currentPost;
  },
  comments(state: State) {
    return state.comments;
  },
  postForEditing(state: State) {
    return state.postForEditing;
  },
  commentForEditing(state: State) {
    return state.commentForEditing;
  },
  editPostVisible(state: State) {
    return state.editPostVisible;
  },
  editCommVisible(state: State) {
    return state.editCommVisible;
  },
  posts_of_follows(state: State) {
    return state.posts_of_follows
  }
};

const actions = {
  [SEND_NEW_POST]: sendNewPost,
  [GET_POSTS]: getPosts,
  [GET_POSTS_OF_FLWS]: getPostsOfFollows,
  [GET_POST]: getPost,
  [SEND_LIKE]: sendLike,
  [DELETE_LIKE]: dislike,
  [SEND_COMMENT]: sendComment,
  [DELETE_POST]: deletePost,
  [DELETE_COMMENT]: deleteComment,
  [REPOST]: repost,
  [EDIT_POST]: editPost,
  [EDIT_COMMENT]: editComment,
};

const mutations = {
  [SET_POSTS](state: State, posts: any[]) {
    state.posts = posts;
  },

  [SET_POSTS_OF_FOLLOWS](state: State, posts: any[]) {
    state.posts_of_follows = posts;
  },

  [SET_POST](state: State, post: any[]) {
    state.currentPost = post;
  },

  [ADD_POST](state: State, post: any) {
    state.posts = [post, ...state.posts];
  },

  [ADD_LIKE_FOR_POST](state: State, like: any) {
    const postIndex = state.posts.findIndex((post) => post._id === like.parent.id);
    state.posts[postIndex].likes.push(like)
  },

  [ADD_LIKE_FOR_COMMENT](state: State, like: any) {
    let commentIndex: any;
    const postIndex = state.posts.findIndex((post) => {
      commentIndex = post.comments.findIndex((comment: any) => comment._id === like.parent.id);
      return commentIndex !== -1;
    });
    state.posts[postIndex].comments[commentIndex].likes.push(like)
  },

  [ADD_COMMENT_FOR_POST](state: State, comment: any) {
    const postIndex = state.posts.findIndex((post) => post._id === comment.parent.id);
    state.posts[postIndex].comments.push(comment)
  },

  [ADD_ANSWER_FOR_COMMENT](state: State, answer: any) {
    let commentIndex: any;
    const postIndex = state.posts.findIndex((post) => {
      commentIndex = post.comments.findIndex((comment: any) => comment._id === answer.parent.id);
      return commentIndex !== -1;
    });
    const post = state.posts[postIndex]
    const coment = post.comments[commentIndex]
    state.posts[postIndex].comments[commentIndex].answers.push(answer)
  },

  [REMOVE_POST](state: State, postId: any) {
    if (state.posts) {
      const index = state.posts!.findIndex(({ _id }) => _id === postId);
      state.posts.splice(index, 1)
    }
  },

  [REMOVE_COMMENT](state: State, commentId: any) {
    let commentIndex: any;
    const postIndex = state.posts.findIndex((post) => {
      commentIndex = post.comments.findIndex((currentComment: any) => currentComment._id === commentId);
      return commentIndex !== -1;
    });
    state.posts[postIndex].comments.splice(commentIndex, 1)
  },

  [REMOVE_ANSWER](state: State, answerId: any) {
    let commentIndex: any, answersIndex: any;
    const postIndex = state.posts.findIndex((post) => {
      commentIndex = post.comments.findIndex((comment: any) => comment._id === answerId.parent);
      answersIndex = post.comments[commentIndex].answers.findIndex((answ: any) => answ._id === answerId._id);
      return commentIndex !== -1;
    });
    state.posts[postIndex].comments[commentIndex].answers.splice(answersIndex, 1)
  },

  [CHANGE_POST](state: State, post: any) {
    if (state.posts) {
      const index = state.posts!.findIndex(({ _id }) => _id === post._id);
      state.posts.splice(index, 1, post)
    }
  },

  [CHANGE_COMMENT](state: State, comment: any) {
    let commentIndex: any;
    const postIndex = state.posts.findIndex((post) => {
      commentIndex = post.comments.findIndex((currentComment: any) => currentComment._id === comment._id);
      return commentIndex !== -1;
    });
    state.posts[postIndex].comments.splice(commentIndex, 1, comment)
  },

  [CHANGE_ANSWER](state: State, answer: any) {
    /*const postIndex = state.posts.findIndex((post) => {
      commentIndex = state.posts.findIndex((comment) => {
        answerIndex = comment.findIndex((answ: any) => answ._id === answer.parent.id);
        return commentIndex !== -1;
      });
    });*/
    let commentIndex: any, answersIndex: any;
    const postIndex = state.posts.findIndex((post) => {
      commentIndex = post.comments.findIndex((comment: any) => comment._id === answer.parent.id);
      answersIndex = post.comments[commentIndex].answers.findIndex((answ: any) => answ._id === answer._id);
      return commentIndex !== -1;
    });
    state.posts[postIndex].comments[commentIndex].answers.splice(answersIndex, 1, answer)
  },

  [SET_POST_FOR_EDITING](state: State, post: any) {
    state.postForEditing = post;
  },

  [SET_COMMENT_FOR_EDITING](state: State, comment: any) {
    state.commentForEditing = comment;
  },

  [SET_EDIT_POST_VISIBLE](state: State, visible: any) {
    state.editPostVisible = visible;
  },

  [SET_EDIT_COMMENT_VISIBLE](state: State, visible: any) {
    state.editCommVisible = visible;
  },
};

export default {
  state: store,
  getters,
  actions,
  mutations,
};
