<template>
  <a-drawer
    title="Редактировать пост"
    :closable="true"
    @close="onClose"
    destroyOnClose
    :visible="editPostVisible"
    wrapClassName="create-group-drawer"
  >
    <a-form :form="form" class="form" @submit="editPost">
      <div class="label"></div>
      <a-form-item>
        <a-textarea
          placeholder="Сообщение"
          v-decorator="['message', {
            initialValue:postForEditing && postForEditing.message
          }]"
          class="secondary form-input">
        </a-textarea>
      </a-form-item>
      <img :src="postForEditing && postForEditing.attachment && postForEditing.attachment[0].src" alt="" height="260"
           v-if="postForEditing && postForEditing.attachment[0] && postForEditing.attachment[0].type === 'image' && currentAttachment">
      <video alt="" height="260" controls
             v-if="postForEditing && postForEditing.attachment[0] && postForEditing.attachment[0].type === 'video'  && currentAttachment">
        <source :src="postForEditing && postForEditing.attachment && postForEditing.attachment[0].src" type="video/mp4">
      </video>
      <div style="text-align: center" v-if="postForEditing && postForEditing.attachment[0]  && currentAttachment">
        <a-button type="primary" class="edit-attachment-btn" @click="changeAttachment">Изменить файл</a-button>
      </div>
      <a-upload :multiple="false" :fileList="fileList"
                :beforeUpload="beforeUpload"
                :handleRemove="handleRemove"
                v-if="!currentAttachment"
      >
        Выберите файл
        <a-icon type="video-camera"></a-icon>
      </a-upload>
      <a-form-item class="create-group-button-wrapper">
        <a-spin :spinning="createButtonSpinning">
          <a-button type="primary" html-type="submit">Сохранить</a-button>
        </a-spin>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script>
  import {mapGetters} from "vuex";
  import AppInput from '../common/Input'
  import {UPDATE_USER_INFO} from "../../store/user/actions.type";
  import ATextarea from "ant-design-vue/es/input/TextArea";
  import {CREATE_GROUP, EDIT_GROUP} from "../../store/group/actions.type";
  import {SET_EDIT_POST_VISIBLE} from "../../store/post/mutations.type";
  import {EDIT_POST} from "../../store/post/actions.type";

  export default {
    name: "AppPostEditDrawer",
    data() {
      return {
        current: '',
        createButtonSpinning: false,
        type: 1,
        fileList: [],
        currentAttachment: true,
      }
    },
    components: {
      ATextarea,
      AppInput,
    },
    computed: {
      ...mapGetters(['user', 'postForEditing', 'editPostVisible']),
    },
    methods: {
      changeAttachment() {
        this.currentAttachment = false;
      },
      handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = [];
      },
      beforeUpload(file) {
        this.fileList = [file];
        return false;
      },
      handleUpload() {
        const {fileList} = this;
        if (fileList.length > 0) {
          const formData = new FormData();
          fileList.forEach((file) => {
            formData.append('files', file);
          });
          this.fileList = [];
          return formData;
        } else {
          return null;
        }

      },
      onClose() {
        this.$store.commit(SET_EDIT_POST_VISIBLE, false);
      },
      editPost(e) {
        e.preventDefault();
        this.form.validateFieldsAndScroll((err, formFields) => {
          if (!err) {
            this.createButtonSpinning = true;
            const post = {
              ...this.postForEditing,
              message: formFields.message,
              formData: this.handleUpload(),
              edited: true,
            };
            console.log(post);
            this.$store.dispatch(EDIT_POST, post)
              .finally(() => {
                this.createButtonSpinning = false;
                this.onClose();
              });
          }
        });
      },
      handleChange(e) {
        this.type = e;
      }
    },
    watch: {
      'postForEditing'(val) {
        this.currentAttachment = true;
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this);
    },
  }
</script>

<style lang="scss">
  .edit-attachment-btn {
    width: 50%;
  }

  .create-group-drawer {
    .form {

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