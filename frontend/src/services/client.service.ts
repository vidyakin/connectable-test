import Vue from 'vue';
import { SET_CLIENTS, ADD_CLIENT, UPDATE_CLIENT } from '@/store/client/mutations.type'

export const getClients = (context: any) => {
  return Vue.axios
    .get(`api/clients`)
    .then((res: any) => {
      context.commit(SET_CLIENTS, res.data.result)
    })
}

export const createClient = (context: any, client: any) => {
  return Vue.axios
    .post(`api/clients`, client)
    .then((res: any) => {
      context.commit(ADD_CLIENT, res.data.result)
    })
}

export const editClient = (context: any, client: any) => {
  return Vue.axios
    .put(`api/clients/${client._id}`, client)
    .then((res: any) => {
      context.commit(UPDATE_CLIENT, res.data.result)
    })
}