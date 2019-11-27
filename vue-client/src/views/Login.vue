<template>

  <div class="c-login">
    <app-success-register />
    <div class="container">
        <div class="row">
            <div class="col-sm-4 offset-sm-4">
              <form class="u-form" @submit.prevent="handleSubmit">

                <fieldset>
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
                </fieldset>
              </form>
            </div>

        </div>
        <div class="row">
            <app-login-google />
        </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { CHECK_USER_INFO } from '../store/user/actions.type';
import AppLoginGoogle from '../components/common/LoginBarGoogle.vue';
import {
    SUCCESS_REGISTER
} from '@/store/user/mutations.type';
import store from '../store';
import AppSuccessRegister from '../components/notification/SuccessRegister.vue';
export default Vue.extend({
    data () {
        return {
            user: {
                email: '',
                password: '',
            },
            submitted: false,
            error: {
                email: false,
                password: false
            }
        }
    },
    components: {
        AppSuccessRegister,
        AppLoginGoogle
    },
    methods: {
        handleSubmit (e) {
            this.submitted = true;
            this.error.email = false;
            this.error.password = false;
            const { email, password } = this.user;
            if (email && password) {
                this.$store
                    .dispatch(CHECK_USER_INFO, {
                        email:this.user.email,
                        password:this.user.password
                    }).finally(() => {
                        console.log(store.getters.errorLogin);
                        if(!store.getters.errorLogin) {
                            this.$router.push({
                                name: 'about'
                            }, () => {});
                        }
                        else {
                            this.submitted = true;
                            if(store.getters.errorLogin.email) {
                                document.getElementById('email').classList.add('is-invalid');
                                this.error.email = true;
                            }
                            if(store.getters.errorLogin.password) {
                                document.getElementById('password').classList.add('is-invalid');
                                this.error.password = true;
                            }
                        }
                    });

            }
        }
    }
});
</script>

<style lang="scss">
.c-login{
    padding: 50px 0;

    .u-form{
        text-align: left;
    }

    legend{
            font-size: 2em;
            text-align: center;
    }
    .row {
        height: 100%;
        background-color: transparent !important;
        box-shadow: none !important;
    }
}
</style>t>

<style lang="scss">
.c-login{
    padding: 50px 0;

    .u-form{
        text-align: left;
    }

    legend{
            font-size: 2em;
            text-align: center;
    }
}
</style>