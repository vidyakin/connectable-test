<template>
  <div class="c-login">
    <app-success-register />

    <a-row>
      <!-- <div class="col-sm-4 offset-sm-4"> -->
      <a-col :span="4" :offset="10">
        <div style="font-size: 2em">Авторизоваться</div>
        <a-form
          :form="form"
          :label-col="{span:6}"
          :wrapper-col="{ span: 16 }"
          class="u-form"
          @submit.prevent="handleSubmit"
        >
          <a-form-item label="Email">
            <a-input
              v-decorator="['email', { rules: [{ required: true, message: 'Это поле обязательно' }] }]"
            />
          </a-form-item>
          <a-form-item label="Пароль">
            <a-input
              v-decorator="['password', { rules: [{ required: true, message: 'Это поле обязательно' }] }]"
            />
          </a-form-item>
          <div class="button-group">
            <a-button type="primary" style="margin-right:20px">Авторизация</a-button>
            <a-button @click="$router.push('register')" type="link">Регистрация</a-button>
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
        </a-form>
      </a-col>
    </a-row>
    <div class="row">
      <app-login-google />

      <div class="login-page">
        <a
          class="f6 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue"
          v-bind:href="outlookUrl"
        >Войти через учетную запись Microsoft</a>
      </div>

      <div class="col-sm-4 offset-sm-4">
        <fieldset>
          <div class="form-group">
            <router-link to="/forgot-password" class="btn btn-link">Забыли пароль?</router-link>
          </div>
        </fieldset>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { CHECK_USER_INFO } from "../store/user/actions.type";
import AppLoginGoogle from "../components/common/LoginBarGoogle.vue";
import AppLoginMicrosoft from "../components/common/LoginBarMicrosoft.vue";
import { SUCCESS_REGISTER } from "@/store/user/mutations.type";
import store from "../store";
import AppSuccessRegister from "../components/notification/SuccessRegister.vue";
export default Vue.extend({
  data() {
    return {
      user: {
        email: "",
        password: ""
      },
      submitted: false,
      error: {
        email: false,
        password: false
      },
      outlookUrl: ""
    };
  },
  components: {
    AppSuccessRegister,
    AppLoginGoogle,
    AppLoginMicrosoft
  },
  methods: {
    handleSubmit(e) {
      this.submitted = true;
      this.error.email = false;
      this.error.password = false;
      const { email, password } = this.user;
      if (email && password) {
        this.$store
          .dispatch(CHECK_USER_INFO, {
            email: this.user.email,
            password: this.user.password
          })
          .finally(() => {
            if (!store.getters.errorLogin) {
              this.$router.push(
                {
                  name: "about"
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
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
    const a = Vue.axios
      .get("/api/outlook/login-url")
      .then(response => {
        this.outlookUrl = response.data.loginUrl;
      })
      .catch(e => {
        console.log(e);
      });
    return a;
  }
});
</script>

<style lang="scss">
.c-login {
  padding: 50px 0;

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
</style>
<style scoped>
.login-page {
  width: 100%;
  height: 10vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>


<style lang="scss">
.c-login {
  padding: 50px 0;

  .u-form {
    text-align: left;
  }

  legend {
    font-size: 2em;
    text-align: center;
  }
}
</style>
