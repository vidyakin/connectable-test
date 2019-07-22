import Vue from "vue";
import {ADD_COMMENT_FOR_POST, ADD_LIKE_FOR_POST, ADD_POST, SET_POSTS} from "@/store/post/mutations.type";
import {ADD_EVENT, SET_EVENTS, SET_USERS, UPDATE_USER} from "@/store/user/mutations.type";
import {DELETE_EVENT} from "@/store/user/actions.type";
import {ADD_GROUP, REMOVE_GROUP, SET_CURRENT_GROUP, SET_GROUPS, UPDATE_GROUP} from "@/store/group/mutations.type";

export const createGroup = (context: any, group: any) => {
  return Vue.axios
    .post(`api/group/`, group)
    .then((response: any) => {
      context.commit(ADD_GROUP, response.data.result);
    })
};

export const getGroups = (context: any, userId: any) => {
  return Vue.axios
    .get(`api/group/`,)
    .then((response: any) => {
      context.commit(SET_GROUPS, response.data.result);
    })
};

export const getCurrentGroup = (context: any, groupId: any) => {
  return Vue.axios
    .get(`api/group/${groupId}`)
    .then((response: any) => {
      context.commit(SET_CURRENT_GROUP, response.data.result);
    })
};

export const deleteGroup = (context: any, groupId: any) => {
  return Vue.axios
    .delete(`api/group/${groupId}`)
    .then((response: any) => {
      context.commit(REMOVE_GROUP, response.data.result);
    })
};

export const editGroup = (context: any, group: any) => {
  return Vue.axios
    .put(`api/group/${group._id}`, group)
    .then((response: any) => {
      context.commit(UPDATE_GROUP, response.data.result);
    })
};