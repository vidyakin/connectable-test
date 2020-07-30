<template>
  <a-drawer
    title="Создать группу"
    :closable="true"
    :width="500"
    @close="onClose"
    destroyOnClose
    :visible="visible"
    wrapClassName="create-group-drawer"
  >
    <a-form :form="form" class="form" @submit="createGroup">
      <div class="form-row">
        <div class="row">
          <div class="col-sm-12">
            <a-form-item>
              <app-input
                placeholder="Название"
                label="Название"
                v-decorator="getDecoratorData('name')"
                class="secondary form-input"
              ></app-input>
            </a-form-item>
          </div>

          <div class="col-sm-12">
            <div class="input-label">Описание</div>
            <a-form-item>
              <a-textarea
                placeholder="Описание"
                v-decorator="getDecoratorData('description')"
                class="secondary form-input"
              ></a-textarea>
            </a-form-item>
          </div>

          <div class="col-sm-12">
            <div class="input-label">Тип</div>
            <a-form-item>
              <a-select @change="groupTypeOnChange" v-decorator="getDecoratorData('type')">
                <a-select-option value="0">Открытая</a-select-option>
                <a-select-option value="1">Закрытая</a-select-option>
                <a-select-option value="2">Приватная</a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </div>
      </div>
      <a-form-item class="create-group-button-wrapper">
        <a-spin :spinning="createButtonSpinning">
          <a-button type="primary" html-type="submit">Создать</a-button>
        </a-spin>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script>
import store from "../../store";
import { mapGetters } from "vuex";

import { CREATE_GROUP } from "@/store/group/actions.type";
import {
  GET_NOTIFICATION,
  CREATE_MESSAGE,
} from "@/store/notification/actions.type";
import { SOCKET_NEW_MESSAGE } from "@/store/notification/mutations.type";

import AppInput from "../common/Input";
//import ATextarea from "ant-design-vue/es/input/TextArea";

export default {
  name: "AppUserEditDrawer",
  data() {
    return {
      current: "",
      createButtonSpinning: false,
      statusEmailSend: false,
      // userinfo: store.getters.userData.result
      //   ? store.getters.userData.result
      //   : store.getters.user.result,
      rules: {
        name: [
          {
            required: true,
            message: "Название не может быть пустым!",
            transform: this.tr,
          },
          {
            max: 50,
            message: "Максимальная длина заголовка - 50 символов",
            transform: this.tr,
          },
        ],
        description: [
          {
            required: true,
            message: "Описание не может быть пустым!",
            transform: this.tr,
          },
          {
            max: 250,
            message: "Максимальная длина описания - 250 символов",
            transform: this.tr,
          },
        ],
        type: [
          {
            required: true,
            message: "Тип группы не может быть пустым!",
          },
        ],
      },
    };
  },
  components: {
    AppInput,
  },
  computed: {
    ...mapGetters([
      "user",
      "userData",
      "notification",
      "currentClient",
      "userIsSuperAdmin",
    ]),
  },
  methods: {
    onClose() {
      this.close();
    },
    tr(v) {
      return v === undefined ? "" : v.trim();
    },
    getDecoratorData(n) {
      const result = [n];
      if (n == "type") result.push({ initialValue: "0" }); // дефолтное значение должно идти перед правилами
      result.push({ rules: this.rules[n] }); // правила проверки данных
      return result;
    },
    createGroup(e) {
      e.preventDefault();
      this.form.validateFields(async (err, formFields) => {
        if (err) {
          console.error(err);
          return;
        }

        // записываем группу в БД и стор
        const { _id: id, email } = this.userData.result;
        const client_id = this.userIsSuperAdmin
          ? this.currentClient.workspace
          : this.userData.result.client_id;
        if (!client_id) {
          this.$error({
            title: "Ошибка проверки клиента",
            content: "Не удалось установить текущего клиента",
            centered: true,
          });
          return;
        }
        this.createButtonSpinning = true;
        const newGroup = {
          ...formFields,
          //type: this.type,
          creatorId: id,
          creator: id, // ref field
          userEmail: email,
          emailSend: this.statusEmailSend,
          client_id,
        };
        const newGroupId = await this.$store.dispatch(CREATE_GROUP, newGroup);
        // объект-модель для сохранения в БД
        const newMsg = this.newMsgForGroup(newGroup, newGroupId);
        // Создаем сообщение в БД и сторе
        const newMsgId = await this.$store.dispatch(CREATE_MESSAGE, newMsg);
        //.finally(() => {
        // посылать если только группа открытая?

        // Посылаем сообщение для всех о появлении нового сообщения
        // с сервера придет бродкастом сообщение "socketMessage" с переданными данными
        this.$socket.client.emit("FOR_ALL", {
          type: "NEW_GROUP",
          // 1 вариант - создавать объект тут, второй - в момент приема этого сообщения в обработчике события "to all"
          // val: {
          //   title: "Новая группа",
          //   userFrom: this.userinfo.firstName + ' ' + this.userinfo.lastName,
          //   text: "создал новую группу",
          //   subj: newGroup.name
          // }
          // 2 вариант - только тип указывает что надо получить сообщения с сервера и сформировать массив сообщений
        });
        this.createButtonSpinning = false;
        this.onClose();
        // });
      });
    },
    /**
     * Формирование объекта Message для передачи в БД
     */
    newMsgForGroup(newGroup, newGroupId) {
      return {
        msgType: "NEW_GROUP", // тип сообщения, для разделения бизнес-логики - "NEW_GROUP","YOU_ADDED_IN_GROUP", ""
        dateCreated: Date.now(), // Дата создания сообщения
        //text: `<b>${this.userinfo.firstName} ${this.userinfo.lastName}</b> создал новую группу <i><a href="#">${newGroup.name}</a></i>`, // текст сообщения
        text: `${this.userData.result.firstName} ${this.userData.result.lastName}`,
        senderId: newGroup.creatorId, // id отправителя
        listenerType: "all", // тип приемников сообщений - все, выборочно или еще как-то
        linkedObjType: "group", // связанный объект - группа, проект, и т.д.
        linkedObjId: newGroupId,
        client_id: newGroup.client_id,
      };
    },
    groupTypeOnChange(e) {
      //this.type = e;
    },
  },
  props: {
    close: Function,
    visible: Boolean,
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
    this.$store.dispatch(GET_NOTIFICATION, store.getters.userData.result._id);
  },

  watch: {
    notification(notification) {
      this.statusEmailSend =
        notification &&
        notification.userId === store.getters.userData.result._id
          ? notification.publications
          : false;
    },
  },
};
</script>

<style lang="scss">
.create-group-drawer {
  .form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .ant-drawer-content-wrapper {
    // width: 25rem !important; // правильнее указывать ширину в свойстве компонента a-drawer
    overflow: auto;
    height: 100vh;

    .ant-drawer-body {
      height: calc(100% - 3.5rem);
    }

    @media (max-width: 500px) {
      width: 100% !important;
    }
  }
  .create-group-button-wrapper {
    margin-top: 0.5rem;
    text-align: center;
  }
}
</style>