<template>
  <div class="user-info-wrapper">
    <app-user-edit-drawer :close="closeEditDrawer" :visible="editDrawerVisible"></app-user-edit-drawer>
    <div class="user-info-avatar">
      <a-avatar :src=" (currentUser && currentUser.googleImage ? currentUser.googleImage : require('../../assets/no_image.png')) "></a-avatar>

      <a-button v-model="statusFollow" v-if="this.$route.params._id != userData.result._id" :class="{'is-active' : followIds.includes(userData.result._id)}" @click="handleFollowClick(currentUser._id, userData.result._id, userData.result.email, followIds.includes(userData.result._id))">
        {{ followIds.includes(userData.result._id) ? 'Уже подписаны' : 'Подписаться' }}
      </a-button>
    </div>

    <div class="user-info-content">
      <div class="user-info-content-name">
        {{currentUser && currentUser.firstName}} {{currentUser && currentUser.lastName}}
      </div>
      <div class="user-info-content-positions">
        {{currentUser && currentUser.positions && currentUser.positions.join(', ')}}
      </div>
      <div class="user-info-content-telephone">{{currentUser && currentUser.phone}}</div>
      <div class="user-info-content-email">{{currentUser && currentUser.email}}</div>
    </div>

    <div class="user-info-edit" v-if="userData.result._id == this.$route.params._id || $can('read', {'accessEmail': userData.result.email, '__type': 'User'})">
      <a-button icon="edit" @click="editDrawerVisible = true"></a-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AppLoginBar from './LoginBar';
import AppUserEditDrawer from '../drawers/UserEditDrawer';
import { SEND_NEW_POST } from '../../store/post/actions.type';
import { GET_USER } from '../../store/user/actions.type';

import {USER_FOLLOW, USER_UNFOLLOW} from '../../store/followers/actions.type';
export default {
  name: 'AppUserInfo',
  components: {
    AppLoginBar,
    AppUserEditDrawer,
  },
  data() {
    return {
      current: '',
      editDrawerVisible: false,
      statusFollow: false,
      followIds: [],
      userinfo: [],
    };
  },
  computed: {
    ...mapGetters(['currentUser', 'userData']),
  },
  methods: {
    closeEditDrawer() {
      this.editDrawerVisible = false;
    },
    handleFollowClick(user_id, current_user_id, current_user_email, follow_status) {
      let eventName;
      if(!follow_status) {
        this.statusFollow = true;
        eventName = USER_FOLLOW;
      }
      else {
        this.statusFollow = false;
        eventName = USER_UNFOLLOW;
      }

      this.$store
      .dispatch(eventName, {userID: user_id, curentUserID: current_user_id, userEmail: current_user_email})
      .finally(() => {
        this.$store.dispatch(GET_USER, this.$route.params._id);
      });
    }
  },
  watch: {
    currentUser(currentUser) {
      this.followIds = currentUser.followers;
      this.userinfo = currentUser._id;
    },
  }
};
</script>

<style lang="scss">
.user-info-wrapper {
  border-color: white;
  border-radius: 0.25rem;
  margin: 0 0 30px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);
  width: 100% !important;
  background-color: white;
  text-align: left;
  padding: 1.25rem;
  display: flex;

  @media (max-width: 767px) {
    position: relative;
    flex-wrap: wrap;
  }

  .user-info-avatar {
    text-align: center;
    .ant-avatar {
      height: 4.5rem;
      width: 4.5rem;
      margin-bottom: 0.75rem;
    }
    button {
      min-width: 130px;
    }
    button.is-active {
      border-color: #40a9ff;
      background: #40a9ff;
      color: #fff;
    }
  }

  .user-info-content {
    padding-left: 1.5rem;
    width: calc(100% - 5.5rem);

    @media (max-width: 767px) {
      padding-left: 0;
      width: 100%;
    }

    &-name {
      height: 1.5rem;
      font-size: 1.2rem;
      font-weight: bold;
      font-style: normal;
      font-stretch: normal;
      letter-spacing: normal;
      text-align: left;
      color: #4d4f5c;
    }

    &-positions {
      &:empty {
        display: none;
      }

      &:hover {
        cursor: pointer;
        opacity: 1;
      }

      height: 1.2rem;
      opacity: 0.5;
      font-size: 1rem;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.67;
      letter-spacing: normal;
      text-align: left;
      color: #43425d;
    }
    &-email,
    &-telephone {
      height: 1.2rem;
      font-size: 1rem;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.67;
      letter-spacing: normal;
      text-align: left;
      color: #43425d;

      &:empty {
        display: none;
      }
    }
  }
  .user-info-edit {

    @media (max-width: 767px) {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
    }
    .ant-btn {
      border: 0;
    }
  }
}
</style>