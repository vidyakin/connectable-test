<template>
  <div class="c-register">
	  <div class="container">
		  <div class="row">
			  <div class="col-sm-4 offset-sm-4">
					<form class="u-form" @submit.prevent="handleSubmit">
						<fieldset>
							<legend>Регистрация </legend>
						<div class="form-group">
							<label for="firstName">Имя</label>
							<input type="text" v-model="user.firstName" name="firstName" class="form-control" :class="{ 'is-invalid': submitted && !user.firstName }" />
						   <div v-show="submitted && !user.firstName" class="invalid-feedback">Это поле обязательно</div>
						</div>
						<div class="form-group">
							<label for="lastName">Фамилия</label>
							<input type="text" v-model="user.lastName" name="lastName" class="form-control" :class="{ 'is-invalid': submitted && !user.lastName }" />
						   <div v-show="submitted && !user.lastName" class="invalid-feedback">Это поле обязательно</div>
						</div>
					  <div class="form-group">
						  <label for="email">Email</label>
						  <input type="text" v-model="user.email" id="email" name="email" class="form-control" :class="{ 'is-invalid': submitted && !user.email }" />
						   <div v-show="submitted && !user.email" class="invalid-feedback">Это поле обязательно</div>
						  <div v-show="submitted && error && user.email" class="invalid-feedback">Пользователь с этим email уже зарегистрирован</div>
					  </div>
						<div class="form-group">
							<label for="password">Пароль</label>
							<input type="password" v-model="user.password" name="password" class="form-control" :class="{ 'is-invalid': submitted && !user.password }" />
						   <div v-show="submitted && !user.password" class="invalid-feedback">Это поле обязательно</div>
						</div>
						<div class="form-group">
							<button class="btn btn-primary">Регистрация</button>
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
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { INSERT_USER_INFO } from '../store/user/actions.type';
import {GET_NOTIFICATION} from '../store/notification/actions.type';
import store from '../store';
export default Vue.extend({
  data () {
      return {
          user: {
              firstName: '',
              lastName: '',
              email: '',
              password: ''
          },
          submitted: false,
		  error: false,
		  statusEmailSend: false,
      }
  },
	computed: {
		...mapGetters(['notification']),
	},
  methods: {
      handleSubmit(e) {
          this.submitted = true;
		  this.error = false;
          const { firstName, lastName, email, password } = this.user;

          if (firstName && lastName && email && password) {
              this.$store
              .dispatch(INSERT_USER_INFO, {
                firstName:this.user.firstName,
                lastName:this.user.lastName,
                email:this.user.email,
                password:this.user.password,
			  emailSend: this.statusEmailSend
              }).finally(() => {
				  if(!store.getters.errorRegister) {
                      this.$router.push({
                          name: 'about'
                      }, () => {});
				  }
				  else {
					  document.getElementById('email').classList.add('is-invalid');
					  this.submitted = true;
					  this.error = true;
				  }
            });
          }

      }
  },
	beforeCreate() {
		this.$store.dispatch(GET_NOTIFICATION);
	},
	watch: {
		notification(notification) {
			this.statusEmailSend = (notification ? notification.addUser : false);
		}
	},
});
</script>

<style lang="scss">
	.c-register{
      padding: 50px 0;

			.u-form{
			    text-align: left;
			}

			legend{
					font-size: 2.2em;
					text-align: center;
			}
	}
</style>