<template>
  <div class="user-bar">

    <div class="user-info" v-if="this.datauser.result">

      <a-popover placement="bottom" trigger="click">
        <template slot="content">
          <a-list itemLayout="horizontal" :dataSource="notifs" :locale="{emptyText:'Нет событий'}">
            <a-list-item class="notif-item" 
              slot="renderItem" slot-scope="item, index" 
              :v-for="(item,index) in notifs" :key="index"
            >
              <a-list-item-meta>
                <a slot="title" class="notif-title"><b>{{item.title}}</b></a>
                <a-avatar class="notif-avatar"
                  slot="avatar"
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                />
                <div slot="description" class="notif-description"><b>{{item.userFrom}}</b> {{item.text}} <i>{{item.subj}}</i></div>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </template>
        <!-- <span slot="title">Оповещения</span> -->
        <a-badge count="99" title="Есть непрочитанные сообщения">
          <a-button type="primary" shape="circle" icon="bell" size="large"/>
        </a-badge>
      </a-popover>      
      <a-dropdown>
        <a-menu slot="overlay" >
          <a-menu-item key="logout" @click="logout">
            <a-icon type="logout" />Выйти
          </a-menu-item>
        </a-menu>
        <a-button class="logout" style="margin-right: 1rem;" >
          <!-- {{currentUser && currentUser.firstName}} {{currentUser && currentUser.lastName}} -->
            {{ this.datauser.result.firstName + ' ' + this.datauser.result.lastName }}
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
      datauser: (store.getters.user ? store.getters.user : store.getters.userData),
      notifs: [
        {
          title: "Новая группа",
          userFrom: "Василий Потапенко",
          text: "создал новую группу",
          subj: "Любители хомяков"
        },
        {
          title: "Приглашение",
          userFrom: "Игнатий Котопесов",
          text: "пригласил вас на проект",
          subj: "Разработка модуля"
        },
        {
          title: "Уведомление",
          userFrom: "",
          text: "Всем в 17:00 собраться в переговорке Канада",
          subj: "Обсуждение этапа"
        }
      ]
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

.ant-popover-inner-content {
  padding: 5px 10px !important;
}

.notif {
  &-item {
    width: 350px;
    padding: 5px 0 !important;
  }
  &-title {
    margin-bottom: 0;
    font-size: 1.0rem;
  }
  &-description {
    font-size: 0.9rem;
    color: rgba(17, 12, 62, 0.6);
  }
  &-avatar {
    margin-right: 5px;
  }
}



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
 /* height: 3.125rem;*/
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
    position: relative;
    padding-left: 20px;
  }
  .logout::after {
    content: '';
    position: absolute;
    left: -50px;
    top: 0;
    height: 100%;
    width: 1px;
    background-color: #e8e8e8;
  }
  .user-info {
    display: flex;
    justify-content: flex-end;
    /*margin-right: 30px;*/
    padding: 10px 15px;

    &-name {
      line-height: 3.125rem;
    }

    // i {
    //   line-height: 0;
    //   margin-right: 0.5rem;
    //   margin-left: 0.5rem;
    // }

    .ant-avatar {
      /*margin-top: 0.375rem;*/
      margin-top: 0;
      margin-right: 0;
      width: 2.375rem;
      height: 2.375rem;
    }
  }  
}
</style>