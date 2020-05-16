<template>
  <div class="page">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      @back="() => $router.go(-1)"
      title="Управление сотрудниками"
      subTitle="АО «Купи & Продай»"
    >
      <template slot="extra">
        <a-button key="1" type="primary" @click="newEmployeeOpen">Новый сотрудник</a-button>
        <!-- <a-button key="2">Operation</a-button>    -->
      </template>
      <a-descriptions size="small" :column="3">
        <a-descriptions-item label="Всего сотрудников:">{{employees.length}}</a-descriptions-item>
        <a-descriptions-item label="Ген.директор">Иванов Борис</a-descriptions-item>
        <a-descriptions-item label="Зам. директора">Смирнова Светлана</a-descriptions-item>
      </a-descriptions>
    </a-page-header>

    <a-table :columns="cols" :dataSource="employees" size="small">
      <div slot="fio" slot-scope="text" class="table-row-name" @click="goTo(text.id)">
        <a-avatar :src="text.googleImage"></a-avatar>
        <span class="a">{{text.firstName}} {{text.lastName}}</span>
      </div>
      <span slot="role" slot-scope="role">
        <a-tag :color="roleView(role).color">{{ roleView(role).text.toUpperCase() }}</a-tag>
      </span>
      <span slot="actions" class="action-buttons">
        <a-button size="small">
          <a-icon type="delete" />Удалить
        </a-button>
        <a-button size="small">
          <a-icon type="unlock" />Сбросить пароль
        </a-button>
        <a-button size="small">
          <a-icon type="compass" />Изменить роль
        </a-button>
      </span>
    </a-table>
    <!-- Модальное окно создания сотрудника -->
    <add-employee-modal :visible="newEmplVisible" :close="newEmplClose" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { GET_USERS } from "../store/user/actions.type";

import AddEmployeeModal from "../components/modal/AddEmployeeModal";

const cols = [
  {
    title: "ФИО",
    dataIndex: "fio",
    key: "fio",
    width: 100,
    scopedSlots: { customRender: "fio" }
  },
  {
    title: "e-mail",
    dataIndex: "email",
    key: "email",
    width: 90
  },
  {
    title: "Должности",
    dataIndex: "positions",
    key: "positions",
    width: 100
  },
  {
    title: "Телефон",
    dataIndex: "phone",
    key: "phone",
    width: 100
  },
  {
    title: "Роль",
    dataIndex: "role",
    key: "role",
    width: 120,
    scopedSlots: { customRender: "role" }
  },
  {
    title: "Действия",
    key: "actions",
    width: 100,
    scopedSlots: { customRender: "actions" }
  }
];
export default {
  components: { AddEmployeeModal },
  data() {
    return {
      isLoaded: false,
      cols: cols,
      employees: null,
      newEmplVisible: false
    };
  },
  computed: {
    ...mapGetters(["users"])
  },
  methods: {
    goTo(id) {
      this.$router.push({ name: "profile", params: { _id: id } });
    },
    roleView(r) {
      switch (r) {
        case "admin":
          return { text: "Администратор", color: "volcano" };
          break;
        default:
          return { text: "Сотрудник", color: "blue" };
      }
    },
    newEmployeeOpen() {
      this.newEmplVisible = true;
    },
    newEmplClose() {
      this.newEmplVisible = false;
    }
  },
  watch: {
    users(users) {
      this.employees = users.map(e => {
        const { googleImage, firstName, lastName, positions, phone, email } = e;
        const row = {
          fio: { googleImage, firstName, lastName, id: e._id },
          positions: positions.join(", "),
          phone,
          email,
          role: e._id == "5e91f258c76c6d002b496472" ? "admin" : "-",
          key: e._id
        };
        return row;
      });
    }
  },
  beforeMount() {
    this.$store.dispatch(GET_USERS);
  }
};
</script>

<style lang="scss">
.page {
  margin: 30px;
}

.table-row-name {
  font-size: 0.9rem;
  font-weight: bold;

  &:hover {
    cursor: pointer;
  }

  .ant-avatar {
    margin-right: 0.5rem;
  }
}
.action-buttons .ant-btn {
  margin: 0 5px;
}
</style>