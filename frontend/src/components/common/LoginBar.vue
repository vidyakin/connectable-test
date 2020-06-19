<template>
  <div class="user-bar">
    <div class="user-info" v-if="userData">
      <div style="align-self: center;" class="client-name">{{getClientInfo()}}</div>
      <!-- Список сообщений -->
      <!-- <a-popover placement="bottom" trigger="click">
        <template slot="content">
          <NotificationList @count="setNtfCounter" />
        </template>
        <a-badge :count="notifCount" title="Есть непрочитанные сообщения">
          <a-button type="primary" shape="circle" icon="bell" size="large" />
        </a-badge>
      </a-popover>-->
      <!-- Меню действий пользователя -->
      <div>
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
  </div>
</template>

<script>
import store from "../../store";
import { mapGetters } from "vuex";

import { LOGOUT } from "@/store/user/actions.type";
import { ENTER_CLIENT } from "@/store/client/actions.type";
import { SET_SHOW_IMAGE_HEADER } from "@/store/shower/mutations.type";
import { SET_CURRENT_CLIENT } from "@/store/client/mutations.type";

import NotificationList from "@/components/common/NotificationList";

export default {
  name: "AppLoginBar",
  components: {
    NotificationList
  },
  data() {
    return {
      current: 1
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
    };
  },
  computed: {
    ...mapGetters(["userData", "user", "users", "currentClient"])
    // isSuperAdmin() {
    //   return this.$can("manage", {
    //     accessEmail: this.userData.result.email,
    //     __type: "Client"
    //   });
    // }
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
      console.log(`socket message received`);
      if (payload.type === "NEW_GROUP") {
        //this.notifs.push(payload.val);
        //this.msgCount += 1;
        await this.$store.dispatch(GET_MESSAGES);
        //this.fillNotificationFeed();
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
    getSubdomain() {
      return window.location.href
        .replace(/https?:\/\//, "")
        .split("/")[0]
        .split(".")[0];
    },
    getClientInfo() {
      if (this.currentClient) return this.currentClient.name;
    },
    // установка счетчика сообщений из дочернего компонента
    // setNtfCounter(n) {
    //   this.notifCount = n;
    // },
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
  },
  async created() {
    const user = this.userData.result;
    // Если клиент не определен и пользователь - не суперадмин , то разлогиниваемся
    if (!this.currentClient) {
      if (!user.roles.includes("superadmin")) {
        await this.$store.dispatch(ENTER_CLIENT, user.client_id);
      } else {
        const currentClient = JSON.parse(localStorage.getItem("currentClient"));
        await this.$store.commit(SET_CURRENT_CLIENT, currentClient);
      }
    }
  }
};
</script>

<style lang="scss">
// .ant-popover-inner-content {
//   padding: 5px 10px !important;
// }

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
    margin-left: 15px;
  }
  .logout::after {
    content: "";
    position: absolute;
    left: -10px;
    top: 0;
    height: 100%;
    width: 1px;
    background-color: #e8e8e8;
  }
  .user-info {
    display: flex;
    justify-content: space-between;
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
    .client-name {
      font-size: 12pt;
      font-weight: bold;
    }

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