<template>
    <a-drawer
            title="Редактировать раздел"
            :closable="true"
            @close="onClose"
            destroyOnClose
            :visible="visible"
            wrapClassName="create-group-drawer"
    >
        <a-form :form="form" class="form" @submit="editDepartment">
            <div class="form-row">
                <div class="row">
                    <div class="col-sm-12">
                        <a-form-item>
                            <app-input
                                label="Названия"
                                placeholder="Названия"
                                :defaultValue="curentData.depName" @input="e => inputTitle = e.target.value"
                                :name="'name'"
                                class="secondary form-input"
                            ></app-input>
                        </a-form-item>
                    </div>
                    <div class="col-sm-12">
                        <a-form-item>
                            <div class="label">Участники</div>
                            <a-select
                                  mode="multiple"
                                  showSearch
                                  :defaultValue="curentData.users"
                                  placeholder="Выберите пользователей"
                                  style="width: 100%"
                                  :filterOption="false"
                                  @search="search"
                                  @change="handleChange"
                                  :notFoundContent="'Пользователя не найдено'"
                                  :name="'members'"
                            >
                                <a-select-option v-for="d in users" :key="d._id">{{d.firstName + ' ' + d.lastName}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </div>
                </div>
            </div>
            <a-form-item class="create-group-button-wrapper">
                <a-spin :spinning="createButtonSpinning">
                    <a-button type="primary" html-type="submit" >Редактировать</a-button>
                </a-spin>
            </a-form-item>
        </a-form>
    </a-drawer>
</template>

<script>
    import { mapGetters } from 'vuex';
    import AppInput from '../common/Input';
    import { GET_USERS, UPDATE_USER_INFO } from '../../store/user/actions.type';
    import ATextarea from 'ant-design-vue/es/input/TextArea';
    import { ADD_NEW_DEP, GET_DEP, UPDATE_DEP } from '../../store/structure/actions.type';

    export default {
        name: 'AppCreateDepartment',
        data() {
            return {
                current: '',
                createButtonSpinning: false,
                buttonSpinning: false,
                data: [],
                value: [],
                selectMembers: '',
                inputTitle: '',
                depLevels: {
                    arrayOne: [],
                    arrayTwo: [],
                    arrayThree: []
                },
            };
        },
        components: {
            ATextarea,
            AppInput,
        },
        computed: {
            ...mapGetters(['user', 'users']),
        },
        methods: {
            onClose() {
                this.close();
            },

            editDepartment(e) {
                e.preventDefault();
                const arrUsers = [];
                const name = this.inputTitle ? this.inputTitle : this.curentData.depName,
                      _id = this.curentData.id;
                const members = this.selectMembers ? this.selectMembers : this.curentData.users;
                for (let [key, value] of Object.entries(members)) {
                    arrUsers[key] = {'key': value};
                }
                const users = arrUsers;

                this.createButtonSpinning = true;
                this.$store
                    .dispatch(UPDATE_DEP, {
                        name, _id, users
                })
                .finally(() => {
                    this.createButtonSpinning = false;
                    this.onClose();
                    this.$store.dispatch(GET_DEP);
                    this.selectVal = '';
                });

            },
            search(text) {
                text = text.toLowerCase();
                this.data = this.users.filter(el => {
                    return (
                        el.firstName.toLowerCase().indexOf(text) !== -1 ||
                        el.lastName.toLowerCase().indexOf(text) !== -1 ||
                        (el.firstName + ' ' + el.lastName).toLowerCase().indexOf(text) !==
                        -1 ||
                        (el.lastName + ' ' + el.firstName).toLowerCase().indexOf(text) !== -1
                    );
                });
            },
            searchdep(text) {
                text = text.toLowerCase();
                this.data = this.departments.filter(el => {

                    return (
                        el.name.toLowerCase().indexOf(text) !== -1
                    );
                });
            },
            handleChange(value) {
                Object.assign(this, {
                    value,
                    data: [],
                });
                this.selectMembers = value;
            },
            handleChangeDep(value) {
                Object.assign(this, {
                    value,
                    data: [],
                });

            },

        },
        props: {
            close: Function,
            visible: Boolean,
            curentData: Object,
        },
        beforeCreate() {
            this.form = this.$form.createForm(this);
            this.$store.dispatch(GET_DEP);
        },
        mounted() {
            this.$store.dispatch(GET_USERS);
            this.$store.dispatch(GET_DEP);
        },

    };
</script>

<style lang="scss">
    .create-group-drawer {
        .form {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
        }

        .ant-drawer-content-wrapper {
            // width: 20rem !important;
            overflow: auto;
            height: 100vh;

            .ant-drawer-body {
                height: calc(100% - 3.5rem);
            }

            @media (max-width: 500px) {
                width: 100% !important;
            }
        }
        .create-group-button-wrapper {
            margin-top: 0.5rem;
            text-align: center;
        }
        .form-row .row {
            height: auto;
        }
    }
</style>