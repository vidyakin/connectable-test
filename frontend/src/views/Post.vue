<template>
  <div class="page">
    <app-post :post="currentPost" />
  </div>
</template>

<script>
// test: http://localhost:8080/post/5e979343cf7539002af8ba75
import { mapGetters } from "vuex";
import { GET_POST } from "../store/post/actions.type";

import AppPost from "../components/common/Post";

export default {
  components: {
    AppPost
  },
  data() {
    return {
      lalala: null
    };
  },
  computed: {
    ...mapGetters(["currentPost"])
  },
  beforeMount() {
    this.$store.dispatch(GET_POST, this.$route.params._id);
  }
};
</script>

<style>
.page {
  margin: 30px;
}
</style>