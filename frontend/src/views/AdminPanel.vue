<template>
  <div class="page">
    <h3>Управление данными клиента</h3>
    <h6
      style="color: red"
    >Данная страница предназначена для тестовых данных, не для реальных клиентов!</h6>
    <a-table :columns="columns" :data-source="client_statistic" v-if="loaded">
      <span class="collection-name" slot="collection" slot-scope="c_name">{{c_name}}</span>
      <span slot="actions" slot-scope="row">
        <a-button type="danger" size="small" @click="deleteCollectionDialog(row.collection)">Удалить данные</a-button>
        <a-divider type="vertical" />
        <a-button size="small" disabled>Удалить по фильтру</a-button>
      </span>
    </a-table>
    <a-spin size="large" v-else />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const cols = [
  {
    key: "collection",
    dataIndex: "collection",
    title: "Коллекция",
    scopedSlots: { customRender: "collection" }
  },
  {
    key: "docs_count",
    dataIndex: "docs_count",
    title: "Число записей"
  },
  {
    key: "actions",
    title: "Действия",
    scopedSlots: { customRender: "actions" }
  }
];

import { GET_STATISTIC, DROP_COLLECTION } from "@/store/client/actions.type";

export default {
  data() {
    return {
      columns: cols,
      //db_data: demo_data,
      loaded: false
    };
  },
  computed: {
    ...mapGetters(["client_statistic", "currentClient"])
  },
  created() {
    this.$store
      .dispatch(GET_STATISTIC, this.currentClient.workspace)
      .then(() => {
        this.loaded = true;
      });
  },
  methods: {
    deleteCollectionDialog(col_name) {
      this.$confirm({
        title: 'Удаление коллекции '+col_name,
        content: 'Данные будут удалены безвозвратно, удалить?',
        okText: 'Удалить',
        okType: 'danger',
        cancelText: 'Нет',
        onOk() {
          this.dropCollection(col_name)
        }
      })
    },
    dropCollection(col_name) {
      this.$store.dispatch(DROP_COLLECTION, this.currentClient.workspace, col_name)
        .then(res => {
          this.$success({
            title: "Данные в коллекции удалены",
            content: "Коллекция очищена",
            centered: true
          })
        })
        .catch(err => {
          this.$error({
            title: "Ошибка при удалении данных",
            content: err,
            centered: true
          })
        })
    }
  }
};
</script>

<style lang="scss">
.page {
  margin: 0 30px;
}
.collection-name {
  font-weight: bold;
}
</style>