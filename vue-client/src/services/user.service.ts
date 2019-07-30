import Vue from "vue";
import {ADD_COMMENT_FOR_POST, ADD_LIKE_FOR_POST, ADD_POST, SET_POSTS} from "@/store/post/mutations.type";
import {ADD_EVENT, SET_CURRENT_USER, SET_EVENTS, SET_USERS, UPDATE_USER} from "@/store/user/mutations.type";
import {DELETE_EVENT} from "@/store/user/actions.type";


export const editUser = (context: any, user: any) => {
  return Vue.axios
    .put(`api/user/${user._id}`, user)
    .then((response: any) => {
      context.commit(UPDATE_USER, response.data.result);
    })
};

export const createEvent = (context: any, event: any) => {
  return Vue.axios
    .post(`api/event/`, event)
    .then((response: any) => {
      context.commit(ADD_EVENT, response.data.result);
      console.log(response.data.result);
    })
};

export const getEvents = (context: any, userId: any) => {
  return Vue.axios
    .get(`api/event/`, {params: {filter: {userId: userId}}})
    .then((response: any) => {
      context.commit(SET_EVENTS, response.data.result);
    })
};

export const deleteEvent = (context: any, deleteId: any) => {
  return Vue.axios
    .delete(`api/event/${deleteId}`)
    .then((response: any) => {
      context.commit(DELETE_EVENT, deleteId);
    })
};


export const getUsers = (context: any) => {
  return Vue.axios
    .get(`api/user/`, )
    .then((response: any) => {
      context.commit(SET_USERS, response.data.result);
    })
};

export const getUser = (context: any, userId: number) => {
  return Vue.axios
    .get(`api/user/${userId}`)
    .then((response: any) => {
      context.commit(SET_CURRENT_USER, response.data.result);
    })
};
