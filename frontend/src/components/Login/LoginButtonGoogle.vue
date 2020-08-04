<template>
  <div class="login-button">
    <a class="google-button" @click.prevent="login">
      <img src="@/assets/google-icon.png" style="margin: 5px;" />
      Sign in with Google
    </a>
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      this.$store.commit(ERROR_LOGIN, "");
      this.$store.dispatch(LOGIN_WITH_GOOGLE, this.$gAuth);
    }
  }
};
</script>

<style lang="scss">
.login-button {
  width: 100%;
  height: 5vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.google-button {
  display: flex;
  width: 212px;
  align-items: center;
  height: 41px;
  font-family: "Segoe UI" !important;
  font-size: 15px;
  font-weight: 600;
  color: #5e5e5e !important;
  border: 1px solid #8c8c8c;
}
.google-button:hover {
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