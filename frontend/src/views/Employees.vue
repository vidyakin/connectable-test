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
        <a-button key="2" @click="reload">Обновить</a-button>
        <!-- <a-button key="2">Operation</a-button>    -->
      </template>
      <a-descriptions size="small" :column="3">
        <a-descriptions-item label="Всего сотрудников">{{employees && employees.length}}</a-descriptions-item>
        <a-descriptions-item label="Ген.директор">Иванов Борис</a-descriptions-item>
        <a-descriptions-item label="Зам. директора">Смирнова Светлана</a-descriptions-item>
      </a-descriptions>
    </a-page-header>

    <a-table :columns="cols" :dataSource="employees" size="small" :loading="tblLoading">
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
    <!-- <pre style="font-size:8pt !important">{{JSON.stringify(users.map(_=>_.firstName+' '+_.lastName),null,2)}}</pre> -->
    <!-- Модальное окно создания сотрудника -->
    <add-employee-modal :visible="newEmplVisible" :close="newEmplClose" @create="createEmployee" />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { GET_USERS, INSERT_USER_INFO } from "@/store/user/actions.type";

import AddEmployeeModal from "@/components/modal/AddEmployeeModal";

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
      tblLoading: false,
      cols: cols,
      newEmplVisible: false
    };
  },
  computed: {
    employees() {
      if (!this.users) return [];
      return this.users.map(e => {
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
    },
    ...mapGetters(["errorRegister"]),
    ...mapState({
      users: state => state.auth.users
    })
  },
  watch: {
    employees(newempl, oldempl) {
      // Our fancy notification (2).
      console.log(
        `employees watching: len of new is ${
          newempl ? newempl.length : "null"
        }!`
      );
    }
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
    },
    reload() {
      this.$store.dispatch(GET_USERS);
    },
    createEmployee(empl_data) {
      this.newEmplVisible = false;
      this.tblLoading = true;
      console.log("Before INSERT: " + this.users.length);
      this.$store
        .dispatch(INSERT_USER_INFO, {
          firstName: empl_data.name,
          lastName: empl_data.surname,
          email: empl_data.email,
          password: empl_data.password,
          emailSend: false
        })
        .then(() => {
          if (!this.errorRegister) {
            console.log(
              "Сount of users before GET_USERS: " + this.users.length
            );
            this.$store.dispatch(GET_USERS).then(() => {
              console.log(
                "Count of users after GET_USERS: " + this.users.length
              );
              this.$success({
                centered: true,
                title: "Сотруник записан",
                content: `Сотрудник ${empl_data.name} ${empl_data.surname} создан`
              });
            });
          } else {
            this.$error({
              centered: true,
              title: "Ошибка при сохранении сотрудника",
              content: this.errorRegister
            });
          }
        })
        .finally(() => {
          this.tblLoading = false;
        });
    }
  },
  created() {
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