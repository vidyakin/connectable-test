<template>
  <a-modal
    closable
    destroyOnClose
    centered
    :title="(editMode ? 'Изменение данных' : 'Добавление нового') + ' клиента'"
    cancelText="Отменить"
    :okText="editMode ? 'Сохранить' : 'Создать'"
    @ok="sendClientData"
    width="800px"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @cancel="close"
  >
    <a-form-model ref="clientForm" :model="theform" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col span="12">
          <a-form-model-item prop="name">
            <app-input
              v-model="theform.name"
              placeholder="Введите полное название"
              label="Полное название"
            />
          </a-form-model-item>
        </a-col>
        <a-col span="8">
          <a-form-model-item prop="workspace">
            <app-input
              v-model="theform.workspace"
              placeholder="Введите краткий код"
              label="Код (workspace) клиента"
            />
          </a-form-model-item>
        </a-col>
        <a-col span="4">
          <div class="input-label">Доступ к системе</div>
          <a-form-model-item prop="has_access">
            <a-switch
              :checked="theform.has_access"
              checked-children="Акт."
              un-checked-children="Блок."
              default-checked
              @change="changeAccess"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col span="8">
          <a-form-model-item prop="city">
            <app-input v-model="theform.city" placeholder="Введите город" label="Город" />
          </a-form-model-item>
        </a-col>
        <a-col span="16">
          <a-form-model-item prop="address">
            <app-input v-model="theform.address" placeholder="Введите адрес" label="Адрес" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col span="12">
          <div class="input-label">Телефон</div>
          <a-form-model-item prop="phone">
            <vue-phone-number-input
              ref="phoneInput"
              size="sm"
              v-model="phone_data"
              @input="phoneInput"
              :fetch-country="true"
              :only-countries="['RU','UA','KZ']"
              :translations="{countrySelectorLabel: 'Код страны', 
              phoneNumberLabel: 'Номер телефона',
              example: 'Пример номера:'}"
            />
          </a-form-model-item>
        </a-col>
        <a-col span="12">
          <a-form-model-item prop="director">
            <app-input
              v-model="theform.director"
              placeholder="Введите ФИО директора"
              label="Директор"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col span="24">
          <div class="input-label">Комментарий/заметки</div>
          <a-form-model-item prop="comment">
            <a-textarea
              v-model="theform.comment"
              placeholder="Введите комментарий"
              label="Заметки"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col span="6">
          <div class="input-label">Логотип компании</div>
          <a-form-model-item prop="logo">
            <a-upload
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              :before-upload="beforeUpload"
              @change="handleChange"
            >
              <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </a-form-model-item>
        </a-col>
        <a-col span="12">
          <pre>{{JSON.stringify(theform,null,2)}}</pre>
        </a-col>
      </a-row>
    </a-form-model>
  </a-modal>
</template>

<script>
import { GET_USER } from "@/store/user/actions.type";
import { CREATE_CLIENT, EDIT_CLIENT } from "@/store/client/actions.type";

import AppInput from "../common/Input";
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
import { mapGetters } from "vuex";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function cleanForm() {
  return {
    workspace: "",
    name: "",
    country: "",
    city: "",
    address: "",
    phone: "",
    director: "",
    logo: "",
    has_access: true,
    comment: ""
  };
}

export default {
  name: "ClientEditDialog",
  components: { AppInput, VuePhoneNumberInput },
  props: {
    editMode: Boolean,
    client: Object,
    visible: Boolean
  },
  data() {
    return {
      theform: {},
      phone_data: "",
      loading: false,
      imageUrl: "",
      rules: {
        name: [
          {
            required: true,
            message: "Необходимо указать название компании",
            transform: this.tr,
            trigger: "blur"
          },
          {
            max: 100,
            message: "Название должно быть не более 100 символов",
            transform: this.tr,
            trigger: "blur"
          }
        ],
        workspace: [
          {
            required: true,
            message: "Необходимо указать код клиента",
            transform: this.tr,
            trigger: "blur"
          },
          {
            max: 50,
            message: "Не более 25 символов",
            transform: this.tr,
            trigger: "blur"
          }
        ]
      },
      confirmLoading: false
    };
  },
  computed: {},
  methods: {
    // проверка корректности и отправка данных
    async sendClientData() {
      try {
        const valid = await this.$refs.clientForm.validate();
        // передача в родительский компонент
        // this.$emit("save", this.theform);
        try {
          await this.$store.dispatch(
            this.editMode ? EDIT_CLIENT : CREATE_CLIENT,
            { ...this.theform }
          );
          this.$success({
            centered: true,
            title: "Клиент записан",
            content: `Клиент ${this.theform.name} сохранен`
          });
        } catch (err) {
          this.$error({
            centered: true,
            title: "Ошибка при создании клиента",
            content: err.message
          });
        }
        this.$emit("save", this.theform);
      } catch (error) {
        this.$error({
          centered: true,
          title: "Ошибка в данных",
          content: "При проверке данных обнаружены ошибки"
        });
        //this.$emit("cancel");
      }
    },
    close() {
      this.$emit("cancel");
    },
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl;
          this.loading = false;
        });
      }
    },
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("You can only upload JPG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("Image must smaller than 2MB!");
      }
      return isJpgOrPng && isLt2M;
    },
    changeAccess() {
      this.theform.has_access = !this.theform.has_access;
    },
    tr(v) {
      return v === undefined ? "" : v.trim();
    },
    // Ввод текста в поле телефона, для получения форматированного номера с кодом страны
    phoneInput(v) {
      this.theform.phone = this.$refs.phoneInput.phoneFormatted;
    },
    // хуки жц
    beforeMount() {}
  },
  watch: {
    visible(val, oldVal) {
      if (val) {
        this.theform = this.editMode ? { ...this.client } : cleanForm();
        console.log("dialog was shown");
      }
    }
  }
};
</script>

<style lang="scss">
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload > img {
  max-height: 150px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.country-selector__list {
  max-height: 100px;
  height: 100px;
}
</style>