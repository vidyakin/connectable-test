<template>
  <div class="post-wrapper" >
    <div class="post-wrapper-body">
      <div class="post-wrapper-header">
        <div class="post-wrapper-header-photo">
          <a-avatar :src="(post && post.author.googleImage ? post.author.googleImage : require('../../assets/no_image.png'))"></a-avatar>
        </div>
        <div>
          <div class="post-wrapper-header-author">
            {{ post.author.firstName + ' ' + post.author.lastName }}
          </div>
          <div class="post-wrapper-header-time">
            {{ post && getMomentTime(post.created) }}
            <span v-if="post && post.edited">Отредактировано</span>
          </div>
        </div>
      </div>
      <div class="post-wrapper-content">
        <div>{{ post && post.message }}</div>
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
        <div class="post-wrapper-content-likes">
          <div
            class="post-wrapper-content-likes-authors"
            v-if="post.likes && post.likes.length > 0"
          >
            <a-icon type="like"></a-icon>
            {{ post.likes[0] && post.likes[0].author.firstName + ' ' + post.likes[0].author.lastName}}{{ post.likes[1]
            &&
            ', ' + post.likes[1].author.firstName + ' ' + post.likes[1].author.lastName}}
            <span
              v-if="post.likes.length > 2"
            >и еще {{post.likes && post.likes.length - 2 }}</span>
          </div>
        </div>
      </div>
      <div class="post-wrapper-footer">
        <span v-if="datauser && post.likes.findIndex(e => e.author._id === datauser._id) > -1" >
          <a-button icon="dislike" @click="dislike(post._id)">Не нравится</a-button>
          </span>
        <a-button icon="like" @click="likes(post._id)" v-else>Нравится</a-button>
        <a-button icon="message" @click="commented">Комментировать</a-button>
      </div>
      <div class="post-wrapper-comments">
        <span
          @click="seeAllComment"
          v-if="post.comments.length > 2 && !allComment"
          class="post-wrapper-comments-open-all"
        >Посмотреть ещё {{post.comments.length - 2}} комментариев</span>
        <span
          @click="closeAllComment"
          v-if="allComment"
          class="post-wrapper-comments-open-all"
        >Скрыть</span>
        <app-comment
          v-if="!allComment"
          v-for="comment in post.comments && post.comments.slice(post.comments.length - 2)"
          :comment="comment"
        ></app-comment>
        <app-comment v-if="allComment" v-for="comment in post.comments" :comment="comment"></app-comment>
      </div>
      <div class="post-comment-input" v-if="commenting">
        <a-avatar :src="(this.datauser.googleImage ? this.datauser.googleImage : require('../../assets/no_image.png'))"></a-avatar>
        <a-input
          class="comment-input"
          placeholder="Комментарий..."
          v-model="commentContent"
          @pressEnter="sendComment(post._id)"
        ></a-input>
      </div>
    </div>
    <div>

      <a-popover  title="Действия с постом" v-model="visible" trigger="click" :container="'post-' + post._id" overlayClassName="action-popup-content" v-if="post && post.author._id === datauser._id || $can('read', {'accessEmail': datauser.email, '__type': 'User'})">
        <template slot="content">
          <a-tooltip title="Удалить">
            <a-icon type="delete" @click="deletePost"></a-icon>
          </a-tooltip>
          <a-popover title="Поделиться" trigger="click">
              <template slot="content">
                  <social-sharing :url="pubUrl"
                                  :title="post && post.message"
                                  :description="post && post.message"
                                  :quote="post && post.message"
                                  :twitter-user="post.author.firstName + ' ' + post.author.lastName"
                                  class="share-popup"
                                  inline-template>
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
            <a-button icon="share-alt" class="open-action-button" ></a-button>
          </a-popover>
          <a-tooltip title="Редактировать">
            <a-icon type="edit" @click="editPost"></a-icon>
          </a-tooltip>
        </template>
        <a-button icon="menu" class="open-action-button" :id="'post-' + post._id"></a-button>
      </a-popover>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AppLoginBar from './LoginBar';
import AppComment from './Comment';
import {
  DELETE_POST,
  REPOST,
  SEND_COMMENT,
  SEND_LIKE,
  SEND_NEW_POST,
  DELETE_LIKE,
} from '../../store/post/actions.type';
import moment from 'moment';
import {
  SET_EDIT_POST_VISIBLE,
  SET_POST_FOR_EDITING,
} from '../../store/post/mutations.type';
import store from '../../store';
import { GET_POSTS } from '../../store/post/actions.type';
import  { PUBLIC_URL } from '../../../config/dev.env';
export default {
  name: 'AppPost',
  components: {
    AppLoginBar,
    AppComment,
  },
  data() {
    return {
      current: '',
      commenting: false,
      visible: false,
      commentContent: '',
      allComment: false,
      pubUrl: PUBLIC_URL,
      datauser: (store.getters.userData.result ? store.getters.userData.result : store.getters.currentUser),
    };
  },
  computed: {
    ...mapGetters(['showHeaderImage', 'user', 'currentUser', 'userData']),
  },
  methods: {
    handleScroll () {
      if(this.visible) {
        this.visible = false;
      }
    },
    commented() {
      this.commenting = true;
    },
    getMomentTime(time) {
      return moment(time).fromNow(true);
    },
    likes(postId) {
      const likes = {
        parent: { type: 'post', id: postId },
        author: this.datauser,
      };
      this.$store.dispatch(SEND_LIKE, likes);
    },
    dislike(postId) {
      const likes = {
        parent: { type: 'post', id: postId },
        author: this.datauser,
      };
      this.$store.dispatch(DELETE_LIKE, likes).finally(() => {
        let parentVal = '', idUrl = '0';
        switch (this.$route.path.split('/')[1]) {
          case 'group':
            parentVal = 'group';
            idUrl = this.$route.params._id;
            break;
          case 'profile':
            parentVal = 'user';
            idUrl = this.$route.params._id;
            break;
          case 'company':
            parentVal = 'company';
            break;
        }
        this.$store.dispatch(GET_POSTS, {
          filter: {
            parent: {
              type: parentVal,
              id: idUrl,
            },
          },
        });
      });
    },
    sendComment(postId) {
      const comment = {
        parent: { type: 'post', id: postId },
        author: this.datauser,
        message: this.commentContent,
      };
      if(this.commentContent) {
          this.$store.dispatch(SEND_COMMENT, comment).then(() => {
              this.commentContent = '';
          });
      }
    },
    deletePost() {
      this.$store.dispatch(DELETE_POST, this.post._id).then(() => {

        this.$notification['success']({
          message: 'Пост удален',
          placement: 'topRight'
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
        parent: { type: 'user', id: this.datauser._id },
      });
    },
  },
  beforeMount() {
    document.getElementById('profile').addEventListener('scroll', this.handleScroll);
  },
  props: {
    post: Object,
  },
};
</script>

<style lang="scss">
  .ant-popover-inner-content {
    text-align: center;
  }
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
      transition:all .3s;
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

  &:last-child{
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
</style>