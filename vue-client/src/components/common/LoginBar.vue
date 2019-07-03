<template>
  <div class="user-bar">
    <div class="login" v-if="!user">
      <a-button @click="login">Login</a-button>
    </div>
    <div class="user-info" v-if="user">
      <div class="user-info-name">
        {{ user.firstName }}
      </div>
      <a-icon type="down"></a-icon>
      <a-avatar :src="user.googleImage" />
    </div>
  </div>
</template>

<script>
  import {SET_SHOW_IMAGE_HEADER} from "../../store/shower/mutations.type";
  import {mapGetters} from "vuex";
  import {LOGIN, LOGIN_WITH_GOOGLE} from "../../store/user/actions.type";

  export default {
    name: "AppLoginBar",
    data() {
      return {
        current: 1,
      }
    },
    computed: {
      ...mapGetters(['user']),
    },
    methods: {
      closeImage() {
        this.$store.commit(SET_SHOW_IMAGE_HEADER, false)
      },
      login() {
        this.$store.dispatch(LOGIN_WITH_GOOGLE, this.$gAuth)
      },
    },
  }
</script>

<style lang="scss">

  .user-bar {

    height: 3.125rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);

    .login {
      margin-right: 0.5rem;
      display: flex;
      justify-content: flex-end;

      .ant-btn {
        border: 0;
      }

    }

    .user-info {
      display: flex;
      justify-content: flex-end;
      margin-right: 0.5rem;

      &-name {
        line-height: 3.125rem;
      }

      i {
        line-height: 3.125rem;
        margin-right: 0.5rem;
        margin-left: 0.5rem;
      }

      .ant-avatar {
        margin-top: 0.375rem;
        width: 2.375rem;
        height: 2.375rem;

      }

    }

  }

</style>