<template>

  <div class="projects">
    <div class="address-header align-right">
      <div class="address-header-search">
        <a-input v-model="searchText">
          <a-icon type="search" slot="prefix"></a-icon>
        </a-input>
      </div>
    </div>
    <div class="projects-body">
      <app-project v-for="(project, index) in this.filterData" :project="project" :key="index"></app-project>
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
        filterData: [],
        searchText: '',
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
    beforeMount() {
      this.$store.dispatch(GET_PROJECTS);
    },
    computed: {
      ...mapGetters(['projects']),
    },
    watch: {
      projects(projects) {
        this.filterData = projects;
        this.fullData = [...this.filterData];
      },
      searchText(text) {
        this.filterData = this.fullData.filter(el => {
          return (
                  el.name.indexOf(text) !== -1
          );
        });

      },
    },
  };
</script>

<style lang="scss">
  .address-header.align-right {
    justify-content: flex-end;
  }
.projects {
  height: 100%;
  &-body {
    margin: 1.5rem 3.125rem 1rem 3.125rem;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>