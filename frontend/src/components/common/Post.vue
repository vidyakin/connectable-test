<template>
  <div class="post-wrapper">
    <div class="post-wrapper-body">
      <!-- ЗАГОЛОВОК -->
      <div class="post-wrapper-header">
        <div class="post-wrapper-header-photo">
          <a-avatar
            :src="(post && post.author.googleImage ? post.author.googleImage : require('../../assets/no_image.png'))"
          ></a-avatar>
        </div>
        <div>
          <div
            class="post-wrapper-header-author"
          >{{ post.author == "system" ? "Системное оповещение" : fullName(post.author) }}</div>
          <div class="post-wrapper-header-time">
            {{ post && getMomentTime(post.created) }}
            <span
              v-if="post && post.edited"
            >Отредактировано</span>
          </div>
        </div>
      </div>
      <!-- СОДЕРЖИМОЕ -->
      <div class="post-wrapper-content">
        <div v-if="post && post.parent.type == 'system.GROUPS.NEW_USER'">
          <router-link :to="'/profile/'+post.parent.user.id">{{post.parent.user.name}}</router-link>&nbsp;добавлен в группу
          <router-link :to="'/group/'+post.parent.group.id">{{post.parent.group.name}}</router-link>
        </div>
        <DynamicLink v-else :text="post.message" :mentions="post.mentions" force-render />
        <img
          :src="post && post.attachment && post.attachment[0].src"
          alt
          height="260"
          v-if="post.attachment[0] && post.attachment[0].type === 'image'"
        />
        <video
          alt
          height="260"
          controls
          v-if="post.attachment[0] && post.attachment[0].type === 'video'"
        >
          <source :src="post && post.attachment && post.attachment[0].src" type="video/mp4" />
        </video>
        <!-- ЛАЙКИ -->
        <div class="post-wrapper-content-likes">
          <div
            class="post-wrapper-content-likes-authors"
            v-if="post.likes && post.likes.length > 0"
          >
            <a-icon type="like"></a-icon>
            {{ firstTwoLikers }}
            <span
              v-if="post.likes.length > 2"
            >и еще {{post.likes && post.likes.length - 2 }}</span>
          </div>
        </div>
      </div>
      <!-- ПАНЕЛЬ КНОПОК -->
      <div class="post-wrapper-footer">
        <span v-if="user_id && post.likes.findIndex(e => e.author._id === user_id) > -1">
          <a-button icon="dislike" @click="dislike(post._id)">Не нравится</a-button>
        </span>
        <a-button icon="like" @click="like(post._id)" v-else>Нравится</a-button>
        <a-button icon="message" @click="commented">Комментировать</a-button>
      </div>
      <!-- Комментарии -->
      <div class="post-wrapper-comments">
        <span
          v-if="post.comments.length > 2 && !allComment"
          class="post-wrapper-comments-open-all"
          @click="seeAllComment"
        >Посмотреть ещё {{post.comments.length - 2}} комментариев</span>
        <span
          v-if="allComment"
          class="post-wrapper-comments-open-all"
          @click="closeAllComment"
        >Скрыть</span>
        <span v-if="!allComment">
          <app-comment
            v-for="comment in post.comments && post.comments.slice(post.comments.length - 2)"
            :comment="comment"
            :key="comment._id"
          ></app-comment>
        </span>
        <span v-else>
          <app-comment v-for="comment in post.comments" :comment="comment" :key="comment._id"></app-comment>
        </span>
      </div>
      <!-- Поле ввода нового комментария -->
      <div class="post-comment-input" v-if="commenting">
        <a-avatar :src="userAvatar"></a-avatar>
        <a-mentions
          v-model="commentContent"
          :prefix="['@',dblQuote]"
          @keypress.enter.prevent="sendComment(post._id)"
          @search="onSearch"
          @select="onSelect"
        >
          <div slot="addonAfter" class="comment-input-action">
            <!--<a-icon type="link" @click="handleUpload"></a-icon>-->
          </div>
          <a-mentions-option
            :value="fullName(user)"
            :data-id="user._id"
            v-for="user in users.filter(u => !u.deletion_mark)"
            :key="user._id"
          >{{fullName(user)}}</a-mentions-option>
        </a-mentions>
        <!-- <a-input
          class="comment-input"
          placeholder="Комментарий..."
          v-model="commentContent"
          @pressEnter="sendComment(post._id)"
        ></a-input>-->
      </div>
    </div>
    <!-- всплывающее меню с действиями -->
    <div>
      <a-popover
        title="Действия с постом"
        v-model="visible"
        trigger="click"
        :container="'post-' + post._id"
        overlayClassName="action-popup-content"
        v-if="post && post.author._id === user_id || userIsAdmin"
      >
        <template slot="content">
          <a-tooltip title="Удалить">
            <a-icon type="delete" @click="deletePost"></a-icon>
          </a-tooltip>
          <a-popover title="Поделиться" trigger="click">
            <template slot="content">
              <social-sharing
                :url="pubUrl+'/post/'+post._id"
                :title="post && post.message"
                :description="post && post.message"
                :quote="post && post.message"
                :twitter-user="fullName(post.author)"
                class="share-popup"
                inline-template
                @open="soc_open"
                @change="soc_change"
                @close="soc_close"
              >
                <div>
                  <network network="facebook">
                    <a-icon type="facebook"></a-icon>
                  </network>
                  <network network="linkedin">
                    <a-icon type="linkedin"></a-icon>
                  </network>
                  <network network="twitter">
                    <a-icon type="twitter"></a-icon>
                  </network>
                </div>
              </social-sharing>
            </template>
            <a-icon type="share-alt" class="open-action-button"></a-icon>
          </a-popover>
          <a-tooltip title="Редактировать">
            <a-icon type="edit" @click="editPost"></a-icon>
          </a-tooltip>
          <a-tooltip title="Открыть">
            <a-icon type="form" @click="$router.push(`/post/${post._id}`)"></a-icon>
          </a-tooltip>
        </template>
        <a-button icon="menu" class="open-action-button" :id="'post-' + post._id"></a-button>
      </a-popover>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import AppLoginBar from "./LoginBar";
import AppComment from "./Comment";
import DynamicLink from "./DynamicLink";

function plural(word, num) {
  const forms = word.split("_");
  return num % 10 === 1 && num % 100 !== 11
    ? forms[0]
    : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
    ? forms[1]
    : forms[2];
}

function relativeTimeWithPlural(number, withoutSuffix, key) {
  const format = {
    ss: withoutSuffix ? "секунда_секунды_секунд" : "секунду_секунды_секунд",
    mm: withoutSuffix ? "минута_минуты_минут" : "минуту_минуты_минут",
    hh: "час_часа_часов",
    dd: "день_дня_дней",
    MM: "месяц_месяца_месяцев",
    yy: "год_года_лет",
  };
  if (key === "m") {
    return withoutSuffix ? "минута" : "минуту";
  } else {
    return number + " " + plural(format[key], +number);
  }
}

import {
  DELETE_POST,
  REPOST,
  SEND_COMMENT,
  SEND_LIKE,
  SEND_NEW_POST,
  DELETE_LIKE,
} from "../../store/post/actions.type";
import moment from "moment";
import {
  SET_EDIT_POST_VISIBLE,
  SET_POST_FOR_EDITING,
} from "../../store/post/mutations.type";
import store from "../../store";
import { GET_POSTS } from "../../store/post/actions.type";
import { PUBLIC_URL } from "../../../config/dev.env";

export default {
  name: "AppPost",
  components: {
    AppLoginBar,
    AppComment,
    DynamicLink,
  },
  data() {
    return {
      current: "",
      mentionsData: [],
      commenting: false,
      visible: false,
      commentContent: "",
      allComment: false,
      currPrefix: "",
      pubUrl: PUBLIC_URL,
      // datauser: store.getters.userData.result
      //   ? store.getters.userData.result
      //   : store.getters.currentUser
    };
  },
  computed: {
    ...mapGetters([
      "showHeaderImage",
      "users",
      "user",
      "currentUser",
      "userData",
      "userIsAdmin",
    ]),
    dblQuote() {
      return '"';
    },
    user_id() {
      return this.userData && this.userData.result._id;
    },
    userAvatar() {
      return this.userData.result.googleImage
        ? this.userData.result.googleImage
        : require("../../assets/no_image.png");
    },
    firstTwoLikers() {
      if (!this.post.likes) return "";
      if (this.post.likes.length == 1) {
        const user = this.post.likes[0].author;
        return user.firstName + " " + user.lastName;
      } else {
        const user0 = this.post.likes[0].author;
        const user1 = this.post.likes[1].author;
        return `${this.fullName(user0)}, ${this.fullName(user1)}`;
      }
    },
  },
  methods: {
    handleScroll() {
      if (this.visible) {
        this.visible = false;
      }
    },
    fullName(user) {
      return user ? user.firstName + " " + user.lastName : undefined;
    },
    commented() {
      this.commenting = true;
    },
    getMomentTime(time) {
      return moment(time).fromNow(true);
    },
    onSearch(val, prefix) {
      this.currPrefix = prefix;
    },
    onSelect(option) {
      const selected_user = this.users.find(
        (u) => u.firstName + " " + u.lastName == option.value
      );
      const name = selected_user.firstName + " " + selected_user.lastName;
      this.mentionsData.push({
        id: selected_user._id,
        name,
      });
      if (this.currPrefix == '"') {
        this.commentContent = this.commentContent.replace(
          '"' + name,
          "@" + name
        );
      }
    },
    like(post_id) {
      // const likes = {
      //   parent: { type: "post", id: postId },
      //   author: this.datauser
      // };
      const like = {
        post_id, // тут всегда код поста, даже если лайк комменту или ответу, чтобы знать где искать
        user_id: this.user_id,
        parent: { type: "post", id: post_id }, // дублируется код поста т.к. лайкаем пост но в общем случае тут разные типы
      };
      this.$store.dispatch(SEND_LIKE, like).then((_) => {
        this.$socket.client.emit("FOR_ALL", {
          area: "LIKE",
          parent: like.parent,
          postParent: this.post.parent,
        });
      });
    },
    dislike(post_id) {
      const like = {
        post_id,
        user_id: this.user_id,
        parent: { type: "post", id: post_id },
      };
      this.$store.dispatch(DELETE_LIKE, like).then((_) => {
        this.$socket.client.emit("FOR_ALL", {
          area: "DISLIKE",
          parent: like.parent,
          postParent: this.post.parent,
        });
      });
      // .finally(() => {
      //   let parentVal = "";
      //   let idUrl = "0";
      //   switch (this.$route.path.split("/")[1]) {
      //     case "group":
      //       parentVal = "group";
      //       idUrl = this.$route.params._id;
      //       break;
      //     case "profile":
      //       parentVal = "user";
      //       idUrl = this.$route.params._id;
      //       break;
      //     case "company":
      //       parentVal = "company";
      //       break;
      //   }
      //   this.$store.dispatch(GET_POSTS, {
      //     filter: {
      //       parent: {
      //         type: parentVal,
      //         id: idUrl
      //       }
      //     }
      //   });
      // });
    },
    sendComment(postId) {
      const comment = {
        parent: { type: "post", id: postId },
        author: this.user_id,
        created: moment(),
        message: this.commentContent,
        mentions: this.mentionsData.map((m) => m.id),
      };
      if (this.commentContent) {
        this.$store.dispatch(SEND_COMMENT, comment).then(() => {
          this.commentContent = "";
          this.mentionsData = [];
        });
        this.$socket.client.emit("FOR_ALL", {
          area: "COMMENT",
          parent: comment.parent,
          postParent: this.post.parent,
        });
      }
    },
    deletePost() {
      const { _id, parent } = this.post;
      this.$store.dispatch(DELETE_POST, _id).then(() => {
        this.$notification["success"]({
          message: "Пост удален",
          placement: "topRight",
        });
        this.visible = false;
        this.$socket.client.emit("FOR_ALL", {
          area: "POST",
          parent,
          action: "deleted",
          post_id: _id,
        });
      });
    },
    editPost() {
      this.$store.commit(SET_POST_FOR_EDITING, this.post);
      this.$store.commit(SET_EDIT_POST_VISIBLE, true);
      this.visible = false;
    },
    seeAllComment() {
      this.allComment = true;
    },
    closeAllComment() {
      this.allComment = false;
    },
    repost() {
      const rePost = { ...this.post };
      delete rePost._id;
      this.$store.dispatch(REPOST, {
        ...rePost,
        likes: [],
        comments: [],
        parent: { type: "user", id: this.user_id },
      });
    },
    soc_open(netwO, url) {
      console.log(`open: ${netwO}, ${url}`);
    },
    soc_change(netwO, url) {
      console.log(`change: ${netwO}, ${url}`);
    },
    soc_close(netwO, url) {
      console.log(`close: ${netwO}, ${url}`);
    },
  },
  beforeMount() {
    moment.locale("ru", {
      relativeTime: {
        future: "через %s",
        past: "%s назад",
        s: "несколько секунд",
        ss: relativeTimeWithPlural,
        m: relativeTimeWithPlural,
        mm: relativeTimeWithPlural,
        h: "%d час",
        hh: relativeTimeWithPlural,
        d: "%d день",
        dd: relativeTimeWithPlural,
        M: "1 месяц",
        MM: relativeTimeWithPlural,
        y: "1 год",
        yy: relativeTimeWithPlural,
      },
    });
    const mainBlock = document.getElementById("profile");
    if (mainBlock) {
      mainBlock.addEventListener("scroll", this.handleScroll);
    }
  },
  props: {
    post: Object,
  },
};
</script>

<style lang="scss">
.post-comment-input {
  margin: 1rem 0 !important;
  display: flex;
  width: 100% !important;

  img {
    height: 2rem !important;
    width: 2rem !important;
  }
}
.share-popup {
  display: flex;
  justify-content: center;
  .anticon {
    font-size: 18px;
  }
  span {
    display: inline-block;
    padding: 0 10px;
    outline: none;
    cursor: pointer;
    svg {
      transition: all 0.3s;
    }
    &:hover svg {
      fill: #40a9ff;
    }
  }
}
.comment-input {
  margin: 0 1rem !important;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04) !important;
  width: calc(100% - 4rem) !important;
  height: 30px;
  background-color: #f5f6fa !important;

  .ant-input {
    border-radius: 60px;
    border-color: white !important;
    height: 3.125rem;

    &:focus {
      border-color: white !important;
      box-shadow: 0 0 0 0 white !important;
    }
  }
}

.post-wrapper {
  display: flex;
  justify-content: space-between;
  border-color: white;
  border-radius: 0.25rem;
  margin: 30px 0;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);
  width: 100% !important;
  background-color: white;
  text-align: left;
  padding: 1.25rem;

  &:last-child {
    margin-bottom: 0;
  }

  &-body {
    width: calc(100% - 1rem);
  }

  &-header {
    display: flex;

    &-author {
      color: #4d565c;
      font-size: 0.8125rem;
      font-weight: bold;
      font-style: normal;
      font-stretch: normal;
      letter-spacing: normal;
    }

    &-time {
      font-size: 0.6875rem;
      color: #808495;
    }

    &-photo {
      margin-right: 0.625rem;
    }
  }

  &-content {
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: normal;
    word-break: break-word;

    &-likes {
      margin-top: 1rem;
    }
  }
  &-content img {
    max-width: 100%;
  }

  &-footer {
    color: #4d565c;
    border-top: 1px solid;
    border-bottom: 1px solid;
    border-color: rgba(0, 0, 0, 0.1);

    .ant-btn {
      background-color: transparent;
      border: 0;
    }
  }
}

.post-wrapper-comments {
  margin-top: 1rem;

  &-open-all {
    &:hover {
      cursor: pointer;
    }
  }
}
.comment-wrapper-content {
  width: 100%;
}
</style>