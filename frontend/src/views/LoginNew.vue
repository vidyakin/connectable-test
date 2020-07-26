<template>
  <div class="c-login">
    <app-success-register />

    <a-row>
      <!-- <div class="col-sm-4 offset-sm-4"> -->
      <a-col :xs="{ span: 12, offset: 6 }" :lg="{ span: 6, offset: 9 }">
        <div style="font-size: 2em; text-align: center; padding-bottom: 1rem">Авторизоваться</div>
        <a-form-model
          ref="login_form"
          :model="form"
          :rules="rules"
          :label-col="{span:6}"
          :wrapper-col="{ span: 16 }"
          class="u-form"
        >
          <a-form-model-item label="Client" has-feedback prop="workspace">
            <a-input />
          </a-form-model-item>
          <a-form-model-item label="Email" has-feedback prop="email">
            <a-input
              v-decorator="['email', { rules: [{ required: true, message: 'Это поле обязательно' }] }]"
            />
          </a-form-model-item>
          <a-form-model-item label="Пароль" has-feedback prop="password">
            <a-input
              v-decorator="['password', { rules: [{ required: true, message: 'Это поле обязательно' }] }]"
            />
          </a-form-model-item>
          <div class="button-group">
            <a-button type="primary" style="margin-right:20px" @click="handleSubmit">Авторизация</a-button>
            <a-button @click="$router.push('register')" type="link">Регистрация</a-button>
            <a-button @click="testValidate" type="link">TEST</a-button>
          </div>
          <!-- <fieldset>
                    <legend>Авторизоваться</legend>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="text" v-model="user.email" id="email" name="email" class="form-control" :class="{ 'is-invalid': submitted && !user.email }" />
                        <div v-show="submitted && !user.email" class="invalid-feedback">Это поле обязательно</div>
                        <div v-show="submitted && user.email && error.email" class="invalid-feedback">Пользователь с таким email не зарегистрирован</div>
                    </div>
                    <div class="form-group">
                        <label for="password">Пароль</label>
                        <input type="password" v-model="user.password" id="password" name="password" class="form-control" :class="{ 'is-invalid': submitted && !user.password }" />
                        <div v-show="submitted && !user.password" class="invalid-feedback">Это поле обязательно</div>
                        <div v-show="submitted && user.password && error.password" class="invalid-feedback">Пароль неверный</div>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary">Авторизация</button>
                        <router-link to="/register" class="btn btn-link">Регистрация</router-link>
                    </div>
          </fieldset>-->
        </a-form-model>
      </a-col>
    </a-row>
    <a-row class="login-buttons">
      <a-col :xs="{ span: 12, offset: 6 }" :lg="{ span: 6, offset: 9 }">
        <LoginButtonGoogle />
        <app-login-microsoft />

        <div class="col-sm-4 offset-sm-4">
          <fieldset>
            <div class="form-group">
              <router-link to="/forgot-password" class="btn btn-link">Забыли пароль?</router-link>
            </div>
          </fieldset>
        </div>
        <div class="col-sm-4 offset-sm-4">
          <a-alert
            :class="msgStyle"
            :message="msgError"
            :description="fullErrorMsg"
            type="error"
            show-icon
          />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Vue from "vue";
import store from "../store";
import { mapGetters } from "vuex";

import { CHECK_USER_INFO } from "../store/user/actions.type";
import { SUCCESS_REGISTER } from "@/store/user/mutations.type";

import LoginButtonGoogle from "../components/common/LoginButtonGoogle.vue";
import AppLoginMicrosoft from "../components/common/LoginBarMicrosoft.vue";
import AppSuccessRegister from "../components/notification/SuccessRegister.vue";

export default Vue.extend({
  data() {
    return {
      form: {
        workspace: "",
        email: "",
        password: "",
      },
      rules: {
        email: [
          {
            required: true,
            message: "Укажите e-mail для входа",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "Введите пароль", trigger: "blur" },
        ],
      },
      msgStyle: "invisible",
      msgError: "",
      workspaceErrMsg: "Не указан код",
      fullErrorMsg: "",
      user: {
        email: "",
        password: "",
      },
      submitted: true,
      error: {
        workspace: true,
        email: false,
        password: false,
      },
      outlookUrl: "",
    };
  },
  components: {
    AppSuccessRegister,
    LoginButtonGoogle,
    AppLoginMicrosoft,
  },
  computed: {
    ...mapGetters(["errorLogin"]),
  },
  methods: {
    testValidate(e) {
      console.log("vaild?");
      const wp_field = this.$refs.login_form.fields[0];
      wp_field.validateStatus = "error";
      wp_field.validateMessage = "Ошибка в коде клиента";
    },
    handleSubmit(e) {
      this.submitted = true;
      this.error.email = false;
      this.error.password = false;
      const { email, password } = this.user;
      if (email && password) {
        this.$store
          .dispatch(CHECK_USER_INFO, {
            email: this.user.email,
            password: this.user.password,
          })
          .finally(() => {
            if (!store.getters.errorLogin) {
              this.$router.push(
                {
                  name: "about",
                },
                () => {}
              );
            } else {
              this.submitted = true;
              if (store.getters.errorLogin.email) {
                document.getElementById("email").classList.add("is-invalid");
                this.error.email = true;
              }
              if (store.getters.errorLogin.password) {
                document.getElementById("password").classList.add("is-invalid");
                this.error.password = true;
              }
            }
          });
      }
    },
  },
  beforeCreate() {
    const a = Vue.axios
      .get("/api/outlook/login-url")
      .then((response) => {
        this.outlookUrl = response.data.loginUrl;
      })
      .catch((e) => {
        console.log(e);
      });
    return a;
  },
});
</script>

<style lang="scss">
.c-login {
  padding: 25vh 0;
  min-height: 100vh;

  .u-form {
    text-align: left;
  }

  legend {
    font-size: 2em;
    text-align: center;
  }
  .row {
    height: 100%;
    background-color: transparent !important;
    box-shadow: none !important;
  }
}

.button-group {
  display: flex;
  justify-content: center;
}

.login-buttons {
  padding-top: 20px;
}
</style>
