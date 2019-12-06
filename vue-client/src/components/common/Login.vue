<template>
  <div>
    <div class="header" v-if="showHeaderImage">
      <div
        src="https://smallbiztrends.com/wp-content/uploads/2018/03/shutterstock_705804559.jpg"
        alt
        class="header-image"
      >
        <a-icon type="close" @click="closeImage" />
      </div>
    </div>
    <a-button @click="login">Login</a-button>
  </div>
</template>

<script>
import { SET_SHOW_IMAGE_HEADER } from '../../store/shower/mutations.type';
import { mapGetters } from 'vuex';

export default {
  name: 'AppLoginGoogle',
  data() {
    return {
      current: 1,
    };
  },
  computed: {
    ...mapGetters(['showHeaderImage']),
  },
  methods: {
    closeImage() {
      this.$store.commit(SET_SHOW_IMAGE_HEADER, false);
    },
    login() {
      this.$gAuth.signIn().then(GoogleUser => {
        // On success do something, refer to:
        // https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergetid

        // GoogleUser.getId() : Get the user's unique ID string.
        // GoogleUser.getBasicProfile() : Get the user's basic profile information.
        // GoogleUser.getAuthResponse() : Get the response object from the user's auth session. access_token and so on
        const isSignIn = this.$gAuth.isAuthorized;
      });
    },
  },
};
</script>

<style lang="scss">
.header {
  &-image {
    width: 100%;
    height: 10rem;
    background-image: url(https://smallbiztrends.com/wp-content/uploads/2018/03/shutterstock_705804559.jpg);
    text-align: right;

    .anticon {
      color: white !important;
      background: #3b86ff;
      border-radius: 20rem;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>