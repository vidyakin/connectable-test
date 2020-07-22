import Vue from 'vue';
import { SET_CLIENTS, ADD_CLIENT, UPDATE_CLIENT, SET_CURRENT_CLIENT, SET_STATISTIC, SET_DIALOG_MESSAGE } from '@/store/client/mutations.type'

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

// wspace must be a name of client workspace and empty string to exit to client management mode
export const changeWorkspace = (context: any, wspace: string) => {
  return Vue.axios
    .get(`/api/clients/by_ws/${wspace}`)
    .then((res: any) => {
      context.commit(SET_CURRENT_CLIENT, res.data)
    })
}

export const getStatistic = (context: any, wspace: string) => {
  return Vue.axios
    .get(`/api/clients/stat/${wspace}`)
    .then(res => {
      context.commit(SET_STATISTIC, res.data)
    })
}

export const deleteCollection = (context: any, data: { client: string, coll_name: string }) => {
  return Vue.axios
    .delete(`/api/clients/${data.client}/${data.coll_name}`)
    .then(resDelete => {
      context.commit(SET_DIALOG_MESSAGE, resDelete.data.result)
      Vue.axios.get(`/api/clients/stat/${data.client}`)
        .then(resGet => {
          context.commit(SET_STATISTIC, resGet.data)
        })
    })
    .catch(err => {
      throw Error('Ошибка при удалении данных клиента: ' + err)
    })
}