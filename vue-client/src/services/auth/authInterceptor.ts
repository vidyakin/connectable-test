import axios from 'axios';
import { SET_USER } from '@/store/user/mutations.type';
import { router } from '../../router';
import store from '../../store';

export const setAuthInterceptor = () => {
  axios.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    console.log(error);
    if (error.response.status === 401) {
      localStorage.removeItem('authorization');
      store.commit(SET_USER, null);
      router.push('/sign-in');
    }
    return Promise.reject(error);
  });
};
