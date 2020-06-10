<template>
  <div class="user-bar col-sm-4 offset-sm-4">
    <div class="login" v-if="!user">
      <a-button v-if="!user" @click="login">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="18px"
          height="18px"
          viewBox="0 0 48 48"
          class="abcRioButtonSvg"
        >
          <g>
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </g>
        </svg>
        Войти
      </a-button>
    </div>
  </div>
</template>

<script>
import { SET_SHOW_IMAGE_HEADER } from "@/store/shower/mutations.type";
import { mapGetters } from "vuex";

import { LOGIN, LOGIN_WITH_GOOGLE, LOGOUT } from "@/store/user/actions.type";
import { ERROR_LOGIN } from "@/store/user/mutations.type";

export default {
  data() {
    return {
      current: 1
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    closeImage() {
      this.$store.commit(SET_SHOW_IMAGE_HEADER, false);
    },
    login() {
      this.$store.commit(ERROR_LOGIN, "");
      this.$store.dispatch(LOGIN_WITH_GOOGLE, this.$gAuth);
    },
    logout() {
      this.$store.dispatch(LOGOUT);
      this.$router.push({ name: "login" });
    }
  }
};
</script>

<style lang="scss">
.user-info-popover {
  .ant-btn {
    border: 0;
  }

  .ant-popover-arrow {
    display: none;
  }
}

.user-info-popover-btn {
  &:hover {
    cursor: pointer;
  }
}

.user-bar {
  height: 3.125rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: none;

  .login {
    margin-right: 0;
    display: flex;
    justify-content: inherit;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
    .ant-btn {
      border: 0;
    }
    svg {
      float: left;
    }
    button {
      width: 100%;
    }
  }
}
</style>