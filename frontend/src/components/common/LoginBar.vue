<template>
  <div class="user-bar">
    <div class="user-info" v-if="userData">
      <div style="align-self: center;" class="client-name">
        <div>
          {{getClientInfo()}}
          Socket {{!$socket.client.connected ? 'not connected' : 'connected: '+$socket.client.nsp}})
        </div>
        <div style="display: flex; align-items: center;margin-left: 50px;">
          <a-button size="small" @click="pingSocketServer">PING</a-button>
          <a-alert :message="pong.msg" :type="pong.type" banner v-show="pong.show" />
          <!-- <a-button size="small" @click.prevent="playSound">Beep</a-button> -->
          <audio id="audio" src="@/assets/sounds/guess-what.mp3" />
        </div>
      </div>
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
import { GET_MESSAGES } from "@/store/notification/actions.type";

import { SET_SHOW_IMAGE_HEADER } from "@/store/shower/mutations.type";
import { SET_CURRENT_CLIENT } from "@/store/client/mutations.type";

//import NotificationList from "@/components/Company/NotificationList";

export default {
  name: "AppLoginBar",
  components: {
    //NotificationList
  },
  data() {
    return {
      current: 1,
      audio: null,
      pong: { show: false, type: "success", msg: "" },
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
    ...mapGetters(["userData", "user", "users", "currentClient"]),
    getSocket_nsp() {
      return this.$socket.client.nsp;
    },
    // isSuperAdmin() {
    //   return this.$can("manage", {
    //     accessEmail: this.userData.result.email,
    //     __type: "Client"
    //   });
    // }
  },
  sockets: {
    connect() {
      console.log("socket connected:", this.$socket.client.id);
    },
    disconnect() {
      console.log("socket disconnected");
    },
    /**
     * Событие на прием сообщения с кодом "socketMessage"
     * @param payload: object - {type, val}
     *  type - тип сообщения для разделения логики и универсальности
     *  val - данные, структура зависит от типа сообщения
     */
    async socketMessage(payload) {
      const messages = {
        NEW_GROUP: "Создана новая группа",
        NEW_EMPL: "Добавлен новый сотрудник",
        UPDATE_FEED: "Нужно обновить ленту",
        FOR_ALL: "ВСЕМ ВСЕМ ВСЕМ",
      };
      console.log(`socket message received`);
      // здесь только оповещения, обновления данных в самих компонентах
      if (payload.area == "POSTS") {
        let info_title = "";
        if (payload.parent.type == "user") {
          info_title = "Новый пост в блоге";
        } else if (payload.parent.type == "company") {
          info_title = "Вышла новость по компании";
        } else if (payload.parent.type == "group") {
          info_title = "Новый пост в группе";
        }
        this.$notification["info"]({
          message: info_title,
          description: "Проверьте ленту новостей",
          placement: "topLeft",
        });
      } else if (payload.area == "NEW_GROUP") {
        this.$notification["info"]({
          message: "Создана новая группа",
          description: `«${payload.name}»`,
          placement: "topLeft",
        });
      } else if (payload.area == "GROUP_DELETED") {
        this.$notification["info"]({
          message: "Группа была удалена",
          description: `«${payload.name}»`,
          placement: "topLeft",
        });
      } else if (payload.area === "NEW_EMPL") {
        this.$notification["info"]({
          message: "В компании новый сотрудник",
          description: `<router-link to='/user/${payload.val.id}'>${payload.val.fio}</router-link>`,
          placement: "topLeft",
        });
      } else if (payload.area === "NEW_REQUEST_TO_GROUP") {
        this.$notification["info"]({
          message: "Новая заявка в группу",
          description: ` ${payload.creatorName} подал заявку в группу ${payload.groupName}`,
          placement: "topLeft",
        });
      } else {
        return;
      }

      this.audio.play();
      // if (payload.type === "NEW_GROUP") {
      //   await this.$store.dispatch(GET_MESSAGES);
      //   // вывод оповещения о новом оповещении
      //   this.$notification["info"]({
      //     message: messages[payload.type],
      //     description: `Новое оповещение в ленте`,
      //     placement: "topLeft",
      //   });
      // }
      if (payload.area === "NEW_EMPL") {
        await this.$store.dispatch(GET_MESSAGES);
        // вывод оповещения о новом оповещении
        this.$notification["info"]({
          message: messages[payload.type],
          description: `Новый сотрудник: <router-link to='/user/${payload.val.id}'>${payload.val.fio}</router-link>`,
          placement: "topLeft",
        });
      }
      if (payload.type === "FOR_ALL") {
        this.$notification["info"]({
          message: messages[payload.type],
          description: `ТЕСТОВОЕ СООБЩЕНИЕ НА ВСЕХ СОТРУДНИКОВ`,
          placement: "topLeft",
        });
      }
      // if (payload.type === "UPDATE_FEED") {
      //   this.$notification["info"]({
      //     message: messages[payload.type],
      //     description: payload.area,
      //     placement: "topLeft",
      //   });
      // }
      if (payload.type === "LOGOUT_NOW") {
        //this.$router.push("/logout");
      }
    },
  },
  methods: {
    // datauser() {
    //   // TODO: переделать везде также. Может вообще отдельный геттер сделать с этой проверкой
    //   return this.userData ? this.userData.result : this.user;
    // },
    playSound() {
      //const audio = new Audio("@/assets/sounds/guess-what.mp3");
      this.audio.play();
    },
    pingSocketServer() {
      try {
        this.$socket.client.emit("PING", "HELLOO", (resp) => {
          this.pong.show = true;
          if (resp && resp.msg) {
            this.pong.type = "success";
            this.pong.msg = resp.msg;
          } else {
            this.pong.type = "error";
            this.pong.msg = "Сервер не отвечает";
          }
        });
      } catch (error) {
        console.log("PING error:", error);
      }
    },
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
      this.notifs = this.messages.map((msg) => ({
        title: "Новая группа", // TODO: подстроить под разные типы сообщений
        html: msg.text,
      }));
    },
  },
  created() {
    const user = this.userData.result;
    // Если клиент не определен и пользователь - не суперадмин , то разлогиниваемся
    if (!this.currentClient) {
      if (!user.roles.includes("superadmin")) {
        this.$store.dispatch(ENTER_CLIENT, user.client_id).then((_) => {
          this.$socket.client.nsp = "/" + user.client_id;
        });
      } else {
        const currentClient = JSON.parse(localStorage.getItem("currentClient"));
        this.$store.commit(SET_CURRENT_CLIENT, currentClient);
        this.$socket.client.nsp = "/" + currentClient.workspace;
      }
      this.$socket.client.connect();
    }
  },
  mounted() {
    this.audio = document.getElementById("audio");
  },
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
      flex-grow: 1;
      display: flex;
      align-items: center;
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