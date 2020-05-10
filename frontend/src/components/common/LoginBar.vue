<template>
  <div class="user-bar">
    <div class="user-info" v-if="userData">
      <!-- Список сообщений -->
      <a-popover placement="bottom" trigger="click">
        <template slot="content">
          <a-list itemLayout="horizontal" :dataSource="notifs" :locale="{emptyText:'Нет событий'}">
            <a-list-item
              class="notif-item"
              slot="renderItem"
              slot-scope="item, index"
              :v-for="(item,index) in notifs"
              :key="index"
            >
              <a-list-item-meta>
                <a slot="title" class="notif-title">
                  <b>{{item.title}}</b>
                </a>
                <a-avatar
                  class="notif-avatar"
                  slot="avatar"
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                />
                <!-- <div slot="description" class="notif-description"><b>{{item.userFrom}}</b> {{item.text}} <i>{{item.subj}}</i></div> -->
                <div slot="description" class="notif-description" v-html="item.html"></div>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </template>
        <!-- <span slot="title">Оповещения</span> -->
        <a-badge :count="messages.length" title="Есть непрочитанные сообщения">
          <a-button type="primary" shape="circle" icon="bell" size="large" />
        </a-badge>
      </a-popover>
      <!-- Меню действий пользователя -->
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item key="logout" @click="logout">
            <a-icon type="logout" />Выйти
          </a-menu-item>
        </a-menu>
        <a-button class="logout" style="margin-right: 1rem;">
          {{ loggedUserFullName() }}
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <!-- Аватарка -->
      <a-avatar :src="loggedUserAvatar()" />
    </div>
  </div>
</template>

<script>
import { SET_SHOW_IMAGE_HEADER } from "../../store/shower/mutations.type";
import { GET_MESSAGES } from "../../store/notification/actions.type";
import { mapGetters } from "vuex";
import store from "../../store";
import { LOGOUT } from "../../store/user/actions.type";

export default {
  name: "AppLoginBar",
  data() {
    return {
      current: 1,
      /*************************************** 
       * Структура объекта "datauser":
       * "result": {
            "positions": [],
            "followers": [],
            "followersEmail": [],
            "_id": "5e92702c807aa5006245cb5d",
            "googleId": 108......,
            "googleToken": "ya29.a0Ae4lvC0y_l...",
            "lastName": "Vidyakin",
            "firstName": "Sergey",
            "email": "vidyakin.sergey@gmail.com",
            "googleImage": "https://lh3.googleusercontent.com/a-/AOh14GiyLlRfNQLdCsrLGZrG5eIgVeW5IyM2ZlAaQmSyaQ=s96-c",
            "password": "",
            "__v": 0
        },
        "iat": 1586995323,
        "exp": 1587081723
       */
      // datauser: store.getters.user
      //   ? store.getters.user
      //   : store.getters.userData,
      /***************************************
       * Список уведомлений в выпадающем меню
       * Привязываться напрямую к геттеру messages из стейта нельзя т.к. для разных событий возможно надо формировать разный вид сообщений
       * Образец данных:
       * {
          title: "Новая группа",
          text: "<b>Александр Пушкин</b>создал новую группу: <i>Стрелковый клуб</i>"
        }
       * 
       */
      notifs: [],
      // Количество сообщений - для надписи на бейджике. Возможно не нужно отдельную переменную
      msgCount: 0
    };
  },
  computed: {
    ...mapGetters(["userData", "users", "messages"])
  },
  sockets: {
    connect() {
      console.log("socket connected");
    },
    /**
     * Событие на прием сообщения с кодом "socketMessage"
     * @param payload: object - {type, val}
     *  type - тип сообщения для разделения логики и универсальности
     *  val - данные, структура зависит от типа сообщения
     */
    async socketMessage(payload) {
      if (payload.type === "NEW_GROUP") {
        //this.notifs.push(payload.val);
        //this.msgCount += 1;
        await this.$store.dispatch(GET_MESSAGES);
        this.fillNotificationFeed();
      }
      // вывод оповещения о новом оповещении
      this.$notification["info"]({
        message: {
          NEW_GROUP: "Создана новая группа"
        }[payload.type],
        description: `Новое оповещение в ленте`,
        placement: "topLeft"
      });
    }
  },
  async created() {
    //console.log(`LoginBar: userdata is ${JSON.stringify(this.datauser,null,3)}`);
    await this.$store.dispatch(GET_MESSAGES); // TODO: доработать для получения только персональных и только НЕпрочитанных сообщений
    // динамическая подписка на событие сокета, на всякий случай
    // this.$socket.$subscribe('socketMessage', payload => {
    //   console.log(`socketMessage fired!`)
    // });
    this.fillNotificationFeed();
  },
  methods: {
    // datauser() {
    //   // TODO: переделать везде также. Может вообще отдельный геттер сделать с этой проверкой
    //   return this.userData ? this.userData.result : this.user;
    // },
    loggedUserFullName() {
      return (
        this.userData.result.firstName + " " + this.userData.result.lastName
      );
    },
    loggedUserAvatar() {
      return this.userData.result.googleImage
        ? this.userData.result.googleImage
        : require("../../assets/no_image.png");
    },
    closeImage() {
      this.$store.commit(SET_SHOW_IMAGE_HEADER, false);
    },
    logout() {
      this.$store.dispatch(LOGOUT);
      this.$router.push({ name: "login" });
    },
    fillNotificationFeed() {
      this.notifs = this.messages.map(msg => ({
        title: "Новая группа", // TODO: подстроить под разные типы сообщений
        html: msg.text
      }));
    }
  }
};
</script>

<style lang="scss">
// .ant-popover-inner-content {
//   padding: 5px 10px !important;
// }

.notif {
  &-item {
    width: 350px;
    padding: 5px 0 !important;
  }
  &-title {
    margin-bottom: 0;
    font-size: 1rem;
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
    padding-left: 10px;
    margin-left: 10px;
  }
  .logout::after {
    content: "";
    position: absolute;
    left: -60px;
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