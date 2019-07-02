import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import VuexAxios from 'vue-axios';
import axios from 'axios';

import {setAuthInterceptor} from "@/services/auth/authInterceptor";
import {setAuthToken} from "@/services/auth/setAuthToken";
import GAuth from 'vue-google-oauth2'
const gauthOption = {
  clientId: '303964737986-rrtn3uic2fecmflemndjd8a1v4pjn76g.apps.googleusercontent.com',
  scope: 'profile email https://www.googleapis.com/auth/calendar',
  prompt: 'select_account'
};
Vue.use(GAuth, gauthOption);



Vue.use(VuexAxios, axios);
Vue.use(Antd);

Vue.config.productionTip = false;


setAuthInterceptor();
Vue.axios.defaults.baseURL = 'http://localhost:4000';
setAuthToken(localStorage.getItem('authorization'));

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
