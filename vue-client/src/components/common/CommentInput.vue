<template class="comment-input">
  <a-input class="input" placeholder="Сообщение...">
    <div slot="addonAfter" class="comment-input-action">
      <a-icon type="link"></a-icon>
      <a-upload>
        <a-icon type="video-camera"></a-icon>
      </a-upload>
    </div>
  </a-input>
</template>

<script>
  import {SET_SHOW_IMAGE_HEADER} from "../../store/shower/mutations.type";
  import {mapGetters} from "vuex";
  import {LOGIN} from "../../store/user/actions.type";
  import AppLoginBar from './LoginBar'

  export default {
    name: "AppCommentInput",
    components: {
      AppLoginBar,
    },
    data() {
      return {
        current: 1,
      }
    },
    computed: {
      ...mapGetters(['showHeaderImage']),
    },
    methods: {
      closeImage() {
        this.$store.commit(SET_SHOW_IMAGE_HEADER, false)
      },
    },
  }
</script>

<style lang="scss">

  .input {
    border-color: white;
    border-radius: 0.25rem;
    height: 3.125rem;
    margin: 1.25rem 3.125rem;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);
    width: calc(100% - 6.25rem)!important;

    .ant-input {
      border-color: white !important;
      height: 3.125rem;
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