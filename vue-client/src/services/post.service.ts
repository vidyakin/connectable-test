import Vue from "vue";
import {ADD_COMMENT_FOR_POST, ADD_LIKE_FOR_POST, ADD_POST, SET_POSTS} from "@/store/post/mutations.type";

export const sendNewPost = (context: any, post: any) => {
  return Vue.axios
    .post('api/post', post)
    .then((response: any) => {
      context.commit(ADD_POST, response.data.result);

    })
};

export const getPosts = (context: any, parent: any) => {
  return Vue.axios
    .get('api/post', parent)
    .then((response: any) => {
      context.commit(SET_POSTS, response.data.result);
    })
};

export const sendLike = (context: any, like: any) => {
  return Vue.axios
    .post('api/like', like)
    .then((response: any) => {
      const newLike = response.data.result;
      if (newLike.parent.type === 'post') {
        context.commit(ADD_LIKE_FOR_POST, newLike);
      }
    })
};

export const sendComment = (context: any, like: any) => {
  return Vue.axios
    .post('api/comment', like)
    .then((response: any) => {
      const newComment = response.data.result;
      if (newComment.parrent.type === 'post') context.commit(ADD_COMMENT_FOR_POST, newComment);
    })
};