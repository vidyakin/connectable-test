<template>
  <div class="login-button">
    <a class="ms-button" :href="outlookUrl">
      <img src="@/assets/Icons/ms-symbol.png" style="margin-right: 10px" />
      Sign in with Microsoft
    </a>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";

import {
  LOGIN,
  LOGIN_WITH_OUTLOOK,
  LOGOUT
} from "../../store/user/actions.type";

export default {
  data() {
    return {
      current: 1,
      outlookUrl: ""
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    login() {
      this.$store.dispatch(LOGIN_WITH_OUTLOOK, this.outlookUrl);
    },
    logout() {
      this.$store.dispatch(LOGOUT);
      this.$router.push({ name: "login" });
    }
  },
  beforeCreate() {
    Vue.axios
      .get("/api/outlook/login-url")
      .then(response => {
        this.outlookUrl = response.data.loginUrl;
      })
      .catch(e => {
        console.log(e);
      });
  }
};
</script>

<style scoped lang="scss">
.login-button {
  width: 100%;
  height: 5vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ms-button {
  display: flex;
  align-items: center;
  height: 41px;
  color: #5e5e5e;
  font-family: "Segoe UI" !important;
  font-size: 15px;
  font-weight: 600;
  border: 1px solid #8c8c8c;
  padding: 8px 20px 8px 10px;
}

.ms-button:hover {
  // Тень
  // -webkit-box-shadow: 0px 0px 6px 1px rgba(173, 173, 173, 1);
  // -moz-box-shadow: 0px 0px 6px 1px rgba(173, 173, 173, 1);
  // box-shadow: 0px 0px 6px 1px rgba(173, 173, 173, 1);
  // Анимация фона
  background-color: #d1d1d1;
  -webkit-transition: background-color 300ms linear;
  -ms-transition: background-color 300ms linear;
  transition: background-color 300ms linear;
}
</style>
