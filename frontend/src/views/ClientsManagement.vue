<template>
  <div class="page">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      @back="() => $router.go(-1)"
      title="Управление клиентами"
      :subTitle="currentClient && currentClient.name"
    >
      <template slot="extra">
        <a-button key="1" type="primary" @click="newClientShow">Новый клиент</a-button>
        <!-- <a-button key="2">Operation</a-button>    -->
      </template>
      <a-descriptions size="small" :column="3">
        <a-descriptions-item label="Всего клиентов">{{clients.length}}</a-descriptions-item>
        <a-descriptions-item label="Поступлений за тек. месяц">
          <a>567 000.00 руб.</a>
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>
    <!-- Таблица клиентов -->
    <a-table
      :columns="columns"
      :dataSource="clients"
      size="small"
      :rowClassName="rowStyling"
      rowKey="_id"
      class="clients_table"
    >
      <span slot="name" slot-scope="text, record">
        <a class="client_name" @click="openClient(record)">{{ text }}</a>
        <div class="workspace">{{record.workspace}}</div>
      </span>
      <span
        slot="addr"
        slot-scope="text, record"
      >{{record.city}}{{record.address? ', ': ''}}{{record.address}}</span>
      <span slot="access_status" slot-scope="access">
        <a-tag :color="access ? 'green' : 'red'">{{ access ? 'Активен' : 'Блокировка' }}</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a-button
          size="small"
          @click="blockClient(record)"
        >{{record.has_access ? 'Заблокировать' : 'Разблокировать'}}</a-button>
      </span>
      <span slot="enter" slot-scope="text, record">
        <a-button size="small" shape="circle" icon="login" @click="enterClient(record)" />
      </span>
    </a-table>
    <!-- Диалог редактирования клиента -->
    <ClientEditDialog
      :visible="editClientVisible"
      @save="clientSave"
      @cancel="clientCancel"
      :editMode="editMode"
      :client="selectedClient"
    />
  </div>
</template>

<script>
import store from "../store";
import { mapGetters } from "vuex";
import {
  GET_CLIENTS,
  EDIT_CLIENT,
  ENTER_CLIENT,
} from "@/store/client/actions.type";

import ClientEditDialog from "@/components/modal/ClientEditDialog";

const columns = [
  {
    title: "Название, код",
    dataIndex: "name",
    key: "name",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Телефон",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Адрес компании",
    dataIndex: "address",
    key: "address",
    scopedSlots: { customRender: "addr" },
  },
  {
    title: "Кол-во сотрудников",
    key: "users",
    dataIndex: "users",
  },
  {
    title: "Статус",
    key: "access_status",
    dataIndex: "has_access",
    scopedSlots: { customRender: "access_status" },
  },
  {
    title: "Действия",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
  {
    title: "Вход",
    key: "enter",
    scopedSlots: { customRender: "enter" },
  },
];
export default {
  name: "AppClients",
  components: {
    ClientEditDialog,
  },
  data() {
    return {
      columns,
      editClientVisible: false,
      editMode: false,
      currentClientStr: "",
      selectedClient: {},
    };
  },
  computed: {
    ...mapGetters(["clients", "currentClient", "userData"]),
  },
  methods: {
    tarifColor(tarif) {
      const colors = {
        free: "#ff0000",
        base: "#00ff00",
        prof: "#0000ff",
      };
      return colors[tarif];
    },
    rowStyling(rec, index) {
      const styles = [];
      if (!rec.has_access) styles.push("denied");
      if (this.currentClient && rec.workspace == this.currentClient.workspace)
        styles.push("curr-workspace");
      return styles;
    },
    /**
     * Открытие окна нового клиента
     */
    newClientShow() {
      this.editMode = false;
      this.selectedClient = null;
      this.editClientVisible = true;
    },
    /**
     * Открытие окна изменения клиента
     */
    openClient(client) {
      this.editMode = true;
      this.selectedClient = client;
      this.editClientVisible = true;
    },
    /**
     * Сохранение данных (если бы она была здесь а не в самом компоненте)
     */
    clientSave() {
      this.editClientVisible = false;
      // this.$success({
      //   centered: true,
      //   title: "Данные сохранены",
      //   content: "Новый клиент записан"
      // });
    },
    clientCancel() {
      this.editClientVisible = false;
    },
    /**
     * Блокировка или разблокировка клиента
     */
    blockClient(record) {
      this.$confirm({
        centered: true,
        title: record.has_access ? "Заблокировать" : "Разблокировать",
        content:
          `Клиент ${record.name} будет ` +
          (record.has_access ? "заблокирован" : "разблокирован"),
        okType: "danger",
        okText: "ОК",
        cancelText: "Отменить",
        onOk: () => {
          this.blockClientAction(record);
        },
      });
    },
    async blockClientAction(rec) {
      rec.has_access = !rec.has_access;
      try {
        await this.$store.dispatch(EDIT_CLIENT, rec);
        this.$success({
          centered: true,
          title: "Статус изменен",
          content:
            "Клиент " + (!rec.has_access ? "заблокирован" : "разблокирован"),
        });
      } catch (error) {
        this.$error({
          centered: true,
          title: "Ошибка при изменении статуса клиента",
          content: error,
        });
      }
    },
    async enterClient(rec) {
      try {
        if (!this.userData.result._id) {
          console.log(this.userData.result._id);
          return;
        }
        // входим в воркспейс и сохраняем в сторе
        await this.$store.dispatch(ENTER_CLIENT, rec.workspace);
        // дополнительно сохраняем в сторадж для восстановления после F5 (в компоненте LoginBar)
        localStorage.setItem(
          "currentClient",
          JSON.stringify(this.currentClient)
        );
        this.$socket.client.nsp = "/" + rec.workspace;
        this.$socket.client.connect(`${process.env.VUE_APP_API_URL}`);
        // для контроля
        // this.currentClientStr = JSON.stringify(
        //   JSON.parse(localStorage.getItem("currentClient")),
        //   null,
        //   3
        // );
        this.$message.success("Вы успешно вошли в рабочую область клиента");
      } catch (error) {
        this.$error({
          centered: true,
          title: "Ошибка при входе в область клиента",
          content: error,
        });
      }
    },
  },
  beforeMount() {
    this.$store.dispatch(GET_CLIENTS);
    // для контроля
    // this.currentClientStr = JSON.stringify(
    //   JSON.parse(localStorage.getItem("currentClient")),
    //   null,
    //   3
    // );
  },
};
</script>

<style lang="scss">
.page {
  margin: 30px;
}

.ant-table-row {
  & td {
    padding: 5px 8px !important;
  }
  &.denied {
    background-color: mistyrose;
    color: brown;
  }
  .workspace {
    font-size: 9pt;
    color: cornflowerblue;
  }
  &.curr-workspace {
    font-weight: bold;
    color: green;
  }
  .client_name {
    font-weight: bold;
  }
}
</style>