<template>
    <div class="setting">
        <div class="setting-name">Настройки уведомлений</div>

        <a-form :form="form" class="u-form form" @submit="handleSubmit">

            <div class="content-wrap">
                <div class="custom-control custom-checkbox mb-3">
                    <a-form-item class="wrap-field">
                        <a-checkbox v-decorator="['addUser']" :checked="settings.addUser"
                                    @change="onChange" >
                            При добавлении юзера
                        </a-checkbox>
                    </a-form-item>
                </div>
                <div class="custom-control custom-checkbox mb-3">
                    <a-form-item class="wrap-field">
                        <a-checkbox v-decorator="['subscribe']" :checked="settings.subscribe"
                                    @change="onChangeSubscribe" >
                            У пользователей, на которых он подписан
                        </a-checkbox>
                    </a-form-item>
                </div>
                <!-- <div class="custom-control custom-checkbox mb-3">
                   <input type="checkbox" v-model="settings.eventComment" class="custom-control-input" id="eventComment" name="eventComment" value="">
                   <label class="custom-control-label" for="eventComment">во всех публикациях и комментариях, где юзера тегнули через @</label>
                 </div>-->

                <div class="custom-control custom-checkbox mb-3">
                    <a-form-item class="wrap-field">
                        <a-checkbox v-decorator="['publications']"  :checked="settings.publications"
                                    @change="onChangePublications">
                            При публикации в разделе компания, в группах, в которых состоит юзер
                        </a-checkbox>
                    </a-form-item>
                </div>
                <div class="custom-control custom-checkbox mb-3">
                    <a-form-item class="wrap-field">
                        <a-checkbox v-decorator="['eventCalendar']" :checked="settings.eventCalendar"
                                    @change="onChangeCalendar">
                            При добавлении события в Календарь
                        </a-checkbox>
                    </a-form-item>
                </div>
                <div class="custom-control custom-checkbox mb-3">
                    <a-form-item class="form-group">
                        <a-spin :spinning="createButtonSpinning">
                            <a-button type="primary" html-type="submit" class="btn btn-primary">Сохранить</a-button>
                        </a-spin>
                    </a-form-item>
                </div>
            </div>
        </a-form>
    </div>
</template>
<script>
    import Vue from 'vue';
    import { mapGetters } from 'vuex';
    import {PUT_NOTIFICATION, GET_NOTIFICATION} from '../store/notification/actions.type';
    import store from '../store';

    export default Vue.extend({
        data () {
            return {
                settings: {
                    addUser: false,
                    publications: false,
                    eventComment: false,
                    eventCalendar: false,
                    subscribe: false,
                },
                submitted: false,
                error: false,
                createButtonSpinning: false,
            }
        },
        computed: {
            ...mapGetters(['notification']),
        },
        methods: {
            handleSubmit(e) {
                e.preventDefault();
                const { addUser, publications, eventComment, eventCalendar } = this.settings;
                this.form.validateFieldsAndScroll((err, formFields) => {
                    if (!err) {
                        this.createButtonSpinning = true;
                        this.$store
                            .dispatch(PUT_NOTIFICATION, {
                                ...formFields,
                            })
                            .finally(() => {
                                this.createButtonSpinning = false;
                                this.$store.dispatch(GET_NOTIFICATION);
                            });
                    }
                });
            },
            onChange (e) {
                this.settings.addUser = e.target.checked;
                this.addUser = e.target.checked;
            },
            onChangeSubscribe(e) {
                this.settings.subscribe = e.target.checked;
                this.subscribe = e.target.checked;
            },
            onChangeCalendar (e) {
                this.settings.eventCalendar = e.target.checked;
                this.eventCalendar = e.target.checked;
            },
            onChangePublications (e) {
                this.settings.publications = e.target.checked;
                this.publications = e.target.checked;
            },

        },
        beforeCreate() {
            this.form = this.$form.createForm(this);
            this.$store.dispatch(GET_NOTIFICATION);
        },
        watch: {
            notification(notification) {
                console.log(notification);
                this.settings.addUser = (notification ? notification.addUser: false);
                this.settings.publications = (notification ? notification.publications: false);
                this.settings.eventComment = (notification ? notification.eventComment: false);
                this.settings.eventCalendar = (notification ? notification.eventCalendar: false);
                this.settings.subscribe = (notification ? notification.subscribe: false);
            }
        }
    });
</script>
<style lang="scss">
    .is-hide-img-header{
        .setting {
            height: calc(100vh - 50px);
        }
    }
    .wrap-field {
        margin: 0;
    }
    .custom-checkbox {
        margin: 0 !important;
    }
    .setting {
        padding: 30px;
        background-color: #f0f0f7;
        height: calc(100vh - 210px);
        overflow: auto;

        @media (max-width: 767px) {
            padding: 20px 15px;
        }
        &-name {
            font-size: 1.5rem;
            line-height: 32px;
            color: #43425d;
            text-align: left;
            margin-bottom: 30px;
        }
        .row {
            background: none;
        }
        .content-wrap {
            text-align: left;

            ul {
                list-style: none;
                padding: 0 0 0;
            }

        }
    }
    .form-group {
        display: inline-block;
    }

</style>
