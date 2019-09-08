<template>
  <div class="company">
    <app-comment-input
      v-model="content"
      @pressEnter="sendMessage"
      :parent="{type: 'company', id: '0'}"
    />
    <div class="company-name">Компания</div>
    <app-post v-for="(post, index) in posts" :post="post" :key="index"/>
  </div>
</template>

<script>
import Vue from 'vue';
import AppCommentInput from '../components/common/CommentInput';
import AppPost from '../components/common/Post';
import { GET_POSTS } from '../store/post/actions.type';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'AppCompany',
  data() {
    return {
      content: '',
    };
  },
  components: {
    AppCommentInput,
    AppPost,
  },
  methods: {
    sendMessage() {
      console.log(this.newPostMessage);
    },
  },
  beforeMount() {
    this.$store.dispatch(GET_POSTS, {
      filter: {
        parent: {
          type: 'company',
          id: '0',
        },
      },
    });
  },
  computed: {
    ...mapGetters(['posts']),
  },
});
</script>

<style lang="scss">
.is-hide-img-header{
  .company {
    height: calc(100vh - 50px);
  }
}
.company {
  padding: 30px;
  background-color: #f0f0f7;
  height: calc(100vh - 210px);
  overflow: auto;

  @media (max-width: 767px) {
    padding: 20px 15px;
  }

  &-name {
    font-size: 1.5rem;
    line-height: 32px;
    color: #43425d;
    text-align: left;
    margin-bottom: 30px;
  }
}
</style>