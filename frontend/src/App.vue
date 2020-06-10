<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800&display=swap&subset=cyrillic,cyrillic-ext,greek,greek-ext,latin-ext,vietnamese");
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,800&display=swap");

*::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
*::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0);
}
*::-webkit-scrollbar-thumb {
  background-color: #a3a0fb;
  border-radius: 3px;
}

* {
  font-family: "Source Sans Pro", sans-serif, serif !important;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
