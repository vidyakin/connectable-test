<template>
    <a-drawer
            title="Добавить раздел"
            :closable="true"
            @close="onClose"
            destroyOnClose
            :visible="visible"
            wrapClassName="create-group-drawer"
    >
        <a-form :form="form" class="form" @submit="createDepartment">
            <div class="form-row">
                <div class="row">
                    <div class="col-sm-12">
                        <a-form-item>
                            <app-input
                                    label="Названия"
                                    placeholder="Названия"
                                    v-decorator="['name', {
                rules: [
                { required: true, message: 'Название не может быть пустым!', }
                ]
              }]"
                                    class="secondary form-input"
                            ></app-input>
                        </a-form-item>
                    </div>
                    <div class="col-sm-12">
                        <a-form-item >
                        <div class="label">Родительский раздел</div>
                        <a-select
                                v-decorator="['depVal']"
                                showSearch
                                labelInValue
                                placeholder="Родительский раздел"
                                style="width: 100%"
                                :filterOption="false"
                                @search="searchdep"
                                @change="handleChangeDep"
                                :notFoundContent="'Раздел не найдено'"
                        >
                            <a-select-option v-for="d in departments" :key="d._id" v-if="depLevels.arrayOne.indexOf(d._id) == -1 && depLevels.arrayTwo.indexOf(d._id) == -1 && depLevels.arrayThree.indexOf(d._id) == -1">{{d.name}}</a-select-option>
                        </a-select>
                        </a-form-item>
                    </div>

                    <div class="col-sm-12">
                        <a-form-item>
                            <div class="label">Участники</div>
                            <a-select v-decorator="['members']"
                                    labelInValue
                                    mode="multiple"
                                    placeholder="Выберите пользователей"
                                    style="width: 100%"
                                    :filterOption="false"
                                    @search="search"
                                    @change="handleChange"
                                    :notFoundContent="'Пользователя не найдено'"
                            >
                                <a-select-option v-for="d in data" :key="d._id">{{d.firstName + ' ' + d.lastName}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </div>
                </div>
            </div>
            <a-form-item class="create-group-button-wrapper">
                <a-spin :spinning="createButtonSpinning">
                    <a-button type="primary" html-type="submit" v-if="depLevels.arrayOne.length <= 1 &&  selectVal">Создать {{selectVal}}</a-button>
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
    import { ADD_NEW_DEP, GET_DEP } from '../../store/structure/actions.type';
    export default {
        name: 'AppCreateDepartment',
        data() {
            return {
                current: '',
                createButtonSpinning: false,
                buttonSpinning: false,
                data: [],
                value: [],
                selectVal: '',
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
            ...mapGetters(['user', 'users', 'departments']),
        },
        methods: {
            onClose() {
                this.close();
            },
            createDepartment(e) {
                e.preventDefault();
                this.form.validateFieldsAndScroll((err, formFields) => {
                    if (!err) {
                        this.createButtonSpinning = true;
                        this.$store
                            .dispatch(ADD_NEW_DEP, {
                                ...formFields
                            })
                            .finally(() => {
                                this.createButtonSpinning = false;
                                this.onClose();
                                this.$store.dispatch(GET_DEP);
                            });
                    }
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
            },
            handleChangeDep(value) {
                Object.assign(this, {
                    value,
                    data: [],
                });
                this.selectVal = value;
            },

        },
        props: {
            close: Function,
            visible: Boolean,
        },
        beforeCreate() {
            this.form = this.$form.createForm(this);
        },
        mounted() {
            this.$store.dispatch(GET_USERS);
            this.$store.dispatch(GET_DEP);
        },
        watch: {
            departments(departments) {
                departments.map(e => {
                    if (e.level == 1) {
                        this.depLevels.arrayOne.push(e._id);
                    }
                    if(e.level == 2 && this.depLevels.arrayTwo) {
                        this.depLevels.arrayTwo.push(e._id);
                    }
                    if(e.level == 3) {
                        this.depLevels.arrayThree.push(e._id);
                    }
                });
               /* if(this.depLevels.arrayOne.length > 1) this.depLevels.arrayOne = [];
                if(this.depLevels.arrayTwo.length <= 3) this.depLevels.arrayTwo = [];
                if(this.depLevels.arrayThree.length <= 6) this.depLevels.arrayThree = [];
                console.log(this.depLevels.arrayTwo);*/
            },
        }
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
            width: 20rem !important;
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