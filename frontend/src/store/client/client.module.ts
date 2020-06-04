// import actions
import { GET_CLIENTS, CREATE_CLIENT, EDIT_CLIENT, ENTER_CLIENT } from '@/store/client/actions.type'

// import mutations
import { ADD_CLIENT, SET_CLIENTS, SET_CURRENT_CLIENT, UPDATE_CLIENT, SET_LOGGED_CLIENT } from '@/store/client/mutations.type'

// import service functions
import { createClient, editClient, getClients, changeWorkspace } from '@/services/client.service';

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
  clientLogged: String
}

const store: State = {
  clients: [],
  currentClient: null,
  clientLogged: ""
}

const getters = {
  clients(state: State) {
    return state.clients;
  },
  currentClient(state: State) {
    return state.currentClient
  }
}

const mutations = {
  [SET_CLIENTS](state: State, clients: Client[]) {
    state.clients = clients
  },
  [SET_CURRENT_CLIENT](state: State, client: Client) {
    console.log(`client ws set to ${client.name}`);

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
}

const actions = {
  [GET_CLIENTS]: getClients,
  [CREATE_CLIENT]: createClient,
  [EDIT_CLIENT]: editClient,
  [ENTER_CLIENT]: changeWorkspace
}

export default {
  state: store,
  getters,
  actions,
  mutations
};