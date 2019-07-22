<template>
  <div class="groups">
    <app-group-create-drawer :visible="createVisible" :close="closeCreate"/>
    <div class="groups-header">
      <div class="groups-header-name">
        Группы
      </div>
      <div class="groups-header-search">
        <a-button type="primary" @click="openCreate">Создать группу</a-button>
      </div>
    </div>
    <div class="groups-body">
      <app-group v-for="group in groups" :group="group"></app-group>
    </div>
  </div>
</template>
<script>

  import AppGroupCreateDrawer from "../components/drawers/GroupCreateDrawer";
  import {mapGetters} from "vuex";
  import {GET_GROUPS} from "../store/group/actions.type";
  import AppGroup from "../components/common/Group";

  export default {
    components: {
      AppGroupCreateDrawer,
      AppGroup,
    },
    data() {
      return {
        createVisible: false,
      }
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
      this.$store.dispatch(GET_GROUPS);
    },
    computed: {
      ...mapGetters(['groups'])
    }
  }
</script>

<style lang="scss">

  .groups {
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

    &-body {
      margin: 1.5rem 3.125rem 1rem 3.125rem;
      display: flex;
      flex-wrap: wrap;
      }

  }

</style>