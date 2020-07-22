<template>
  <div class="page">
    <h3>Управление данными клиента</h3>
    <h6
      style="color: red"
    >Данная страница предназначена для тестовых данных, не для реальных клиентов!</h6>
    <a-table :columns="columns" :data-source="client_statistic" v-if="loaded">
      <span class="collection-name" slot="collection" slot-scope="c_name">{{c_name}}</span>
      <span slot="actions" slot-scope="row">
        <a-button
          type="danger"
          size="small"
          :disabled="!accessible[row.collection]"
          @click="deleteCollectionDialog(row.collection)"
        >Удалить данные</a-button>
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
      accessible: {
        users: false,
        posts: false,
        events: true,
        groups: false,
        messages: true
      },
      loaded: false
    };
  },
  computed: {
    ...mapGetters(["client_statistic", "currentClient", "dialog_message"])
  },
  created() {
    this.$store
      .dispatch(GET_STATISTIC, this.currentClient.workspace)
      .then(() => {
        this.loaded = true;
      });
  },
  methods: {
    deleteCollectionDialog(coll_name) {
      this.$confirm({
        title: "Удаление коллекции " + coll_name,
        content: "Данные будут удалены безвозвратно, удалить?",
        centered: true,
        okText: "Удалить",
        okType: "danger",
        cancelText: "Нет",
        onOk: () => {
          this.dropCollection(coll_name);
        }
      });
    },
    async dropCollection(coll_name) {
      try {
        const res = await this.$store.dispatch(DROP_COLLECTION, {
          client: this.currentClient.workspace,
          coll_name
        });
        console.log("delete result:", res);
        this.$success({
          title: "Данные в коллекции удалены: ",
          content: this.dialog_message,
          centered: true
        });
      } catch (error) {
        this.$error({
          title: "Ошибка при удалении данных",
          content: error,
          centered: true
        });
      }
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
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  padding: 8px;
}
</style>