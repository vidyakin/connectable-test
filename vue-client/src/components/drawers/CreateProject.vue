<template>
  <a-drawer
    title="Создать проект"
    :closable="true"
    @close="onClose"
    destroyOnClose
    :visible="visible"
    wrapClassName="create-group-drawer"
  >
    <a-form :form="form" class="form" @submit="createGroup">
      <div class="form-row">
        <a-form-item>
          <app-input
            label="Названия"
            placeholder="Названия"
            v-decorator="['name', {
            rules: [
            { required: true, message: 'Название не может быть пустым!', }
            ]
          }]"
            class="secondary form-input">
          </app-input>
        </a-form-item>
        <div class="label">Описание</div>
        <a-form-item>
          <a-textarea
            placeholder="Описание"
            v-decorator="['description', {
            rules: [
            { required: true, message: 'Описание не может быть пустым!', }
            ]
          }]"
            class="secondary form-input">
          </a-textarea>
        </a-form-item>
        <div class="label">Участники</div>
        <a-select
          labelInValue
          mode="multiple"
          :value="value"
          placeholder="Select users"
          style="width: 100%"
          :filterOption="false"
          @search="search"
          @change="handleChange"
          :notFoundContent="'Пользователя не найдено'"
        >
          <a-select-option v-for="d in data" :key="d._id">{{d.firstName + ' ' + d.lastName}}</a-select-option>
        </a-select>
      </div>
      <a-form-item class="create-group-button-wrapper">
        <a-spin :spinning="createButtonSpinning">
          <a-button type="primary" html-type="submit">Создать</a-button>
        </a-spin>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script>
  import {mapGetters} from "vuex";
  import AppInput from '../common/Input'
  import {GET_USERS, UPDATE_USER_INFO} from "../../store/user/actions.type";
  import ATextarea from "ant-design-vue/es/input/TextArea";
  import {CREATE_GROUP} from "../../store/group/actions.type";
  import {CREATE_PROJECT, CREATE_PROJECT_PARTICIPANT, GET_PROJECTS} from "../../store/project/actions.type";
  export default {
    name: "AppCreateProject",
    data() {
      return {
        current: '',
        createButtonSpinning: false,
        buttonSpinning: false,
        data: [],
        value: [],
      }
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
      createGroup(e) {
        e.preventDefault();
        this.form.validateFieldsAndScroll((err, formFields) => {
          if (!err) {
            this.createButtonSpinning = true;
            this.$store.dispatch(CREATE_PROJECT, { ...formFields, creatorId: this.user._id})
              .then((data) => {
                Promise.all(this.value.map(userId => {
                  this.$store.dispatch(CREATE_PROJECT_PARTICIPANT, {participantId: userId.key, projectId: data._id})
                }))
              })
              .finally(() => {
                this.createButtonSpinning = false;
                this.onClose();
                this.$store.dispatch(GET_PROJECTS);
              });
          }
        });
      },
      search(text) {
        text = text.toLowerCase();
        this.data = this.users.filter(el => {
          return el.firstName.toLowerCase().indexOf(text) !== -1
            || el.lastName.toLowerCase().indexOf(text) !== -1
            || (el.firstName + ' ' + el.lastName).toLowerCase().indexOf(text) !== -1
            || (el.lastName + ' ' + el.firstName).toLowerCase().indexOf(text) !== -1;
        })
      },
      handleChange(value) {
        Object.assign(this, {
          value,
          data: [],
        })
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
    }
  }
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


      @media(max-width: 500px) {
        width: 100% !important;
      }
    }
    .create-group-button-wrapper {
      margin-top: 0.5rem;
      text-align: center;
    }
  }
</style>