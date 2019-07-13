<template>
  <div class="company">

  </div>
</template>

<script>
  import Vue from 'vue';
  import AppCommentInput from '../components/common/CommentInput'
  import AppPost from '../components/common/Post'
  import {GET_POSTS} from "../store/post/actions.type";
  import {mapGetters} from "vuex";

  export default Vue.extend({
    name: 'AppAdresses',
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
      }
    },
    beforeMount() {
      this.$store.dispatch(GET_POSTS, {filter: {parent: {type: 'company', id: '0'}}})
    },
    computed: {
      ...mapGetters(['posts']),
    }
  });
</script>

<style lang="scss">

  .company {
    background-color: #f0f0f7;
    height: calc(100vh - 3.125rem);
    overflow: auto;
    &-name {
      font-size: 1.5rem;
      color: #43425d;
      text-align: left;
      margin-left: 3.125rem;
    }

  }

</style>