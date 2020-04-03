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
import {GET_NOTIFICATION} from '../../store/notification/actions.type';
import store from '../../store';
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
      this.form.validateFields((err, formFields) => {
        if (!err) {
          this.createButtonSpinning = true;
          this.$store
            .dispatch(CREATE_GROUP, {
              ...formFields,
              type: this.type,
              creatorId: this.userinfo._id,
              userEmail: this.userinfo.email,
              emailSend: this.statusEmailSend,
            })
            .finally(() => {
              this.createButtonSpinning = false;
              this.onClose();
            });
        }
      });
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