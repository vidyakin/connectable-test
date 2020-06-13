<template>
  <a-modal
    :visible="visible"
    title="Создание нового подразделения"
    okText="Создать"
    cancelText="Отменить"
    @cancel="() => { $emit('cancel') }"
    @ok="() => { $emit('create') }"
  >
    <a-form layout="vertical" :form="form">
      <a-form-item label="Вышестоящее подразделение">
        <span class="ant-form-text bold-text" v-if="dataToShow">{{ dataToShow.dept.text }}</span>
      </a-form-item>
      <a-form-item label="Название">
        <a-input
          v-decorator="[
              'title',
              {
                rules: [{ required: true, message: 'Пожалуйста, введите название отдела', transform: this.tr }],
              }
            ]"
        />
      </a-form-item>
      <a-form-item label="Описание">
        <a-input type="textarea" v-decorator="['description']" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    // обязательно должен передаваться объект с полями id, text
    dataToShow: {
      type: Object,
      validator: function(val) {
        console.log("validate data to show: ", val);
        return val.type !== undefined && val.dept !== undefined;
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "form_in_modal" });
  },
  computed: {
    deptText() {
      return this.dataToShow && this.dataToShow.dept.text;
    }
  },
  methods: {
    tr(v) {
      return v === undefined ? "" : v.trim();
    }
  }
};
</script>

<style>
.bold-text {
  font-weight: bold;
  font-size: 12pt;
}
.ant-form-item {
  margin-bottom: 10px;
}
.ant-form-item-label {
  padding: 0;
  line-height: 1.1;
}
</style>