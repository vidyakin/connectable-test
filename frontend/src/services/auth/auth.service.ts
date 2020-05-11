import Vue from 'vue';
import { LOGIN, FORGOT_PASSWORD } from '@/store/user/actions.type';
import { SET_USER, SET_USER_DATA, FORGOT_INFO, RESET_INFO } from '@/store/user/mutations.type';
import { setAuthToken } from '@/services/auth/setAuthToken';
import store from '../../store';
import { router } from '../../router';

export const forgotPasword = (context: any, email: any) => {
  return Vue.axios.post('/auth/forgot_password', email)
    .then((response) => {
      context.commit(FORGOT_INFO, response.data);
    });
};
export const resetPassword = (context: any, userPasswords: any) => {
  return Vue.axios.post(`/auth/reset_password/${userPasswords.token}`, userPasswords)
    .then((response) => {
      context.commit(RESET_INFO, response.data);
    });
};

function decodeToken(response: any) {
  const base64Url = response.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return jsonPayload;
}

export const login = (context: any, user: any) => {
  console.log(`login: user before Axios: ${JSON.stringify(user, null, '\t')}`)
  return Vue.axios.post('/api/login', user)
    .then((response) => {
      const jsonPayload = decodeToken(response.data.token);
      const playload = JSON.parse(jsonPayload);
      const date = Math.floor(Date.now() / 1000);
      if (date >= playload.exp) {
        localStorage.removeItem('authorization');
        localStorage.removeItem('token');
        //store.commit(SET_USER, null);
        store.commit(SET_USER_DATA, null);
        router.push('/login');
      } else {
        console.log(`login: after axios response.data is: ${JSON.stringify(response.data, null, '\t')}`)
        localStorage.setItem('authorization', 'true');
        localStorage.setItem('token', `${response.data.token}`);
        //context.commit(SET_USER, response.data);
        context.commit(SET_USER_DATA, response.data);
        setAuthToken(`${response.data.token}`);
      }

    });
};

export const logout = (context: any) => {
  localStorage.removeItem('authorization');
  localStorage.removeItem('token');
  //context.commit(SET_USER, null);
  context.commit(SET_USER_DATA, null);
};

export const loginWithOutlook = (context: any, params: any) => {
  Vue.axios.post(`api/outlook/login`, {
    code: params.code
  })
    .then(response => {
      const name = response.data.name.split(' ');
      const userForLogin = {
        outlookId: response.data.uid,
        aud: response.data.aud,
        outlookToken: response.data.access_token,
        firstName: name[0],
        lastName: name[1],
        email: response.data.email,
      };
      console.log(response);
      context.dispatch(LOGIN, userForLogin).finally(() => {
        router.push('/about');
      });
    }).catch(e => {
      console.log(e);
    });
};

export const loginWithGoogle = (context: any, $gAuth: any) => {

  $gAuth.signIn()
    .then((GoogleUser: any) => {
      const userInfo = GoogleUser.getBasicProfile();
      const userForLogin = {
        googleId: GoogleUser.getId(),
        googleToken: GoogleUser.getAuthResponse().access_token,
        lastName: userInfo.getFamilyName(),
        firstName: userInfo.getGivenName(),
        email: userInfo.getEmail(),
        googleImage: userInfo.getImageUrl()
      };
      console.log('auth.service.ts:loginWithGoogle, userForLogin =', JSON.stringify(userForLogin, null, '\t'))
      context.dispatch(LOGIN, userForLogin).finally(() => {
        router.push('/about');
        // this.$router.push({ name: 'about' });
      });
    });
};

export const getInfoAboutUser = (context: any) => {
  return Vue.axios.get('/api/user/me')
    .then((response) => {
      if (response.data) {
        //context.commit(SET_USER, response.data);
        context.commit(SET_USER_DATA, response.data); // для теста - SET_USER_ надо убрать везде
      } else {
        console.log(`getInfoAboutUser: response data from '/api/user/me' is empty`);
      }
    });
};

// процедура проверки актуальности токена, вызывается при каждом переходе по ссылке, из роутера
export const getInfoUser = (token: any) => {
  const jsonPayload = decodeToken(token);
  const payload = JSON.parse(jsonPayload);
  const date = Math.floor(Date.now() / 1000);
  if (date >= payload.exp) {
    localStorage.removeItem('authorization');
    localStorage.removeItem('token');
    //store.commit(SET_USER, null);
    store.commit(SET_USER_DATA, null);
    router.push('/login');
  } else {
    return store.commit(SET_USER_DATA, payload);
  }

};
