import Vue from 'vue';
import Vuex from 'vuex';
import shower from './shower/shower.module';

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    shower,
  },
});