<template>
  <a-modal
    closable
    destroyOnClose
    centered
    cancelText="Отменить"
    okText="Создать"
    @ok="sendEmployeeData"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @cancel="close"
    @create="sendEmployeeData"
  >
    <div slot="title">
      <h3>Новый сотрудник</h3>
    </div>
    <a-form-model ref="emplForm" :model="theform" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col span="12">
          <a-form-model-item prop="name">
            <app-input v-model="theform.name" placeholder="Введите свое имя" label="Имя" />
          </a-form-model-item>
        </a-col>
        <a-col span="12">
          <a-form-model-item prop="surname">
            <app-input
              v-model="theform.surname"
              placeholder="Введите свою фамилию"
              label="Фамилия"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col>
          <a-form-model-item prop="email">
            <app-input v-model="theform.email" placeholder="Введите e-mail" label="E-mail" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col span="12">
          <div class="input-label">Пароль</div>
          <a-form-model-item has-feedback prop="password">
            <a-input-password
              v-model="theform.password"
              placeholder="Введите пароль"
              label="Пароль"
            />
          </a-form-model-item>
        </a-col>
        <a-col span="12">
          <div class="input-label">Подтверждение пароля</div>
          <a-form-model-item
            has-feedback
            prop="passwordRepeat"
            :validate-status="validStatusPwdRepeat"
          >
            <a-input-password
              v-model="theform.passwordRepeat"
              placeholder="Подтверждение пароля"
              label="Подтверждение пароля"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </a-modal>
</template>

<script>
import { GET_USER } from "@/store/user/actions.type";
import AppInput from "../common/Input";

export default {
  components: { AppInput },
  props: {
    visible: Boolean,
    close: Function
  },
  data() {
    return {
      theform: {
        name: "",
        surname: "",
        password: "",
        passwordRepeat: "",
        email: ""
      },
      confirmLoading: false,
      validStatusPwdRepeat: "success",
      rules: {
        name: [
          {
            required: true,
            message: "Необходимо указать имя",
            transform: this.tr,
            trigger: "blur"
          }
        ],
        surname: [
          {
            required: true,
            message: "Необходимо указать фамилию",
            transform: this.tr,
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "Необходимо указать e-mail",
            transform: this.tr,
            trigger: "blur"
          },
          {
            type: "email",
            message: "Укажите корректный e-mail",
            transform: this.tr,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "Укажите пароль",
            transform: this.tr,
            trigger: "blur"
          },
          {
            validator: this.validRepeatPassword,
            message: "Пароли не совпадают",
            trigger: "change"
          }
        ],
        passwordRepeat: [
          {
            validator: this.validRepeatPassword,
            message: "Пароли не совпадают",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    validRepeatPassword(rule, value, callback) {
      if (this.theform.passwordRepeat.trim() != "") {
        if (this.theform.password != this.theform.passwordRepeat) {
          this.validStatusPwdRepeat = "error";
          callback(new Error());
        } else {
          this.validStatusPwdRepeat = "success";
          if (rule.field == "password") {
            this.$refs.emplForm.validateField("passwordRepeat");
          }
          callback();
        }
      } else {
        this.validStatusPwdRepeat = "success";
        callback();
      }
    },
    validRepeat(rule, value, callback) {
      console.log("repeat check");
      validRepeatPassword(rule, value, callback);
    },
    sendEmployeeData() {
      if (this.$refs.emplForm.validate()) {
        this.$emit("create", this.theform);
      } else {
        this.$error({
          title: "Ошибка в данных",
          content: "При проверке данных обнаружены ошибки"
        });
      }
    }
  }
};
</script>

<style>
.pad-item {
  margin-right: 15px;
}
</style>