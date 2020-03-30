<template>
    <div class="c-forgot-password">
        <div class="container">
            <div class="row">
                <div v-if="forgotInfo && forgotInfo.status == 200" class="col-sm-6 offset-sm-3 ">
                    <a-alert
                            :description="forgotInfo.message"
                            type="success"
                    />
                </div>
                <div v-else-if="forgotInfo && forgotInfo.status == 404" class="col-sm-6 offset-sm-3 ">
                    <a-alert
                            :description="forgotInfo.message"
                            type="error"
                    />
                </div>

                <div class="col-sm-4 offset-sm-4">
                    <form class="u-form" @submit.prevent="handleSubmit">
                        <fieldset>
                            <legend>Забыли пароль</legend>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="text" v-model="user.email" id="email" name="email" class="form-control" :class="{ 'is-invalid': submitted && !user.email }" />
                                <div v-show="submitted && !user.email" class="invalid-feedback">Это поле обязательно</div>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-primary" :disabled="disabled && user.email != ''">Отправить</button>
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
    import { FORGOT_PASSWORD } from '../store/user/actions.type';
    import store from '../store';
    export default Vue.extend({
        name: 'ForgotPassword',
        data() {
            return {
                user: {
                    email: ''
                },
                submitted: false,
                disabled: false,
                error: {
                    email: false
                }
            }
        },
        components: {},
        computed: {
            ...mapGetters(['forgotInfo', 'userData']),
        },
        methods: {
            handleSubmit (e) {

                this.submitted = true;
                const {email} = this.user;
                if (email) {
                    this.disabled = true;
                    this.$store
                        .dispatch(FORGOT_PASSWORD, {
                            email: this.user.email
                        })
                        .catch(e => {
                            console.log(e);
                        }) 
                        .finally((what) => {
                            this.submitted = false;
                            this.disabled = false;
                            if (this.forgotInfo.status !== 404) this.user.email = '';
                        });
                }
            },
        },
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