<template>
  <div class="home">
    <app-navbar/>
    <div class="content">
      <div class="header">
        <app-header/>
      </div>
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import AppNavbar from '@/components/common/Navbar'
import AppHeader from '@/components/common/Header'

export default Vue.extend({
  name: 'home',
  components: {
    HelloWorld,
    AppNavbar,
    AppHeader
  },
});
</script>

<style lang="scss">
  .home {
    display: flex;
    justify-content: flex-end;
    height: 100vh;

    .content {
      width: 100%;
    }

  }
</style>