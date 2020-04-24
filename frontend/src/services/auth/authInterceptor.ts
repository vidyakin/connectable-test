import axios from 'axios';
import { SET_USER } from '@/store/user/mutations.type';
import { router } from '../../router';
import store from '../../store';

export const setAuthInterceptor = () => {
  axios.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    const errData = error.response.data;
    console.log(error);
    if (error.response.status === 401) {
      localStorage.removeItem('authorization');
      store.commit(SET_USER, null);
      router.push('/login');
    } else if (errData && errData.message) {
      console.error((errData.name ? errData.name + ': ' : '') + errData.message);
    } else if (error instanceof Error) {
      console.error(error.name + ': ' + error.message)
    }
    return Promise.reject(error);
  });
};
