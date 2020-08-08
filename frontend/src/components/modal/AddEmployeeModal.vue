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
    <a-form-model
      ref="emplForm"
      :model="theform"
      :rules="rules"
      layout="vertical"
      @validate="validate"
    >
      <a-row :gutter="10">
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
      <a-row :gutter="10">
        <a-col span="14">
          <a-form-model-item prop="email">
            <app-input
              v-model="theform.email"
              placeholder="Введите e-mail"
              label="E-mail"
              autocomplete="off"
            />
          </a-form-model-item>
        </a-col>
        <a-col span="10">
          <a-form-model-item prop="workspace">
            <app-input
              v-model="theform.workspace"
              placeholder="Введите workspace"
              label="Workspace"
              :disabled="ws_disabled"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col span="12">
          <div class="input-label">Пароль</div>
          <a-form-model-item has-feedback prop="password">
            <a-input-password
              v-model="theform.password"
              placeholder="Введите пароль"
              label="Пароль"
              autocomplete="off"
            />
          </a-form-model-item>
        </a-col>
        <a-col span="12">
          <div class="input-label">Подтверждение пароля</div>
          <a-form-model-item
            has-feedback
            prop="passwordRepeat"
            :validate-status="validStatusPwdRepeat"
            autocomplete="off"
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
    close: Function,
  },
  data() {
    return {
      theform: {
        workspace: "",
        name: "",
        surname: "",
        password: "",
        passwordRepeat: "",
        email: "",
      },
      ws_disabled: false,
      confirmLoading: false,
      validStatusPwdRepeat: "success",
      rules: {
        name: [
          {
            required: true,
            message: "Необходимо указать имя",
            transform: this.tr,
            trigger: "blur",
          },
        ],
        surname: [
          {
            required: true,
            message: "Необходимо указать фамилию",
            transform: this.tr,
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "Необходимо указать e-mail",
            transform: this.tr,
            trigger: "blur",
          },
          {
            type: "email",
            message: "Укажите корректный e-mail",
            transform: this.tr,
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Укажите пароль",
            transform: this.tr,
            trigger: "blur",
          },
          {
            validator: this.validRepeatPassword,
            message: "Пароли не совпадают",
            trigger: "change",
          },
        ],
        passwordRepeat: [
          {
            validator: this.validRepeatPassword,
            message: "Пароли не совпадают",
            trigger: "change",
          },
        ],
        workspace: [
          {
            max: 20,
            message: "Максимум 20 символов",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    validate(prop) {
      console.log(`form was validated: ${prop}`);
    },
    validRepeatPassword(rule, value, callback) {
      const { password, passwordRepeat } = this.theform;
      if (passwordRepeat.trim() != "") {
        if (password != passwordRepeat) {
          this.validStatusPwdRepeat = "error";
          callback(new Error());
        } else {
          this.validStatusPwdRepeat = "success";
          if (rule.field == "password") {
            this.$refs.emplForm.validateField("passwordRepeat");
          } else {
            this.$refs.emplForm.validateField("password");
          }
          callback();
        }
      } else {
        this.validStatusPwdRepeat = "error";
        callback(new Error());
      }
    },
    validRepeat(rule, value, callback) {
      console.log("repeat check");
      validRepeatPassword(rule, value, callback);
    },
    sendEmployeeData() {
      this.$refs.emplForm.validate((valid) => {
        if (!valid) {
          this.$error({
            centered: true,
            title: "Ошибка в данных",
            content: "При проверке данных обнаружены ошибки",
          });
        } else {
          this.$emit("create", this.theform);
        }
      });
    },
    tr(v) {
      return v === undefined ? "" : v.trim();
    },
  },
  watch: {
    visible(val) {
      if (val) {
        if (this.$store.getters.currentClient) {
          this.theform = {
            workspace: this.$store.getters.currentClient.workspace,
            name: "",
            surname: "",
            password: "",
            passwordRepeat: "",
            email: "",
          };
          this.ws_disabled = true;
        }
      }
    },
  },
  /**
   * Lifecycle hooks
   */
  mounted() {
    //console.log(`AddEmployeeModal is mounted`);
  },
};
</script>

<style>
.pad-item {
  margin-right: 15px;
}
</style>