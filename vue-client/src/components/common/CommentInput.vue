<template class="comment-input">
  <a-input class="input" placeholder="Сообщение..." v-model="current" @pressEnter="send">
    <div slot="addonAfter" class="comment-input-action">
      <a-icon type="link"></a-icon>
      <a-upload>
        <a-icon type="video-camera"></a-icon>
      </a-upload>
    </div>
  </a-input>
</template>

<script>
  import {mapGetters} from "vuex";
  import AppLoginBar from './LoginBar'
  import {SEND_NEW_POST} from "../../store/post/actions.type";

  export default {
    name: "AppCommentInput",
    components: {
      AppLoginBar,
    },
    data() {
      return {
        current: '',
      }
    },
    computed: {
      ...mapGetters(['showHeaderImage', 'user']),
    },
    methods: {
      send() {
        if (this.current !== '') {
          this.$store.dispatch(SEND_NEW_POST, {
            message: this.current,
            parent: this.parent,
            author: this.user,
            attachment: []
          })
        }
        this.current = '';
      },
    },
    props: {
      parent: Object,
    }
  }
</script>

<style lang="scss">

  .input {
    border-color: white!important;
    border-radius: 0.25rem!important;
    height: 3.125rem!important;
    margin: 1.25rem 3.125rem!important;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04)!important;
    width: calc(100% - 6.25rem) !important;

    .ant-input {
      border-color: white !important;
      height: 3.125rem;

      &:focus {
        border-color: white !important;
        box-shadow: 0 0 0 0 white!important;
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