<template>
  <a-drawer
    title="Создать группу"
    :closable="true"
    @close="onClose"
    destroyOnClose
    :visible="visible"
    wrapClassName="create-group-drawer"
  >
    <a-form :form="form" class="form" @submit="createGroup">
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
            <div class="label">Описание</div>
            <a-form-item>
              <a-textarea
                placeholder="Описание"
                v-decorator="['description', {
                rules: [
                { required: true, message: 'Описание не может быть пустым!', }
                ]
              }]"
                class="secondary form-input"
              ></a-textarea>
            </a-form-item>
          </div>

          <div class="col-sm-12">
            <div class="label">Тип</div>
            <a-select @change="handleChange">
              <a-select-option value="0">Открытая</a-select-option>
              <a-select-option value="1">Закрытая</a-select-option>
              <a-select-option value="2">Приватная</a-select-option>
            </a-select>
          </div>
        </div>
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
import { mapGetters } from 'vuex';
import AppInput from '../common/Input';
import { UPDATE_USER_INFO } from '../../store/user/actions.type';
import ATextarea from 'ant-design-vue/es/input/TextArea';
import { CREATE_GROUP } from '../../store/group/actions.type';
export default {
  name: 'AppUserEditDrawer',
  data() {
    return {
      current: '',
      createButtonSpinning: false,
      type: 1,
    };
  },
  components: {
    ATextarea,
    AppInput,
  },
  computed: {
    ...mapGetters(['user']),
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
          this.$store
            .dispatch(CREATE_GROUP, {
              ...formFields,
              type: this.type,
              creatorId: this.user._id,
            })
            .finally(() => {
              this.createButtonSpinning = false;
              this.onClose();
            });
        }
      });
    },
    handleChange(e) {
      this.type = e;
    },
  },
  props: {
    close: Function,
    visible: Boolean,
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
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
}
</style>