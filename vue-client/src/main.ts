import Vue from 'vue';
import App from './App.vue';
import {router} from './router';
import store from './store';


import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import VuexAxios from 'vue-axios';
import axios from 'axios';
import ability from '../config/ability';
import { abilitiesPlugin } from '@casl/vue';

// @ts-ignore
import VueMq from 'vue-mq';

import {setAuthInterceptor} from '@/services/auth/authInterceptor';
import {setAuthToken} from '@/services/auth/setAuthToken';
import GAuth from 'vue-google-oauth2';
import {getInfoUser} from  '@/services/auth/auth.service';

const gauthOption = {
  clientId: '303964737986-rrtn3uic2fecmflemndjd8a1v4pjn76g.apps.googleusercontent.com',
  scope: 'profile email https://www.googleapis.com/auth/calendar',
  prompt: 'select_account',
};
Vue.use(GAuth, gauthOption);
Vue.use(VuexAxios, axios);
Vue.use(Antd);
Vue.use(abilitiesPlugin, ability);
var SocialSharing = require('vue-social-sharing');
Vue.use(SocialSharing);

Vue.config.productionTip = false;
if(localStorage.getItem('token')) {
  getInfoUser(localStorage.getItem('token'));
}

setAuthInterceptor();
Vue.axios.defaults.baseURL = 'http://localhost:4000';
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
