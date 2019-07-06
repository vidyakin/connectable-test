import Vue from "vue";
import {ADD_POST, SET_POSTS} from "@/store/post/mutations.type";

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