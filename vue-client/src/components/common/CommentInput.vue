<template class="comment-input">
  <a-input class="input" placeholder="Сообщение..." v-model="current" @pressEnter="send">
    <div slot="addonAfter" class="comment-input-action">
      <a-icon type="link" @click="handleUpload"></a-icon>
      <a-upload
        :multiple="false"
        :fileList="fileList"
        :beforeUpload="beforeUpload"
        :handleRemove="handleRemove"
      >
        <a-icon type="video-camera"></a-icon>
      </a-upload>
    </div>
  </a-input>
</template>

<script>
import { mapGetters } from 'vuex';
import AppLoginBar from './LoginBar';
import { SEND_NEW_POST } from '../../store/post/actions.type';
import Vue from 'vue';
import store from '../../store';
export default {
  name: 'AppCommentInput',
  components: {
    AppLoginBar,
  },
  data() {
    return {
      current: '',
      fileList: [],
      datauser: (store.getters.userData ? store.getters.userData : store.getters.user),
    };
  },
  computed: {
    ...mapGetters(['showHeaderImage', 'user', 'currentUser', 'userData']),
  },
  methods: {
    send() {
      if (this.current !== '') {
        this.$store.dispatch(SEND_NEW_POST, {
          message: this.current,
          parent: this.parent,
          author: this.datauser.result,
          attachment: [],
          formData: this.handleUpload(),
        });
      }
      this.current = '';
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [file];
      return false;
    },
    handleUpload() {
      const { fileList } = this;
      if (fileList.length > 0) {
        const formData = new FormData();
        fileList.forEach(file => {
          formData.append('files', file);
        });
        this.fileList = [];
        return formData;
      } else {
        return null;
      }
    },
  },
  props: {
    parent: Object,
  },
};
</script>

<style lang="scss">
.input {
  border-color: white !important;
  border-radius: 25px !important;
  height: 50px !important;
  margin: 0 0 30px !important;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04) !important;
  width: 100% !important;

  .ant-input {
    border-color: white !important;
    height: 3.125rem;

    &:focus {
      border-color: white !important;
      box-shadow: 0 0 0 0 white !important;
    }
  }

  .ant-input-group-addon {
    border-color: white !important;
    background-color: white;
    padding: 0;
  }

  .anticon {
    margin-right: 0.5rem !important;
    cursor: pointer;
  }
}
</style>