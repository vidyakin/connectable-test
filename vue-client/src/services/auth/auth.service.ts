import Vue from "vue";
import {LOGIN} from "@/store/user/actions.type";
import {SET_USER} from "@/store/user/mutations.type";
import {setAuthToken} from "@/services/auth/setAuthToken";

export const login = (context: any, user: any) => {
  return Vue.axios.post('/api/login', user)
    .then(response => {
      localStorage.setItem('authorization', 'true');
      localStorage.setItem('token', `Bearer ${response.data.token}`);
      context.commit(SET_USER, response.data.result);
      setAuthToken(`Bearer ${response.data.token}`);
    })
};

export const logout = (context: any) => {
  localStorage.removeItem('authorization');
  localStorage.removeItem('token');
  context.commit(SET_USER, null);
}

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
      context.dispatch(LOGIN, userForLogin);
    })
};

export const getInfoAboutUser = (context: any) => {
  return Vue.axios.get('/api/user/me')
    .then(response => {
      context.commit(SET_USER, response.data)
    })
};