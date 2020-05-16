<template>
  <a-modal
    closable
    destroyOnClose
    centered
    cancelText="Отменить"
    okText="Создать"
    :visible="visible"
    @cancel="close"
  >
    <div slot="title">
      <h3>Новый сотрудник</h3>
    </div>
    <a-form-model ref="emplForm" :model="theform" :rules="rules" layout="vertical">
      <a-row>
        <a-col :span="24">
          <a-form-model-item prop="name">
            <a-input v-model="theform.name" placeholder="Название" label="Название" />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    close: Function
  },
  data() {
    return {
      visible: false,
      rules: {
        name: [
          {
            required: true,
            message: "Необходимо указать имя",
            transform: this.tr,
            trigger: "blur"
          }
        ],
        surname: [
          {
            required: true,
            message: "Необходимо указать фамилию",
            transform: this.tr,
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "Необходимо указать e-mail",
            transform: this.tr,
            trigger: "blur"
          },
          {
            type: "email",
            message: "Укажите корректный e-mail",
            transform: this.tr,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "Укажите пароль",
            transform: this.tr,
            trigger: "blur"
          },
          {
            validator: this.validRepeatEmail,
            message: "Пароли не совпадают"
          }
        ],
        passwordRepeat: [
          {
            required: true,
            message: "Нужно указать пароль повторно",
            trigger: "blur"
          },
          {
            validator: this.validRepeatEmail,
            message: "Пароли не совпадают"
          }
        ]
      },
      theform: {
        name: "-",
        surname: "-",
        password: "-",
        email: "-"
      }
    };
  }
};
</script>

<style>
</style>