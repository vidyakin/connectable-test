import Vue from "vue";
import {
  ADD_GROUP,
  REMOVE_GROUP,
  SET_CURRENT_GROUP,
  SET_GROUPS, SET_INVITE,
  SET_PARTICIPANTS_REQUEST,
  UPDATE_GROUP
} from "@/store/group/mutations.type";
import {GET_CURRENT_GROUP} from "@/store/group/actions.type";
import {
  ADD_PROJECT,
  REMOVE_PROJECT,
  SET_CURRENT_PROJECT,
  SET_PROJECTS,
  UPDATE_PROJECT
} from "@/store/project/mutations.type";

export const createProject = (context: any, group: any) => {
  return Vue.axios
    .post(`api/project/`, group)
    .then((response: any) => {
      context.commit(ADD_PROJECT, response.data.result);
      return response.data.result;
    })
};

export const getProjects = (context: any, userId: any) => {
  return Vue.axios
    .get(`api/project/`,)
    .then((response: any) => {
      context.commit(SET_PROJECTS, response.data.result);
    })
};

export const getCurrentProject = (context: any, groupId: any) => {
  return Vue.axios
    .get(`api/project/${groupId}`)
    .then((response: any) => {
      context.commit(SET_CURRENT_PROJECT, response.data.result);
    })
};

export const deleteProject = (context: any, groupId: any) => {
  return Vue.axios
    .delete(`api/project/${groupId}`)
    .then((response: any) => {
      context.commit(REMOVE_PROJECT, response.data.result);
    })
};

export const editProject = (context: any, group: any) => {
  return Vue.axios
    .put(`api/project/${group._id}`, group)
    .then((response: any) => {
      context.commit(UPDATE_PROJECT, response.data.result);
    })
};

export const createProjectParticipant = (context: any, participant: any) => {
  return Vue.axios
    .post(`api/projectParticipant/`, participant);
};
