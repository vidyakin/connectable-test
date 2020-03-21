<template>
  <div class="login-page">
    <a class="f6 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue" v-bind:href="outlookUrl">Login with Outlook</a>
  </div>
</template>

<script> 
import { SET_SHOW_IMAGE_HEADER } from '../../store/shower/mutations.type';
import { mapGetters } from 'vuex';

import {
  LOGIN,
  LOGIN_WITH_OUTLOOK,
  LOGOUT,
} from '../../store/user/actions.type';

export default {
  data() {
    return {
      current: 1,
      outlookUrl: ''
    };
  },
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    closeImage() {
      this.$store.commit(SET_SHOW_IMAGE_HEADER, false);
    },
    login() { 
      this.$store.dispatch(LOGIN_WITH_OUTLOOK, this.outlookUrl);      
    },
    logout() {
      this.$store.dispatch(LOGOUT);
      this.$router.push({ name: 'login' });
    },
  },
  beforeCreate() {
        const a = Vue.axios.get('/')
            .then((response) => {
                this.outlookUrl = response.data.response.signInUrl;
            }).catch((e) => {
                console.log(e);
            });
        return a;
    }
};
</script>

<style scoped>
  .login-page {
    width: 100%;
    height: 10vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
