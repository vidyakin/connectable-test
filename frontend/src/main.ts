import Vue from 'vue';
import App from './App.vue';
import { router } from './router';
import store from './store';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import VuexAxios from 'vue-axios';
import axios from 'axios';
import ability from '../config/ability';
import { abilitiesPlugin } from '@casl/vue';
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';

// @ts-ignore
import VueMq from 'vue-mq';

import { setAuthInterceptor } from '@/services/auth/authInterceptor';
import { setAuthToken } from '@/services/auth/setAuthToken';
import GAuth from 'vue-google-oauth2';
import { getInfoUser } from '@/services/auth/auth.service';

const gauthOption = {
  clientId: '303964737986-rrtn3uic2fecmflemndjd8a1v4pjn76g.apps.googleusercontent.com',
  scope: 'profile email https://www.googleapis.com/auth/calendar',
  prompt: 'select_account',
};

//console.log(`ability: ${ability}`);

Vue.use(GAuth, gauthOption);
Vue.use(VuexAxios, axios);
Vue.use(Antd);
Vue.use(abilitiesPlugin, ability);

const SocialSharing = require('vue-social-sharing');
Vue.use(SocialSharing);

const socket = io(process.env.VUE_APP_API_URL || 'http://localhost:4000', {
  reconnection: true,
  reconnectionDelay: 1000,
  timeout: 1000 * 60 * 20
});

Vue.use(VueSocketIOExt, socket, { store });

Vue.config.productionTip = false;
if (localStorage.getItem('token')) {
  getInfoUser(localStorage.getItem('token'));
}

setAuthInterceptor();
Vue.axios.defaults.baseURL = `${process.env.VUE_APP_API_URL}`;

console.log(`backend address: ${process.env.VUE_APP_API_URL}`)

setAuthToken(localStorage.getItem('token'));

Vue.use(VueMq, {
  breakpoints: {
    mobile: 320,
    tablet: 1024,
    desktop: Infinity,
  },
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

// VUE_APP_API_URL='http://localhost:8080'
