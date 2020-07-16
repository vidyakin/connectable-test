<template>
  <div style="display: flex; flex-flow: column">
    <!-- <a-input class="input" placeholder="Сообщение..." v-model="current" @pressEnter="send"> -->
    <a-mentions
      v-model="current"
      @select="onSelect"
      @change="onChange"
      @keypress.enter.prevent="send"
    >
      <div slot="addonAfter" class="comment-input-action">
        <!--<a-icon type="link" @click="handleUpload"></a-icon>-->
      </div>
      <a-mentions-option
        :value="user.firstName+' '+user.lastName"
        :data-id="user._id"
        v-for="user in users.filter(u => !u.deletion_mark)"
        :key="user._id"
      >{{user.firstName}} {{user.lastName}}</a-mentions-option>
    </a-mentions>
    <!-- </a-input> -->
    <a-upload
      class="upload-box"
      :multiple="false"
      :fileList="fileList"
      :before-upload="beforeUpload"
      :remove="handleRemove"
    >
      <a-button type="link">
        <a-icon type="file" />Приложить файл
      </a-button>
    </a-upload>
    <div class="mentions" v-html="mentionsFormat"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AppLoginBar from "./LoginBar";
import { SEND_NEW_POST } from "../../store/post/actions.type";
import { GET_NOTIFICATION } from "../../store/notification/actions.type";

import store from "../../store";
import moment from "moment";

import { Mentions } from "ant-design-vue";
const { getMentions } = Mentions;

export default {
  name: "AppCommentInput",
  components: {
    AppLoginBar
  },
  data() {
    return {
      current: "",
      fileList: [],
      statusEmailSend: false,
      mentionsData: [],
      datauser: store.getters.userData
        ? store.getters.userData
        : store.getters.user
    };
  },
  computed: {
    ...mapGetters([
      "currentClient",
      "showHeaderImage",
      "user",
      "users",
      "currentUser",
      "userData",
      "notification"
    ]),
    mentionsFormat() {
      const f =
        (this.mentionsData.length ? "Упомянутые сотрудники: " : "") +
        this.mentionsData
          .map(
            m => `<a class='user-link' href='/profile/${m.id}'>${m.name}</a>`
          )
          .join(", ");
      return f;
    }
  },
  methods: {
    onSelect(option) {
      const selected_user = this.users.find(
        u => u.firstName + " " + u.lastName == option.value
      );
      this.mentionsData.push({
        id: selected_user._id,
        name: selected_user.firstName + " " + selected_user.lastName
      });
    },
    onChange(val) {
      const mentions = getMentions(val);
      // if (this.mentionsData.length !== mentions.length) {
      //   console.log(`mentions changed: ${mentions}`);
      // }
    },
    removeTags(text) {
      return text.replace(/(<([^>]+)>)/gi, ""); // TODO: implement cleaning of HTML tags to prevent any injects
    },
    send() {
      if (this.current !== "") {
        this.$store
          .dispatch(SEND_NEW_POST, {
            message: this.removeTags(this.current),
            parent: this.parent,
            author: this.datauser.result, // obsolete in future
            author_ref: this.datauser.result._id,
            attachment: [],
            emailSend: this.statusEmailSend,
            formData: this.handleUpload(),
            client_id: this.currentClient.workspace,
            mentions: this.mentionsData.map(m => m.id)
          })
          .then(() => {
            this.current = "";
            this.mentionsData = [];
          });
      }
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
          formData.append("files", file);
        });
        this.fileList = [];
        return formData;
      } else {
        return null;
      }
    }
  },
  beforeCreate() {
    // const userData = store.getters.userData;
    // console.log(`beforeCreate CommentInput: userData=${JSON.stringify(this.userData)}`);
    // if (userData.result != undefined) {
    //   this.$store.dispatch(GET_NOTIFICATION, userData.result._id);
    // }
  },
  beforeMount() {
    // console.log(`mounted CommentInput: userData=${JSON.stringify(this.userData)}`);
    // error if userData has no 'result' ex.: {"user":"672f0479-2248-4f04-aeb5-f8dacb2f2b29","iat":1585168721,"exp":1585255121}
    if (this.userData && this.userData.result != undefined) {
      this.$store.dispatch(GET_NOTIFICATION, this.userData.result._id);
    }
  },
  watch: {
    notification(notification) {
      this.statusEmailSend =
        notification && notification.userId == store.getters.userData.result._id
          ? notification.publications
          : false;
    }
  },
  props: {
    parent: Object
  }
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
.upload-box {
  display: flex;
  flex-flow: row;
  align-items: flex-start;
}
// Поле с названием выбранного файла
.ant-upload-list {
  &-item {
    margin-top: 5px !important;
    &-info {
      padding: 0 30px 0 4px;
    }
  }
}
</style>