<template>
  <div class="projects">
    <div class="projects-body">
      <app-project v-for="(project, index) in projects" :project="project" :key="index"></app-project>
    </div>
  </div>
</template>
<script>

  import {mapGetters} from 'vuex';
  import AppProject from '../components/common/Project';
  import {GET_PROJECTS} from '../store/project/actions.type';

  export default {
    components: {
      AppProject,
    },
    data() {
      return {
        createVisible: false,
      };
    },
    methods: {
      closeCreate() {
        this.createVisible = false;
      },
      openCreate() {
        this.createVisible = true;
      },
    },
    beforeCreate() {
      this.$store.dispatch(GET_PROJECTS);
    },
    computed: {
      ...mapGetters(['projects']),
    },
  };
</script>

<style lang="scss">
.projects {
  height: 100%;
  &-body {
    margin: 1.5rem 3.125rem 1rem 3.125rem;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>