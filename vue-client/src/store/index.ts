import Vue from 'vue';
import Vuex from 'vuex';
import shower from './shower/shower.module';
import auth from './user/user.module';

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    shower,
    auth,
  },
});