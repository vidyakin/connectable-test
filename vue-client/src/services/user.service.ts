import Vue from "vue";
import {ADD_COMMENT_FOR_POST, ADD_LIKE_FOR_POST, ADD_POST, SET_POSTS} from "@/store/post/mutations.type";
import {UPDATE_USER} from "@/store/user/mutations.type";


export const editUser = (context: any, user: any) => {
  return Vue.axios
    .put(`api/user/${user._id}`, user)
    .then((response: any) => {
      context.commit(UPDATE_USER, response.data.result);
    })
};
