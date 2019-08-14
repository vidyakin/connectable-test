<template>
  <div class="home">
    <app-navbar />
    <div class="content">
      <app-post-edit-drawer />
      <div class="header">
        <app-header />
      </div>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
// @ is an alias to /src
import AppNavbar from '../components/common/Navbar.vue';
import AppHeader from '../components/common/Header.vue';
import AppPostEditDrawer from '../components/drawers/PostEditDrawer.vue';
import { GET_INFO_ABOUT_USER } from '@/store/user/actions.type';
import moment from 'moment';

export default Vue.extend({
  name: 'home',
  components: {
    AppNavbar,
    AppHeader,
    AppPostEditDrawer,
  },
  methods: {},
  beforeMount() {
    if (localStorage.getItem('token')) {
      this.$store.dispatch(GET_INFO_ABOUT_USER);
    }
    moment.updateLocale('ru', {
      relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: 'несколько секунд',
        ss: '%dсекунд',
        m: 'минуту',
        mm: '%d минут',
        h: '1 час',
        hh: '%dчасов',
        d: 'день',
        dd: `%d дня`,
        M: 'месяц',
        MM: '%d месяцев',
        y: 'год',
        yy: '%dлет',
      },
    });
  },
});
</script>

<style lang="scss">
.open-action-button {
  background-color: transparent !important;
  border: 0 !important;
}

.action-popup-content {
  .anticon {
    margin: 0 1rem !important;
    cursor: pointer !important;
  }
}

.home {
  display: flex;
  justify-content: flex-end;
  height: 100vh;

  .content {
    width: calc(100vw - 12.5rem);

    @media (max-width: 1024px) {
      width: calc(100vw - 4rem);
    }
  }
}
</style>