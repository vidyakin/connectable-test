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
      <a-empty v-if="filterData.length == 0">
        <span slot="description">Ничего не найдено</span>
      </a-empty>
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
                  el.name.toLowerCase().indexOf(text) !== -1
          );
        });

      },
    },
  };
</script>

<style lang="scss">
  .address-header.align-right {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin: 0;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    margin-bottom: 30px;
    -webkit-box-pack: end;
    -ms-flex-pack: end;
    justify-content: flex-end;
    text-align: right;
  }
  .address-header .ant-input {
    background-color: #f0f0f7 !important;
    border-radius: 5rem;
  }
.projects {
  // height: 100%;
  height: 100vmin;
  // background-color: beige; // для видимого теста высоты блока

  &-body {
    margin: 1.5rem 3.125rem 1rem 3.125rem;
    display: flex;
    flex-wrap: wrap;
    // justify-content: center; // TODO: под вопросом надо ли центрировать или так норм
  }
}
</style>