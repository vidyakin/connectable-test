// import actions
import { GET_CLIENTS, CREATE_CLIENT, EDIT_CLIENT, ENTER_CLIENT, GET_STATISTIC, DROP_COLLECTION } from '@/store/client/actions.type'

// import mutations
import { ADD_CLIENT, SET_CLIENTS, SET_CURRENT_CLIENT, UPDATE_CLIENT, SET_LOGGED_CLIENT, SET_STATISTIC, SET_DIALOG_MESSAGE } from '@/store/client/mutations.type'

// import service functions
import { createClient, editClient, getClients, changeWorkspace, getStatistic, deleteCollection } from './client.service';

interface Client {
  _id: any,
  code: String,   // Краткий код для удобства опознавания и вывода
  name: String,   // Полное наименование компании
  city: String,   // город компании
  address: String, // Адрес компании
  phone: String,   // основной телефон компании
  director: String, // директор компании
  logo: String,       // путь к логотипу компании
  colors: string[],  // массив корпоративных цветов,
  has_access: Boolean, // статус активного доступа к функционалу
  comment: String
}

interface State {
  clients: Client[],
  currentClient: Client | null,
  clientLogged: String,
  client_statistic: Object | null,
  dialog_message: String
}

const store: State = {
  clients: [],
  currentClient: null,
  clientLogged: "",
  client_statistic: null,
  dialog_message: ""
}

const getters = {
  clients(state: State) {
    return state.clients;
  },
  currentClient(state: State) {
    return state.currentClient
  },
  client_statistic(state: State) {
    return state.client_statistic
  },
  dialog_message(state: State) {
    return state.dialog_message
  }
}

const mutations = {
  [SET_DIALOG_MESSAGE](state: State, text: string) {
    state.dialog_message = text
  },
  [SET_CLIENTS](state: State, clients: Client[]) {
    state.clients = clients
  },
  [SET_CURRENT_CLIENT](state: State, client: Client | null) {
    console.log(`client ws set to ${client?.name}`);

    state.currentClient = client
  },
  [UPDATE_CLIENT](state: State, client: Client) {
    const index: number = state.clients.findIndex((cl: Client) => cl._id == client._id)
    if (index != -1) {
      state.clients?.splice(index, 1, client)
    }
  },
  [ADD_CLIENT](state: State, client: Client) {
    state.clients.push(client)
  },
  [SET_LOGGED_CLIENT](state: State, client_id: String) {
    state.clientLogged = client_id
  },
  [SET_STATISTIC](state: State, data: Object) {
    state.client_statistic = data
  }
}

const actions = {
  [GET_CLIENTS]: getClients,
  [CREATE_CLIENT]: createClient,
  [EDIT_CLIENT]: editClient,
  [ENTER_CLIENT]: changeWorkspace,
  [GET_STATISTIC]: getStatistic,
  [DROP_COLLECTION]: deleteCollection
}

export default {
  state: store,
  getters,
  actions,
  mutations
};