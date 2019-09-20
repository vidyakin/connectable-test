<template>
  <div class="user-bar">

    <div class="user-info" v-if="this.datauser.result">

      <a-dropdown>
        <a-menu slot="overlay" >
          <a-menu-item key="logout" @click="logout">
            <a-icon type="logout" />Выйти
          </a-menu-item>
        </a-menu>
        <a-button class="logout" >
          {{ (currentUser ? currentUser.firstName : this.datauser.result.firstName) + ' ' + (currentUser ? currentUser.lastName : this.datauser.result.lastName) }}
            <a-icon type="down" />
        </a-button>
      </a-dropdown>

      <a-avatar :src="(this.datauser.result.googleImage ? this.datauser.result.googleImage : require('../../assets/no_image.png'))" />
    </div>
  </div>
</template>

<script>
import { SET_SHOW_IMAGE_HEADER } from '../../store/shower/mutations.type';
import { mapGetters } from 'vuex';
import store from '../../store';
import {
  LOGOUT,
} from '../../store/user/actions.type';

export default {
  name: 'AppLoginBar',
  data() {
    return {
      current: 1,
      datauser: (store.getters.user ? store.getters.user : store.getters.userData)
    };
  },
  computed: {
    ...mapGetters(['userData', 'user', 'currentUser']),
  },
  methods: {
    closeImage() {
      this.$store.commit(SET_SHOW_IMAGE_HEADER, false);
    },
    logout() {
      this.$store.dispatch(LOGOUT);
      this.$router.push({ name: 'login' });
    },
  },
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
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);

  .login {
    margin-right: 0.5rem;
    display: flex;
    justify-content: flex-end;

    .ant-btn {
      border: 0;
    }
  }

  .logout {
    border: none;
    padding: 0;
    height: auto;
  }
  .user-info {
    display: flex;
    justify-content: flex-end;
    margin-right: 30px;

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