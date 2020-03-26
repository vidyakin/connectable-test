import Vue from 'vue';
import {ADD_COMMENT_FOR_POST, ADD_LIKE_FOR_POST, ADD_POST, SET_POSTS} from '@/store/post/mutations.type';
import {
    ADD_EVENT,
    SET_CURRENT_USER,
    SET_EVENTS,
    SET_USER,
    SET_USERS,
    UPDATE_USER,
    IS_LOGGED_IN,
    CURRENT_USER_DATA,
    ERROR_REGISTER,
    ERROR_LOGIN,
    SUCCESS_REGISTER,
    SET_USER_DATA
} from '@/store/user/mutations.type';
import {DELETE_EVENT} from '@/store/user/actions.type';
import {setAuthToken} from '@/services/auth/setAuthToken';


export const editUser = (context: any, user: any) => {
  return Vue.axios
    .put(`api/user/${user._id}`, user)
    .then((response: any) => {
    context.commit(UPDATE_USER, response.data.result);
    context.commit(SET_USER_DATA, response.data);
    localStorage.setItem('token', response.data.token);
    setAuthToken(response.data.token);
    });
};

export const createEvent = (context: any, event: any) => {
  return Vue.axios
    .post(`api/event/`, event)
    .then((response: any) => {
      context.commit(ADD_EVENT, response.data.result);

    });
};

export const getEvents = (context: any, userId: any) => {
  return Vue.axios
    .get(`api/event/`, {params: {filter: {userId}}})
    .then((response: any) => {
      context.commit(SET_EVENTS, response.data.result);
    });
};

export const deleteEvent = (context: any, deleteId: any) => {
  return Vue.axios
    .delete(`api/event/${deleteId}`)
    .then((response: any) => {
      context.commit(DELETE_EVENT, deleteId);
    });
};


export const getUsers = (context: any) => {
  return Vue.axios
    .get(`api/user/` )
    .then((response: any) => {
      context.commit(SET_USERS, response.data.result);
    });
};

export const getUser = (context: any, userId: number) => {
  return Vue.axios
    .get(`api/user/${userId}`)
    .then((response: any) => {
      console.log(`getUser then: ${response.data.result}`);
      context.commit(SET_CURRENT_USER, response.data.result);
    })
    .catch(e => {
      console.log(`getUser Error: ${e}`);
    });
};

export const insertNewUser = (context: any, dataUser: any) => {
  return Vue.axios
    .post(`api/register`, dataUser).then((response: any) => {
      if (response.data.status === 200) {
          context.commit(ERROR_REGISTER, '');
          context.commit(SUCCESS_REGISTER, 'Регистрация прошла успешно');

      } else if (response.data.status === 202) {
          context.commit(ERROR_REGISTER, response.data.error);
      }
    }).catch(err => {
        console.log(err);
        localStorage.removeItem('authorization');
        localStorage.removeItem('token');
        localStorage.removeItem('CurrentUserData');
    });
};
export const checkUserInfo = (context: any, dataUser : any) => {
    return Vue.axios
        .post(`api/loginPage`, dataUser).then((response: any) => {

            if (response.data.status === 200) {
                context.commit(ERROR_LOGIN, '');
                context.commit(IS_LOGGED_IN, response.data.token);
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
