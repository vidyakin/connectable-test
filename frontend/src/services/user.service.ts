import Vue from 'vue';
import { ADD_COMMENT_FOR_POST, ADD_LIKE_FOR_POST, ADD_POST, SET_POSTS } from '@/store/post/mutations.type';
import {
  ADD_EVENT,
  SET_CURRENT_USER,
  SET_EVENTS,
  CHANGE_EVENT,
  SET_USERS,
  UPDATE_USER,
  IS_LOGGED_IN,
  ERROR_REGISTER,
  ERROR_LOGIN,
  SUCCESS_REGISTER,
  SET_USER_DATA,
  ADD_ROLE, REMOVE_ROLE
} from '@/store/user/mutations.type';
import { DELETE_EVENT } from '@/store/user/actions.type';
import { setAuthToken } from '@/services/auth/setAuthToken';


// проверка введенных данных (имя, пароль) при логине
export const checkUserInfo = (context: any, dataUser: any) => {
  return Vue.axios
    .post(`api/loginPage`, dataUser).then((response: any) => {
      if (response == undefined) {
        context.commit(ERROR_LOGIN, { status: 522, server: `Ошибка сервера: Нет ответа на запрос` });
      } else if (response.data.status === 200) {
        context.commit(ERROR_LOGIN, '');
        context.commit(IS_LOGGED_IN, !!response.data.token);
        context.commit(SET_USER_DATA, response.data);
        //localStorage.setItem('CurrentUserData', response.data.result.firstName);
        localStorage.setItem('authorization', 'true');
        localStorage.setItem('token', response.data.token);
        setAuthToken(response.data.token);
      } else if (response.data.status === 202) {
        context.commit(ERROR_LOGIN, response.data);
      }
    }).catch(err => {
      localStorage.removeItem('authorization');
      localStorage.removeItem('token');
      localStorage.removeItem('CurrentUserData');
    });
};


export const getUsers = (context: any, client_workspace: string) => {
  const path = client_workspace ? `api/user/for_client/${client_workspace}` : 'api/user'
  return Vue.axios
    .get(path)
    .then((response: any) => {
      context.commit(SET_USERS, response.data.result);
    });
};

export const getUser = (context: any, userId: number) => {
  return Vue.axios
    .get(`api/user/${userId}`)
    .then((response: any) => {
      //console.log(`user.service.ts, getUser thr Axios: ${JSON.stringify(response.data.result)}`);
      context.commit(SET_CURRENT_USER, response.data.result);
    })
    .catch(e => {
      console.log(`getUser Error: ${e}`);
    });
};

export const editUser = (context: any, user: any) => {
  return Vue.axios
    .put(`api/user/${user._id}`, user)
    .then((response: any) => {
      context.commit(UPDATE_USER, response.data.result);
      // если редактируемый пользователь это залогиненный, изменяем данные залогиненного
      if (context.state.userData.result._id == response.data.result._id) {
        const userData = { ...context.state.userData, result: response.data.result }
        context.commit(SET_USER_DATA, userData);
        localStorage.setItem('token', response.data.token);
        setAuthToken(response.data.token);
      }
      context.commit(SET_CURRENT_USER, response.data.result);
    });
};

export const insertNewUser = (context: any, dataUser: any) => {
  return Vue.axios
    .post(`api/register`, dataUser).then((response: any) => {
      if (response.data.status === 200) {
        context.commit(ERROR_REGISTER, '');
        context.commit(SUCCESS_REGISTER, 'Регистрация прошла успешно');
        return response.data
      } else {
        context.commit(ERROR_REGISTER, response.data.error);
      }
    }).catch(err => {
      //console.log(err);
      if (err.response.status == 404) {
        context.commit(ERROR_REGISTER, err.response.data.error);
      }
      localStorage.removeItem('authorization');
      localStorage.removeItem('token');
      localStorage.removeItem('CurrentUserData');
    });
};

export const markUserAsDeleted = (context: any, userId: string) => {
  return Vue.axios
    .put(`api/user/delete/${userId}`)
    .then((res: any) => {
      context.commit(UPDATE_USER, res.data)
    })
}

export const unmarkUserAsDeleted = (context: any, userId: string) => {
  return Vue.axios
    .put(`api/user/undelete/${userId}`)
    .then((res: any) => {
      context.commit(UPDATE_USER, res.data)
    })
}

/**
 * EVENTS
 */

export const getEvents = (context: any, email: any) => {
  return Vue.axios
    //.get(`api/event/`, { params: { filter: { userId } } })
    .get(`api/events/` + email)
    .then((response: any) => {
      context.commit(SET_EVENTS, response.data);
    });
};

export const getEventsByClient = (context: any, workspace: string) => {
  return Vue.axios
    .get('/api/event/byClient/' + workspace)
    .then(response => {
      context.commit(SET_EVENTS, response.data);
    })
}

export const createEvent = (context: any, event: any) => {
  console.log(`createEvent starts on front: ${JSON.stringify(event, null, 3)}`);
  return Vue.axios
    .post(`api/event/`, event)
    .then((response: any) => {
      context.commit(ADD_EVENT, response.data.result);
      console.log(`Событие добавлено: ${JSON.stringify(response.data.result, null, 3)}`);
    });
};

export const updateEvent = ({ commit }: any, event: any) => {
  //console.log(`service: updateEvent starts: ${JSON.stringify(event, null, 3)}`);
  return Vue.axios
    .put(`api/event/${event._id}`, event)
    .then((response: any) => {
      commit(CHANGE_EVENT, response.data.result);
      //console.log(`service: updateEvent end: ${JSON.stringify(response.data.result, null, 3)}`);
    });
};

export const deleteEvent = ({ commit }: any, deleteId: any) => {
  return Vue.axios
    .delete(`api/event/${deleteId}`)
    .then((response: any) => {
      commit(DELETE_EVENT, deleteId);
    });
};
/**
 * ROLES: add & delete
 */
export const insertRole = ({ commit }: any, data: { user_id: string, role: string }) => {
  return Vue.axios
    .put(`api/user/${data.user_id}/role/${data.role}`)
    .then((response: any) => {
      commit(ADD_ROLE, data); // no using response
    });
}

export const deleteRole = ({ commit }: any, data: { user_id: string, role: string }) => {
  return Vue.axios
    .delete(`api/user/${data.user_id}/role/${data.role}`)
    .then((response: any) => {
      commit(REMOVE_ROLE, data); // no using response
    });
}

