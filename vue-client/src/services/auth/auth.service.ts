import Vue from 'vue';
import {LOGIN} from '@/store/user/actions.type';
import {SET_USER, SET_USER_DATA} from '@/store/user/mutations.type';
import {setAuthToken} from '@/services/auth/setAuthToken';
import store from '../../store';
import { router } from '../../router';

function decodeToken(response:any) {
    var base64Url = response.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return jsonPayload;
};
export const login = (context: any, user: any) => {
  return Vue.axios.post('/api/login', user)
    .then((response) => {
        var jsonPayload = decodeToken(response.data.token);
        var playload = JSON.parse(jsonPayload);
        var date = Math.floor(Date.now() / 1000);
        if(date >= playload.exp) {
            localStorage.removeItem('authorization');
            localStorage.removeItem('token');
            store.commit(SET_USER, null);
            store.commit(SET_USER_DATA, null);
            router.push('/login');
        }
        else {
            localStorage.setItem('authorization', 'true');
            localStorage.setItem('token', `${response.data.token}`);
            context.commit(SET_USER, response.data);
            context.commit(SET_USER_DATA, response.data);
            setAuthToken(`${response.data.token}`);
        }

    });
};

export const logout = (context: any) => {
    localStorage.removeItem('authorization');
    localStorage.removeItem('token');
    context.commit(SET_USER, null);
    context.commit(SET_USER_DATA, null);
};

export const loginWithGoogle = (context: any, $gAuth: any) => {

  $gAuth.signIn()
    .then((GoogleUser: any) => {
      const userInfo = GoogleUser.getBasicProfile();
      const userForLogin = {
        googleId: GoogleUser.getId(),
        googleToken: GoogleUser.getAuthResponse().access_token,
        lastName: userInfo.wea,
        firstName: userInfo.ofa,
        email: userInfo.U3,
        googleImage: userInfo.Paa,
      };
      context.dispatch(LOGIN, userForLogin).finally(() => {
          router.push('/about');
          //this.$router.push({ name: 'about' });
        });
    });
};

export const getInfoAboutUser = (context: any) => {
  return Vue.axios.get('/api/user/me')
    .then((response) => {
      context.commit(SET_USER, response.data);
    });
};

export const getInfoUser = (token : any) => {
    var jsonPayload = decodeToken(token);
    var playload = JSON.parse(jsonPayload);
    var date = Math.floor(Date.now() / 1000);
    if(date >= playload.exp) {
        localStorage.removeItem('authorization');
        localStorage.removeItem('token');
        store.commit(SET_USER, null);
        store.commit(SET_USER_DATA, null);
        router.push('/login');
    }
    else {
        return store.commit(SET_USER_DATA, playload);
    }

};
