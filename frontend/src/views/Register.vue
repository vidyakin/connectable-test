<template>
  <div class="c-register">
    <div class="container">
      <div class="row">
        <div class="col-sm-4 offset-sm-4">
          <form class="u-form" @submit.prevent="handleSubmit">
            <fieldset>
              <legend>Регистрация</legend>
              <legend>****</legend>
              <div class="form-group">
                <label for="client_id">Компания (код)</label>
                <input
                  type="text"
                  v-model="user.client_id"
                  name="client_id"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && !user.client_id }"
                />
                <div
                  v-show="submitted && !user.client_id"
                  class="invalid-feedback"
                >Это поле обязательно</div>
              </div>
              <div class="form-group">
                <label for="firstName">Имя</label>
                <input
                  type="text"
                  v-model="user.firstName"
                  name="firstName"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && !user.firstName }"
                />
                <div
                  v-show="submitted && !user.firstName"
                  class="invalid-feedback"
                >Это поле обязательно</div>
              </div>
              <div class="form-group">
                <label for="lastName">Фамилия</label>
                <input
                  type="text"
                  v-model="user.lastName"
                  name="lastName"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && !user.lastName }"
                />
                <div
                  v-show="submitted && !user.lastName"
                  class="invalid-feedback"
                >Это поле обязательно</div>
              </div>
              <div class="form-group">
                <label for="position">Должность</label>
                <input
                  type="text"
                  v-model="user.position"
                  name="position"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && !user.position }"
                />
                <div
                  v-show="submitted && !user.position"
                  class="invalid-feedback"
                >Это поле обязательно</div>
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  v-model="user.email"
                  id="email"
                  name="email"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && !user.email }"
                />
                <div v-show="submitted && !user.email" class="invalid-feedback">Это поле обязательно</div>
                <div
                  v-show="submitted && error && user.email"
                  class="invalid-feedback"
                >Пользователь с этим email уже зарегистрирован</div>
              </div>
              <div class="form-group">
                <label for="password">Пароль</label>
                <input
                  type="password"
                  v-model="user.password"
                  name="password"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && !user.password }"
                />
                <div
                  v-show="submitted && !user.password"
                  class="invalid-feedback"
                >Это поле обязательно</div>
              </div>
              <div class="form-group" style="text-align: center;">
                <button class="btn btn-primary" :disabled="!formIsValid">Регистрация</button>
                <router-link to="/login" class="btn btn-link">Авторизация</router-link>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { INSERT_USER_INFO } from "../store/user/actions.type";
import { GET_NOTIFICATION } from "../store/notification/actions.type";
import store from "../store";
export default Vue.extend({
  data() {
    return {
      user: {
        client_id: "",
        firstName: "",
        lastName: "",
        position: "",
        email: "",
        password: "",
      },
      submitted: false,
      error: false,
      statusEmailSend: false,
    };
  },
  computed: {
    ...mapGetters(["notification", "userData", "errorRegister"]),
    formIsValid() {
      const {
        client_id,
        firstName,
        lastName,
        email,
        password,
        position,
      } = this.user;
      return (
        client_id && firstName && lastName && email && password && position
      );
    },
  },
  methods: {
    handleSubmit(e) {
      this.submitted = true;
      this.error = false;
      const {
        client_id,
        firstName,
        lastName,
        email,
        password,
        position,
      } = this.user;

      if (
        email &&
        !/\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
      ) {
        this.$error({
          title: "Ошибка в адресе почты",
          centered: true,
          content: "Адрес не корректный",
        });
        return;
      }

      if (client_id && firstName && lastName && email && password && position) {
        this.$store
          .dispatch(INSERT_USER_INFO, {
            client_id,
            firstName,
            lastName,
            positions: this.user.position.split(","),
            email,
            password,
            emailSend: this.statusEmailSend,
          })
          .finally(() => {
            if (!this.errorRegister) {
              this.$router.push(
                {
                  name: "company",
                },
                () => {}
              );
            } else {
              //document.getElementById("email").classList.add("is-invalid");
              this.$error({
                title: "Ошибка при регистрации",
                centered: true,
                content: this.errorRegister,
              });
              this.submitted = true;
              this.error = true;
            }
          });
      }
    },
  },
  beforeCreate() {
    //this.$store.dispatch(GET_NOTIFICATION, store.getters.userData.result._id);
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
});
</script>

<style lang="scss">
.c-register {
  padding: 20vh 0;
  min-height: 100vh;

  .u-form {
    text-align: left;
  }

  legend {
    font-size: 2.2em;
    text-align: center;
  }
}
</style>
