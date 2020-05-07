import Vue from 'vue';

import {
  SET_STRUCTURE,

  SET_DEPT_USERS,
  ADD_DEPT_USERS,
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

// получение сотрудников всех отделов, отбор по клиенту
export const getDepartmentUsers = async (context: any, clientId: String) => {
  const response = await Vue.axios
    .get('api/dept_users/' + clientId);
  context.commit(SET_DEPT_USERS, response.data);
}

// сохранение сотрудников одного отдела (добавление)
export const saveUsersOfDepartment = (context: any, data: any) => {
  return Vue.axios
    .post(`api/dept_users/${data.client_id}/${data.dept_id}`, { users: data.users })
    .then((response: any) => {
      getDepartmentUsers(context, data.client_id);
    });
}

// Изменение сотрудника
export const editUserOfDepartment = (context: any, data: any) => {
  console.log('EDIT empl data:', JSON.stringify(data, null, 2));

  return Vue.axios
    .put(`api/dept_users`, data)
    .then((response: any) => {
      context.commit(UPDATE_DEPT_USER, response.data);
    })
    .then(_ => getDepartmentUsers(context, data.client_id));
}

export const delUserOfDepartment = (context: any, data: any) => {
  return Vue.axios
    .delete(`api/dept_users`, { data })
    .then((response: any) => {
      context.commit(REMOVE_DEPT_USER, response.data);
    }).then(_ => getDepartmentUsers(context, data.client_id));
};