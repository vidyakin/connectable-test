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
                placeholder="Название" label="Название"
                v-decorator="getDecoratorData('name')"
                class="secondary form-input"
              ></app-input>
            </a-form-item>
          </div>

          <div class="col-sm-12">
            <div class="label">Описание</div>
            <a-form-item>
              <a-textarea
                placeholder="Описание"
                v-decorator="getDecoratorData('description')"
                class="secondary form-input"
              ></a-textarea>
            </a-form-item>
          </div>

          <div class="col-sm-12">
            <div class="label">Тип</div>
            <a-select @change="handleChange" defaultValue="0">
              <a-select-option value="0">Открытая</a-select-option>
              <a-select-option value="1">Закрытая</a-select-option>
              <a-select-option value="2">Приватная</a-select-option>
            </a-select>
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
import { mapGetters } from 'vuex';
import AppInput from '../common/Input';
import { UPDATE_USER_INFO } from '../../store/user/actions.type';
import ATextarea from 'ant-design-vue/es/input/TextArea';
import { CREATE_GROUP } from '../../store/group/actions.type';
import { GET_NOTIFICATION, CREATE_MESSAGE } from '../../store/notification/actions.type';
import store from '../../store';
import { SOCKET_NEW_MESSAGE } from '../../store/notification/mutations.type';
export default {
  name: 'AppUserEditDrawer',
  data() {
    return {
      current: '',
      createButtonSpinning: false,
      type: 1,
      statusEmailSend: false,
      userinfo: (store.getters.userData.result ? store.getters.userData.result : store.getters.user.result),
      rules: {
        name: [
          { required: true, message: 'Название не может быть пустым!', transform: this.tr },
          { max:50, message: 'Максимальная длина заголовка - 50 символов', transform: this.tr }
        ],
        description: [
          { required: true, message: 'Описание не может быть пустым!', transform: this.tr },
          { max: 250, message: 'Максимальная длина описания - 250 символов', transform: this.tr }
        ],
        type: [{ required: true, message: 'Тип группы не может быть пустым!'}]
      }
    };
  },
  components: {
    ATextarea,
    AppInput,
  },
  computed: {
    ...mapGetters(['user', 'userData', 'notification']),
  },
  methods: {
    onClose() {
      this.close();
    },
    tr(v) {
      return v === undefined ? '' : v.trim()
    },
    getDecoratorData(n) {
      const result = [ n, { rules: this.rules[n] } ];
      return result;
    },
    createGroup(e) {
      e.preventDefault();
      this.form.validateFields(async (err, formFields) => {
        if (err) { console.error(err); return }

        this.createButtonSpinning = true;
        // записываем группу в БД и стор
        const newGroup = {
          ...formFields,
          type: this.type,
          creatorId: this.userinfo._id,
          userEmail: this.userinfo.email,
          emailSend: this.statusEmailSend,
        }
        const newGroupId = await this.$store.dispatch(CREATE_GROUP, newGroup)
        // объект-модель для сохранения в БД
        const newMsg = this.newMsgForGroup(newGroup, newGroupId)
        // Создаем сообщение в БД и сторе
        const newMsgId = await this.$store.dispatch(CREATE_MESSAGE, newMsg)
          //.finally(() => {
            // посылать если только группа открытая?
          
        // Посылаем сообщение для всех о появлении нового сообщения
        // с сервера придет бродкастом сообщение "socketMessage" с переданными данными
        this.$socket.client.emit('to all', {
          type: 'NEW_GROUP', 
          // 1 вариант - создавать объект тут, второй - в момент приема этого сообщения в обработчике события "to all"
          // val: {
          //   title: "Новая группа",
          //   userFrom: this.userinfo.firstName + ' ' + this.userinfo.lastName,
          //   text: "создал новую группу",
          //   subj: newGroup.name
          // } 
          // 2 вариант - только тип указывает что надо получить сообщения с сервера и сформировать массив сообщений 
        })
        this.createButtonSpinning = false;
        this.onClose();
        // });
      });
    },
    /**
     * Формирование объекта Message для передачи в БД
     */
    newMsgForGroup(newGroup,newGroupId) {
      return {
        msgType: "NEW_GROUP",         // тип сообщения, для разделения бизнес-логики - "NEW_GROUP","YOU_ADDED_IN_GROUP", ""
        dateCreated: Date.now(),      // Дата создания сообщения
        text: `<b>${this.userinfo.firstName} ${this.userinfo.lastName}</b> создал новую группу <i>${newGroup.name}</i>`,   // текст сообщения
        senderId: newGroup.creatorId, // id отправителя
        listenerType: "all",          // тип приемников сообщений - все, выборочно или еще как-то
        linkedObjType: "group", // связанный объект - группа, проект, и т.д.
        linkedObjId: newGroupId
      }
    },
    handleChange(e) {
      this.type = e;
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
      this.statusEmailSend = (notification && notification.userId === store.getters.userData.result._id ? notification.publications : false);
    }
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