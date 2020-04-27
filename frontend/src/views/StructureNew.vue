<template>
  <div class="structure">
    <div class="structure-header">
      <div class="structure-header-name">Структура организации {{userIsAdmin ? "(админ.)" : ""}}</div>
      <div class="structure-header-search" v-if="canEdit">
        <div class="structure-header-deptName">{{ currentDept.text || '' }}</div>
        <a-button type="primary" v-if="test" @click="addDepartment">Добавить раздел</a-button>
        <a-button type="primary" v-else @click="openCreate">Создать проект</a-button>
      </div>
    </div>
    <a-tabs :animated="false" :tabBarGutter="10">
      <a-tab-pane tab="Отделы" key="1">
        <Departments ref="structure" @changeCurrDept="setCurrentDept($event)" />
      </a-tab-pane>
      <a-tab-pane tab="Проекты" key="2" />
    </a-tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import Departments from "../components/structure/Departments";

export default {
  name: "AppStructureNew",
  components: {
    Departments
  },
  data() {
    return {
      canEdit: true,
      test: true,
      currentDept: {}
    };
  },
  computed: {
    ...mapGetters(["users", "userData", "user"]),
    userIsAdmin() {
      return this.$can("read", {
        accessEmail: this.datauser().email,
        __type: "Admin"
      });
    }
  },
  methods: {
    datauser() {
      // TODO: переделать везде также. Может вообще отдельный геттер сделать с этой проверкой
      return this.userData ? this.userData.result : this.user;
    },
    addDepartment() {
      this.$refs.structure.handleShow({ type: "new", dept: this.currentDept });
    },
    editDepartment() {
      this.$refs.structure.handleShow({ type: "edit", dept: this.currentDept });
    },
    /**
     * @param deptInfo Данные о выбранном департаменте, структура { id, text }
     */
    setCurrentDept(deptInfo) {
      this.currentDept = deptInfo;
    }
  }
};
</script>

<style lang="scss">
/* .home {
  width: 1260px;
  margin: 0 auto;
} */
.ant-tabs {
  text-align: left;
}

/* модифицируем стили AntDesign для приближения к макету */
.ant-tabs {
  background-color: white;
  // margin: 30px 0; // появлялась полоса прокрутки

  .ant-tabs-nav-scroll {
    text-align: left;
  }
}

.structure {
  padding: 30px;

  height: calc(100vh - 210px);
  overflow: auto;
  background-color: #f0f0f7;

  @media (max-width: 767px) {
    padding: 20px 15px;
  }

  &-header {
    display: flex;
    margin: 0 0 30px;
    justify-content: space-between;

    @media (max-width: 567px) {
      flex-wrap: wrap;
    }

    &-name {
      font-size: 24px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 32px;
      letter-spacing: normal;
      text-align: left;
      color: #43425d;

      @media (max-width: 567px) {
        flex: 1 0 100%;
        margin-bottom: 15px;
      }
    }

    &-search {
      display: flex;
      align-items: center;
    }
    &-deptName {
      margin-right: 20px;
    }
  }
}
</style>