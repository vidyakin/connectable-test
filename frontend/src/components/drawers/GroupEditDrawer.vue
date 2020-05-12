<template>
  <a-drawer
    title="Редактировать группу2"
    :closable="true"
    :width="500"
    @close="onClose"
    destroyOnClose
    :visible="visible"
    wrapClassName="create-group-drawer"
  >
    <a-form-model ref="groupform" :model="form" :rules="rules" class="form" @submit="createGroup">
      <div class="form-row">
        <div class="row">
          <div class="col-sm-12">
            <div class="input-label">Название</div>
            <a-form-model-item ref="name" prop="name">
              <a-input placeholder="Название" v-model="form.name" class="secondary form-input"></a-input>
            </a-form-model-item>
          </div>

          <div class="col-sm-12">
            <div class="input-label">Описание</div>
            <a-form-model-item ref="description" prop="description">
              <a-textarea
                placeholder="Описание"
                v-model="form.description"
                class="secondary form-input"
              ></a-textarea>
            </a-form-model-item>
          </div>

          <div class="col-sm-12">
            <div class="input-label">Тип</div>
            <a-form-model-item ref="type" prop="type">
              <a-select @change="groupTypeOnChange" v-model="form.type">
                <a-select-option :value="0">Открытая</a-select-option>
                <a-select-option :value="1">Закрытая</a-select-option>
                <a-select-option :value="2">Приватная</a-select-option>
              </a-select>
            </a-form-model-item>
          </div>
        </div>
      </div>
      <a-form-item class="create-group-button-wrapper">
        <a-spin :spinning="createButtonSpinning">
          <a-button type="primary" html-type="submit">Сохранить</a-button>
        </a-spin>
      </a-form-item>
    </a-form-model>
  </a-drawer>
</template>

<script>
import { mapGetters } from "vuex";
import { EDIT_GROUP } from "@/store/group/actions.type";

import AppInput from "../common/Input";

export default {
  name: "AppUserEditDrawer",
  data() {
    return {
      current: "",
      createButtonSpinning: false,
      type: 1,
      form: {
        name: "",
        description: "",
        type: -1
      },
      rules: {
        name: [
          {
            required: true,
            message: "Название не может быть пустым!",
            transform: this.tr
          },
          {
            max: 50,
            message: "Максимальная длина заголовка - 50 символов",
            transform: this.tr
          }
        ],
        description: [
          {
            required: true,
            message: "Описание не может быть пустым!",
            transform: this.tr
          },
          {
            max: 250,
            message: "Максимальная длина описания - 250 символов",
            transform: this.tr
          }
        ],
        type: [
          {
            required: true,
            message: "Тип группы не может быть пустым!"
          }
        ]
      }
    };
  },
  components: {
    AppInput
  },
  computed: {
    ...mapGetters(["user", "currentGroup"])
  },
  methods: {
    onClose() {
      this.close();
    },
    tr(v) {
      return v === undefined ? "" : v.trim();
    },

    async createGroup(e) {
      e.preventDefault();
      try {
        const v = await this.$refs.groupform.validate();
        if (!v) {
          this.$notification.error({
            message: "Ошибка в данных",
            description: "Некоторые поля заполнены некорректно"
          });
          return;
        }
      } catch (e) {
        this.$notification.error({
          message: "Ошибка при валидации",
          description: "Произошла ошибка: " + e.message
        });
        return;
      }

      this.createButtonSpinning = true;
      await this.$store.dispatch(EDIT_GROUP, {
        ...this.form,
        _id: this.currentGroup._id
      });
      this.createButtonSpinning = false;
      this.onClose();
    },
    groupTypeOnChange(e) {
      //this.type = e;
    }
  },
  props: {
    close: Function,
    visible: Boolean
  },
  beforeCreate() {
    //this.form = this.$form.createForm(this);
  },
  beforeMount() {
    if (this.form.type == -1) {
      this.form = { ...this.currentGroup };
    }
    console.log(`before mount`);
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
}
</style>