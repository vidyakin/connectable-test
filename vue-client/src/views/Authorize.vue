<template>

  <div class="authorize-page">
    <div class="tc">
      loading...
    </div>
  </div>
</template>

<script>
import qs from 'query-string';
import { mapState } from 'vuex';
import { LOGIN_WITH_OUTLOOK } from '@/store/user/actions.type';

export default {
  name: 'authorize',
  mounted() {
    const params = qs.parse(window.location.search);
    this.$store.dispatch(LOGIN_WITH_OUTLOOK, { code: params.code });
  },
  methods: {
    login() {
      window.location.href = this.loginURL;
    }
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  }
}
</script>
<style scoped>
  .authorize-page {
    padding: 4rem;
  }
</style>
