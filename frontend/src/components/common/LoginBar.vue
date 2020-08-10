<template>
  <div class="user-bar">
    <div class="user-info" v-if="userData">
      <div style="align-self: center;" class="client-name">
        <div>
          {{getClientInfo()}}
          <span
            class="system-text"
          >Socket {{!$socket.client.connected ? 'not connected' : 'connected: '+$socket.client.nsp}}</span>
        </div>
        <div class="test-panel">
          <a-button size="small" @click="testSocketServer">SEND TO ALL</a-button>
          <a-button size="small" @click="pingSocketServer">PING</a-button>
          <a-alert :message="pong.msg" :type="pong.type" banner v-if="pong.show" />
          <a-spin style="max-height: 20px" v-else />
          <div class="system-text">
            Показывать сообщения в консоли:
            <a-switch size="small" @change="chkd=>{this.showPong = chkd}" />
          </div>
          <div class="system-text">last 'pong': {{lastPong && lastPong.toLocaleTimeString()}}</div>
          <!-- <a-button size="small" @click.prevent="playSound">Beep</a-button> -->
          <audio id="audio" src="@/assets/sounds/guess-what.mp3" />
          <router-link to="/no-such-page">404 here ->></router-link>
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
    <!-- Окно  -->
    <ConnectionInfoModal :connected="connModal.connected" :visible="connModal.visible" />
  </div>
</template>

<script>
import Vue from "vue";
import store from "../../store";
import { mapGetters } from "vuex";

import { LOGOUT } from "@/store/user/actions.type";
import { ENTER_CLIENT } from "@/store/client/actions.type";
import { GET_MESSAGES } from "@/store/notification/actions.type";
import { GET_GROUPS_USER_CAN_READ } from "@/store/group/actions.type";

import { SET_SHOW_IMAGE_HEADER } from "@/store/shower/mutations.type";
import { SET_CURRENT_CLIENT } from "@/store/client/mutations.type";

//import NotificationList from "@/components/Company/NotificationList";

const ConnectionInfoModal = Vue.component("ConnectionInfoModal", {
  name: "ConnectionInfoModal",
  props: ["connected", "visible"],
  render: function (h) {
    const info = this.connected
      ? {
          message: "Соединение восстановлено",
          color: "green",
          icon: "check-circle",
        }
      : {
          message: "Соединение отстутствует",
          color: "salmon",
          icon: "exclamation-circle",
        };
    return (
      <a-modal
        vModel={this.visible}
        title="Соединение с сервером"
        centered={true}
        closable={false}
        maskClosable={false}
        footer={null}
      >
        <div style="display: flex; align-items: center">
          <a-icon
            type={info.icon}
            style={`color: ${info.color}; font-size: 32px; margin-right: 15px`}
          />
          <span style={`font-size: 12pt; color: ${info.color}`}>
            {info.message}!
          </span>
        </div>
      </a-modal>
    );
  },
});

export default {
  name: "AppLoginBar",
  components: {
    ConnectionInfoModal,
  },
  data() {
    return {
      current: 1,
      audio: null,
      showPong: false,
      pong: { show: true, type: "success", msg: "..." },
      connection: null,
      waiter: null,
      lastPong: null,
      connModal: { connected: true, visible: false },
      pingTimer: null,
      checkTimer: null,
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
    };
  },
  computed: {
    ...mapGetters([
      "userData",
      "user",
      "users",
      "currentClient",
      "groups_available",
      "getSocketMessage",
    ]),
    getSocket_nsp() {
      return this.$socket.client.nsp;
    },
    apiURL() {
      return process.env.VUE_APP_API_URL;
    },
    user_id() {
      return this.userData.result._id;
    },
    // isSuperAdmin() {
    //   return this.$can("manage", {
    //     accessEmail: this.userData.result.email,
    //     __type: "Client"
    //   });
    // }
  },
  sockets: {
    // pong() {
    //   this.lastPong = new Date();
    // },
    connect() {
      console.log("socket connected:", this.$socket.client.id);
      this.pong = { show: true, msg: "Connected", type: "success" };
      if (this.connModal.visible && !this.connModal.connected) {
        this.connModal = { connected: true, visible: true };
        this.pong.type = "success";
        setTimeout(() => {
          this.connModal.visible = false;
        }, 2000);
      }
      // this.$notification["info"]({
      //   message: "Соединение восстановлено",
      //   description: `сервер доступен`,
      //   placement: "topLeft",
      // });
      this.audio.play();
    },
    disconnect() {
      this.pong.type = "error";
      this.pong.msg = "Connection lost";
      this.connModal = { visible: true, connected: false };
      console.log("socket disconnected");
      this.$socket.client.connect(`${this.apiURL}`);
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
        let needShow = true; // для отмены показа, если польователь не должен видеть по каким-то критериям
        if (payload.parent.type == "user") {
          info_title = "Новый пост в блоге";
        } else if (payload.parent.type == "company") {
          info_title = "Вышла новость по компании";
        } else if (payload.parent.type == "group") {
          info_title = "Новый пост в группе";
          await this.$store.dispatch(GET_GROUPS_USER_CAN_READ, this.user_id);
          needShow = this.groups_available.some(
            (g) => g._id == payload.parent.id
          );
        }
        if (needShow) {
          this.$notification["info"]({
            message: info_title,
            description: "Проверьте ленту новостей",
            placement: "topLeft",
          });
        }
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
      } else if (payload.area == "NEW_EVENT") {
        this.$notification["info"]({
          message: "Новое событие в календаре",
          description: `проверьте календарь`,
          placement: "topLeft",
        });
      } else if (payload.area == "CHANGED_EVENT") {
        this.$notification["info"]({
          message: "Изменилось событие",
          description: `проверьте календарь`,
          placement: "topLeft",
        });
      } else if (payload.area == "DELETE_EVENT") {
        // добавить в тело список участников и определять есть ли в них текущий пользователь
        this.$notification["info"]({
          message: "Событие удалено",
          description: `проверьте календарь`,
          placement: "topLeft",
        });
      } else if (payload.area == "FORCE_LOGOUT") {
        if (payload.user_id == this.user_id) {
          this.logout();
        }
      } else if (payload.area == "ALL") {
        this.$notification["info"]({
          message: "Тестовое оповещение",
          description: `${payload.msg}`,
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
      // if (payload.type === "UPDATE_FEED") {
      //   this.$notification["info"]({
      //     message: messages[payload.type],
      //     description: payload.area,
      //     placement: "topLeft",
      //   });
      // }
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
      // функция показа ответа
      const showPong = (type = "success", msg = "PONG") => {
        this.pong = { type, msg, show: true };
      };
      // очищаем если запущен таймер
      clearTimeout(this.waiter);
      // скрываем ответ
      this.pong.show = false;
      // запускаем таймер для проверки ответа
      this.waiter = setTimeout(() => {
        if (!this.pong.show) {
          showPong("error", "Сервер не отвечает");
          this.$socket.client.disconnect();
          this.$socket.client.connect(`${this.apiURL}`);
        }
      }, 1500);
      // запускаем само пингование
      try {
        this.$socket.client.emit("PING", "HELLOO", (resp) => {
          if (resp && resp.msg) {
            // если все ОК, показываем ответ и убираем таймер
            showPong("success", resp.msg);
            clearTimeout(this.waiter);
          } else {
            // нет ответа
            showPong("error", "Нет ответа");
          }
        });
      } catch (error) {
        console.log("PING error:", error);
      }
    },
    testSocketServer() {
      this.$socket.client.emit(
        "FOR_ALL",
        {
          area: "ALL",
          msg: "Тестовое оповещение на всех сотрудников",
        },
        (resp) => {
          console.log(`Server responsed on FOR_ALL: ${resp.msg}`);
        }
      );
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
  async created() {
    console.log("LoginBar created!");

    // определяем неймспейс
    const user = this.userData.result;
    let nsp = "/";
    // Если клиент не определен и пользователь - не суперадмин , то разлогиниваемся
    if (!this.currentClient) {
      if (!user.roles.includes("superadmin")) {
        await this.$store.dispatch(ENTER_CLIENT, user.client_id);
        nsp = "/" + user.client_id;
      } else {
        const currentClient = JSON.parse(localStorage.getItem("currentClient"));
        if (currentClient) {
          this.$store.commit(SET_CURRENT_CLIENT, currentClient);
          nsp = "/" + currentClient.workspace;
        }
      }
    } else {
      nsp = "/" + this.currentClient.workspace;
    }
    console.log(`nsp ${nsp}`);

    // this.connection = new WebSocket("ws://localhost:8080");
    // this.connection.onmessage = function (event) {
    //   console.log(event);
    // };
    // this.connection.onopen = function (event) {
    //   console.log(event);
    //   console.log("Successfully connected to the echo websocket server...");
    // };
  },
  async mounted() {
    // this.$socket.client.on("socketMessage", (payload) => {
    //   console.log(`socket send somthing`);
    // });
    console.log("LoginBar mounted");
    this.audio = document.getElementById("audio");

    console.log(`LoginBar mounted and socket has connected to ${this.apiURL}`);
    // if (!this.$socket.client.connected) {
    //   this.$error({
    //     message: "Соединение с сервером не установлено",
    //     description: `попробуйте обновить страницу`,
    //     placement: "bottomLeft",
    //   });
    // } else {
    //   this.pong = { type: "success", msg: "Connected", show: true };
    // }
  },
  watch: {
    currentClient(val) {
      if (!val) return;

      this.$socket.client.nsp = "/" + val.workspace;
      this.$socket.client.connect(`${this.apiURL}`);

      this.lastPong = new Date();
      // запускаем свой пингер
      this.pingTimer = setInterval(() => {
        this.$socket.client.emit("PING", { beat: 1 }, (resp) => {
          this.lastPong = new Date();
          if (this.showPong) {
            console.log(`pong! ${this.lastPong.toLocaleString()}`);
          }
        });
      }, 2000);

      // таймер для отслеживания последнего отклика от сервера
      this.checkTimer = setInterval(() => {
        const now = new Date();
        const diff = now - this.lastPong;
        this.pong.msg = `last pong: ${diff}ms`;
        if (this.showPong) {
          console.log(
            `Server connection checker ${new Date().toLocaleTimeString()}, diff is ${diff}ms`
          );
        }
        if (diff >= 5000) {
          this.pong.type = "error";
          this.connModal = { connected: false, visible: true };
          //this.pingSocketServer();
          this.$socket.client.disconnect();
          this.$socket.client.connect(`${this.apiURL}`);
          if (this.showPong) {
            console.log(`Соединение ${this.apiURL} должно перезапуститься...`);
          }
        }
      }, 5000);
    },
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

.test-panel {
  display: flex;
  align-items: center;
  margin-left: 50px;
  & > div,
  button {
    margin-right: 10px;
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
      .system-text {
        font-size: 10pt;
        font-weight: normal;
      }
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