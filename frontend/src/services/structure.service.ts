import Vue from 'vue';

import {
  SET_STRUCTURE,

  SET_DEPT_USERS,
  ADD_DEPT_USER,
  UPDATE_DEPT_USER,
  REMOVE_DEPT_USER
} from '@/store/structure/mutations.type'

export const getStructure = async (context: any, clientId: String) => {
  //context.commit(SET_STRUCTURE, {});
  const response = await Vue.axios
    .get('api/structure', { params: clientId });
  context.commit(SET_STRUCTURE, response.data.result);
}

export const saveStructure = (context: any, structure: any) => {
  return Vue.axios
    .post(`api/structure`, structure)
    .then((response: any) => {
      context.commit(SET_STRUCTURE, response.data.result);
    });
}

export const editStructure = (context: any, structure: any) => {
  return Vue.axios
    .put(`api/structure/${structure._id}`, structure)
    .then((response: any) => {
      context.commit(SET_STRUCTURE, response.data.result);
    });
}

//// действия со списком сотрудников отдела

export const getDepartmentUsers = async (context: any, clientId: String) => {
  const response = await Vue.axios
    .get('api/dept_users', { params: clientId });
  context.commit(SET_DEPT_USERS, response.data.result);
}

export const createUsersOfDepartment = (context: any, data: any) => {
  return Vue.axios
    .post(`api/dept_users`, data)
    .then((response: any) => {
      context.commit(ADD_DEPT_USER, response.data.result);
    });
}

export const editUserOfDepartment = (context: any, data: any) => {
  return Vue.axios
    .put(`api/dept_users/${data._id}`, data)
    .then((response: any) => {
      context.commit(UPDATE_DEPT_USER, response.data.result);
    });
}

export const delUserOfDepartment = (context: any, recId: number) => {
  return Vue.axios
    .delete(`api/dept_users/${recId}`)
    .then((response: any) => {
      context.commit(REMOVE_DEPT_USER, response.data.result);
    });
};