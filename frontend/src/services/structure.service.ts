import Vue from 'vue';

import {
  SET_STRUCTURE
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