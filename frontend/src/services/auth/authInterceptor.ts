import axios from 'axios';
import { SET_USER_DATA } from '@/store/user/mutations.type';
import { router } from '../../router';
import store from '../../store';

export const setAuthInterceptor = () => {
  axios.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    if (error.response == undefined) {
      const cfg = error.config
      console.log(`${error.message} at ${cfg.method} ${cfg.url}`);
      return
    }
    const errData = error.response.data;
    console.log(error);
    if (error.response.status === 401) {
      localStorage.removeItem('authorization');
      //store.commit(SET_USER, null);
      store.commit(SET_USER_DATA, null); // для теста - чтобы убрать везде SET_USER_
      router.push('/login');
    } else if (errData && errData.message) {
      console.error((errData.name ? errData.name + ': ' : '') + errData.message);
    } else if (error instanceof Error) {
      console.error(error.name + ': ' + error.message)
    }
    return Promise.reject(error);
  });
};
