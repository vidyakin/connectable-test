import { SET_SHOW_IMAGE_HEADER } from '@/store/shower/mutations.type';
import {
  DELETE_POST,
  EDIT_POST,
  GET_POSTS,
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
  sendComment, sendLike, sendNewPost, dislike, editComment, deleteComment
} from '@/services/post.service';

import {
  ADD_ANSWER_FOR_COMMENT,
  ADD_COMMENT_FOR_POST,
  ADD_LIKE_FOR_COMMENT,
  ADD_LIKE_FOR_POST,
  ADD_POST, CHANGE_POST, CHANGE_COMMENT, CHANGE_ANSWER,
  REMOVE_POST, SET_EDIT_POST_VISIBLE, SET_POST_FOR_EDITING, SET_EDIT_COMMENT_VISIBLE, SET_COMMENT_FOR_EDITING,
  SET_POSTS, SET_POST, REMOVE_COMMENT, REMOVE_ANSWER,
} from '@/store/post/mutations.type';
import { DELETE_EVENT } from '@/store/user/actions.type';

interface State {
  posts: any[];
  currentPost: any,
  comments: any[];
  postForEditing: any;
  commentForEditing: any;
  editPostVisible: boolean;
  editCommVisible: boolean;
}

const store: State = {
  posts: [],
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
};

const actions = {
  [SEND_NEW_POST]: sendNewPost,
  [GET_POSTS]: getPosts,
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
  [SET_POST](state: State, post: any[]) {
    state.currentPost = post;
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
    const post = state.posts[postIndex]
    const coment = post.comments[commentIndex]
    state.posts = [...state.posts.slice(0, postIndex),
    {
      ...post,
      comments: [
        ...post.comments.slice(0, commentIndex),
        {
          ...coment,
          answers: [...coment.answers, answer],
        },
        ...post.comments.slice(commentIndex + 1),
      ],
    },
    ...state.posts.slice(postIndex + 1)];
  },
  [REMOVE_POST](state: State, postId: any) {
    if (state.posts) {
      const index = state.posts!.findIndex(({ _id }) => _id === postId);
      state.posts.splice(index, 1)
      // state.posts = [
      //   ...state.posts!.slice(0, index),
      //   ...state.posts!.slice(index + 1),
      // ];
    }
  },
  [REMOVE_COMMENT](state: State, commentId: any) {
    let commentIndex: any;
    const postIndex = state.posts.findIndex((post) => {
      commentIndex = post.comments.findIndex((currentComment: any) => currentComment._id === commentId);
      return commentIndex !== -1;
    });
    const post = state.posts[postIndex]
    //state.posts[postIndex].comments.splice(commentIndex,1) // TODO: протестить вместо всего что далее
    state.posts = [...state.posts.slice(0, postIndex),
    {
      ...post,
      comments: [
        ...post.comments!.slice(0, commentIndex),
        ...post.comments!.slice(commentIndex + 1),
      ],
    },
    ...state.posts.slice(postIndex + 1)];
  },
  [REMOVE_ANSWER](state: State, answerId: any) {
    let commentIndex: any, answersIndex: any;
    const postIndex = state.posts.findIndex((post) => {
      commentIndex = post.comments.findIndex((comment: any) => comment._id === answerId.parent);
      answersIndex = post.comments[commentIndex].answers.findIndex((answ: any) => answ._id === answerId._id);
      return commentIndex !== -1;
    });
    state.posts = [...state.posts.slice(0, postIndex),
    {
      ...state.posts[postIndex],
      comments: [
        ...state.posts[postIndex].comments.slice(0, commentIndex),
        {
          ...state.posts[postIndex].comments[commentIndex],
          answers: [
            ...state.posts[postIndex].comments[commentIndex].answers!.slice(0, answersIndex),
            ...state.posts[postIndex].comments[commentIndex].answers!.slice(answersIndex + 1),
          ],
        },
        ...state.posts[postIndex].comments.slice(commentIndex + 1),
      ],
    },
    ...state.posts.slice(postIndex + 1)];
  },

  [CHANGE_POST](state: State, post: any) {
    if (state.posts) {
      const index = state.posts!.findIndex(({ _id }) => _id === post._id);
      state.posts = [
        ...state.posts!.slice(0, index),
        post,
        ...state.posts!.slice(index + 1),
      ];
    }
  },
  [CHANGE_COMMENT](state: State, comment: any) {
    let commentIndex: any;
    const postIndex = state.posts.findIndex((post) => {
      commentIndex = post.comments.findIndex((currentComment: any) => currentComment._id === comment._id);
      return commentIndex !== -1;
    });
    state.posts = [...state.posts.slice(0, postIndex),
    {
      ...state.posts[postIndex],
      comments: [
        ...state.posts[postIndex].comments!.slice(0, commentIndex),
        comment,
        ...state.posts[postIndex].comments!.slice(commentIndex + 1),
      ],
    },
    ...state.posts.slice(postIndex + 1)];
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
    state.posts = [...state.posts.slice(0, postIndex),
    {
      ...state.posts[postIndex],
      comments: [
        ...state.posts[postIndex].comments.slice(0, commentIndex),
        {
          ...state.posts[postIndex].comments[commentIndex],
          answers: [
            ...state.posts[postIndex].comments[commentIndex].answers!.slice(0, answersIndex),
            answer,
            ...state.posts[postIndex].comments[commentIndex].answers!.slice(answersIndex + 1),
          ],
        },
        ...state.posts[postIndex].comments.slice(commentIndex + 1),
      ],
    },
    ...state.posts.slice(postIndex + 1)];
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
