<template>
  <div class="structure">
    <app-create-project :visible="createVisible" :close="closeCreate"/>
    <div class="structure-header">
      <div class="structure-header-name">
        Структура
      </div>
      <div class="structure-header-search">
        <a-button type="primary" v-if="test">Редактировать</a-button>
        <a-button type="primary" v-else="!test" @click="openCreate">Создать проект</a-button>
      </div>
    </div>
    <a-tabs defaultActiveKey="1" @change="callback">
      <a-tab-pane tab="Структура" key="1">
          <AppDepantaments />
      </a-tab-pane>
      <a-tab-pane tab="Проекты" key="2">
        <app-projects/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>

  import AppCreateProject from '../components/drawers/CreateProject';
  import {mapGetters} from 'vuex';
  import {GET_GROUPS} from '../store/group/actions.type';
  import AppProjects from '../views/Projects';
  import AppDepantaments from '../components/common/Departaments';

  export default {
    components: {
      AppCreateProject,
      AppProjects,
      AppDepantaments,
    },
    data() {
      return {
        createVisible: false,
        test: true,
      };
    },
    methods: {
      callback(key) {
        if (key === '2') {
          this.test = false;
        } else if (key === '1') {
          this.test = true;
        }
      },
      closeCreate() {
        this.createVisible = false;
      },
      openCreate() {
        this.createVisible = true;
      },
    },
    beforeCreate() {
      this.$store.dispatch(GET_GROUPS);
    },
    computed: {
      ...mapGetters(['groups']),
    },
  };
</script>

<style lang="scss">

  .structure {
    height: calc(100vh - 3.125rem);
    overflow: auto;
    background-color: #f0f0f7;
    &-header {
      display: flex;
      margin: 1.5rem 3.125rem 1rem 3.125rem;
      justify-content: space-between;

      &-name {
        height: 31px;
        font-size: 24px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.67;
        letter-spacing: normal;
        text-align: left;
        color: #43425d;
      }
    }

    .ant-tabs {
      background-color: white;
      margin: 1.5rem 3.125rem 1rem 3.125rem;

      .ant-tabs-nav-scroll {
        text-align: left;
      }

    }

  }

</style>