<template>
  <a-drawer
    title="Редактировать пользователя"
    :closable="true"
    @close="onClose"
    destroyOnClose
    :visible="visible"
    wrapClassName="user-edit-drawer"
  >
    <a-form :form="form" class="form user-info" @submit="editUserInfo">
      <div class="form-row">
        <div class="row">
          <div class="col-sm-12">
            <a-form-item>
              <app-input
                label="Имя"
                :disabled="!userIsAdmin"
                placeholder="Имя"
                :defaultValue="currentUser && currentUser.firstName"
                v-decorator="['firstName', {initialValue:currentUser &&  currentUser.firstName,
                rules: [
                { required: true, message: 'Введите имя', }
                ]
              }]"
                class="secondary form-input"
              ></app-input>
            </a-form-item>
          </div>

          <div class="col-sm-12">
            <a-form-item>
              <app-input
                label="Фамилия"
                :disabled="!userIsAdmin"
                placeholder="Фамилия"
                :defaultValue="currentUser && currentUser.lastName"
                v-decorator="['lastName', {initialValue:currentUser &&  currentUser.lastName,
                rules: [
                { required: true, message: 'Введите фамилию', }
                ]
              }]"
                class="secondary form-input"
              ></app-input>
            </a-form-item>
          </div>

          <div class="col-sm-12">
            <a-form-item>
              <app-input
                label="Должность"
                placeholder="Менеджер"
                :defaultValue="currentUser && currentUser.positions.join(',')"
                v-decorator="['positions', {initialValue:currentUser &&  currentUser.positions.join(','),
                rules: [
                { required: false, message: 'Укажите должность', }
                ]
              }]"
                class="secondary form-input"
              ></app-input>
            </a-form-item>
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="row">
          <div class="col-sm-12">
            <a-form-item>
              <app-input
                label="Почта"
                placeholder="example@email.com"
                :disabled="true"
                :defaultValue="currentUser && currentUser.email"
                v-decorator="['email', {initialValue:currentUser &&  currentUser.email,
                rules: [{
                  type: 'email', message: 'Укажите корректный E-mail!',
                }, {
                  required: true, message: 'Укажите E-mail!',
                }]
              }]"
                class="secondary form-input"
              ></app-input>
            </a-form-item>
          </div>

          <div class="col-sm-12">
            <a-form-item>
              <app-input
                label="Номер телефона"
                placeholder="+380хххххxxxx"
                :defaultValue="currentUser && currentUser.phone"
                v-decorator="['phone', {initialValue:currentUser &&  currentUser.phone,
                rules: [{
                  required: false, message: 'Введите номер телефона',
                }]
              }]"
                class="secondary form-input"
              ></app-input>
            </a-form-item>
          </div>
        </div>
      </div>

      <a-form-item class="edit-user-button-wrapper">
        <a-spin :spinning="editButtonSpinning">
          <a-button type="primary" html-type="submit">Сохранить</a-button>
        </a-spin>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script>
import { mapGetters } from "vuex";
import AppInput from "../common/Input";
import { EDIT_USER } from "../../store/user/actions.type";
export default {
  name: "AppUserEditDrawer",
  data() {
    return {
      current: "",
      editButtonSpinning: false
    };
  },
  components: {
    AppInput
  },
  computed: {
    ...mapGetters(["currentUser", "userData", "userIsAdmin"])
  },
  methods: {
    onClose() {
      this.close();
    },
    editUserInfo(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, formFields) => {
        if (!err) {
          this.editButtonSpinning = true;
          this.$store
            .dispatch(EDIT_USER, {
              ...formFields,
              _id: this.currentUser._id,
              positions: formFields.positions.split(",")
            })
            .finally(() => {
              this.editButtonSpinning = false;
              this.onClose();
            });
        }
      });
    }
  },
  props: {
    close: Function,
    visible: Boolean
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  }
};
</script>

<style lang="scss">
.user-info .row {
  height: 100%;
}
.user-edit-drawer {
  .ant-drawer-content-wrapper {
    width: 20rem !important;
    overflow: auto;
    height: 100vh;
    @media (max-width: 500px) {
      width: 100% !important;
    }
  }
  .edit-user-button-wrapper {
    text-align: center;
  }
}
</style>