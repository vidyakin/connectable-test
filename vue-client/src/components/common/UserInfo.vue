<template>
  <div class="user-info-wrapper">
    <app-user-edit-drawer :close="closeEditDrawer" :visible="editDrawerVisible"></app-user-edit-drawer>
    <div class="user-info-avatar">
      <a-avatar :src="user && user.googleImage"></a-avatar>
      <a-button>Подписаться</a-button>
    </div>

    <div class="user-info-content">
      <div class="user-info-content-name">
        {{user && user.firstName}} {{user && user.lastName}}
      </div>
      <div class="user-info-content-positions">
        {{user && user.positions && user.positions.join(', ')}}
      </div>
      <div class="user-info-content-telephone">
        {{user && user.phone}}
      </div>
      <div class="user-info-content-email">
        {{user && user.email}}
      </div>
    </div>

    <div class="user-info-edit">
      <a-button icon="edit" @click="editDrawerVisible = true"></a-button>
    </div>

  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import AppLoginBar from './LoginBar'
  import AppUserEditDrawer from '../drawers/UserEditDrawer'
  import {SEND_NEW_POST} from "../../store/post/actions.type";

  export default {
    name: "AppUserInfo",
    components: {
      AppLoginBar,
      AppUserEditDrawer,
    },
    data() {
      return {
        current: '',
        editDrawerVisible: false,
      }
    },
    computed: {
      ...mapGetters(['user']),
    },
    methods: {
      closeEditDrawer() {
        this.editDrawerVisible = false;
      }
    },
  }
</script>

<style lang="scss">

  .user-info-wrapper {
    border-color: white;
    border-radius: 0.25rem;
    margin: 1.25rem 3.125rem;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);
    width: calc(100% - 6.25rem) !important;
    background-color: white;
    text-align: left;
    padding: 1.25rem;
    display: flex;

    .user-info-avatar {
      text-align: center;
      .ant-avatar {
        height: 4.5rem;
        width: 4.5rem;
        margin-bottom: 0.75rem;
      }
    }

    .user-info-content {
      padding-left: 1.5rem;
      width: calc(100% - 5.5rem);
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
      &-email, &-telephone {
        height: 1.2rem;
        font-size: 1rem;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.67;
        letter-spacing: normal;
        text-align: left;
        color: #43425d;
      }

    }
    .user-info-edit {
      .ant-btn {
        border: 0;
      }
  }
  }

</style>