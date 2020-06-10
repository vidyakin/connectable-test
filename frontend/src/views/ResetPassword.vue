<template>
    <div class="c-forgot-password">
        <div class="container">
            <div class="row">
                <div v-if="resetInfo && resetInfo.status === 200" class="col-sm-6 offset-sm-3 ">
                    <a-alert
                            :description="resetInfo.message"
                            type="success"
                    />
                    Перейти на страницу <router-link to="/login" class="btn btn-link">входа</router-link>
                </div>
                <div v-else-if="resetInfo && resetInfo.status != 200" class="col-sm-6 offset-sm-3 ">
                    <a-alert
                            :description="resetInfo.message"
                            type="error"
                    />
                </div>
                <div class="col-sm-4 offset-sm-4" v-if="!resetInfo || resetInfo.status != 200">
                    <form class="u-form" @submit.prevent="handleSubmit">
                        <fieldset>
                            <legend>Сброс пароля </legend>
                            <div class="form-group">
                                <label for="newPassword">Пароль</label>
                                <input type="password" v-model="user.newPassword" name="newPassword" class="form-control" :class="{ 'is-invalid': submitted && !user.newPassword }" />
                                <div v-show="submitted && !user.newPassword" class="invalid-feedback">Это поле обязательно</div>
                            </div>
                            <div class="form-group">
                                <label for="verifyPassword">Подтвердите Пароль</label>
                                <input type="password" v-model="user.verifyPassword" name="verifyPassword" class="form-control" :class="{ 'is-invalid': submitted && !user.verifyPassword }" />
                                <div v-show="submitted && !user.verifyPassword" class="invalid-feedback">Это поле обязательно</div>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-primary" :disabled="disabled && user.verifyPassword != '' && user.newPassword != ''">Отправить</button>
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
    import store from '../store';
    import { mapGetters } from 'vuex';
    import { RESET_PASSWORD } from '../store/user/actions.type';
    export default Vue.extend({
        name: 'ResetPassword',
        data() {
            return {
                user: {
                    email: '',
                    newPassword: '',
                    verifyPassword: '',
                    token: (this.$route.params && this.$route.params.token ? this.$route.params.token : '')
                },
                submitted: false,
                disabled: false,
            };
        },
        computed: {
            ...mapGetters(['resetInfo', 'userData']),
        },
        components: {},
        methods: {
            handleSubmit(e) {
                this.submitted = true;
                const {newPassword, verifyPassword, token} = this.user;
                if (newPassword && verifyPassword) {
                    this.disabled = true;
                    this.$store
                        .dispatch(RESET_PASSWORD, this.user).finally(() => {
                        this.submitted = false;
                        this.disabled = false;
                        if (this.resetInfo.status === 200) {
                            this.user.newPassword = '';
                            this.user.verifyPassword = '';
                        }
                    });

                }
            }
        },
        // beforeCreate() {
        // },
    });
</script>

<style lang="scss">
    .u-form{
        text-align: center;

        .form-group {
            text-align: left;
        }
    }
</style>