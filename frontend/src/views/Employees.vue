<template>
  <div class="page">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      @back="() => $router.go(-1)"
      title="Управление сотрудниками"
      :subTitle="currentClient && currentClient.name"
    >
      <template slot="extra">
        <a-button key="1" type="primary" @click="newEmployeeOpen">Новый сотрудник</a-button>
        <a-button key="2" @click="reload">Обновить</a-button>
        <!-- <a-button key="2">Operation</a-button>    -->
      </template>
      <a-descriptions size="small" :column="4">
        <a-descriptions-item label="Всего сотрудников">{{employees && employees.length}}</a-descriptions-item>
        <a-descriptions-item label="Ген.директор">Иванов Борис</a-descriptions-item>
        <a-descriptions-item label="Зам. директора">Смирнова Светлана</a-descriptions-item>
        <a-descriptions-item label="Показывать удаленных">
          <a-switch size="small" default-checked @change="chkd => {this.showDeleted = chkd}" />
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>

    <a-table
      :columns="cols"
      :dataSource="employees"
      size="small"
      class="empl_table"
      :loading="tblLoading"
      :rowClassName="rowStyling"
    >
      <div slot="fio" slot-scope="text" class="table-row-name" @click="goTo(text.id)">
        <a-avatar :src="text.googleImage"></a-avatar>
        <span :class="['a', text.mark_del ? 'deleted' : '']">{{text.firstName}} {{text.lastName}}</span>
      </div>
      <span slot="role" slot-scope="role">
        <a-tag :color="roleView(role).color">{{ roleView(role).text.toUpperCase() }}</a-tag>
      </span>
      <span slot="actions" slot-scope="text, record" class="action-buttons">
        <a-button size="small" @click="deleteEmployee(record)">
          <a-icon type="delete" />
          {{ record.mark_del ? 'Восстановить' : 'Удалить' }}
        </a-button>
        <a-button size="small">
          <a-icon type="unlock" />Сбросить пароль
        </a-button>
        <a-button size="small">
          <a-icon type="compass" />Изменить роль
        </a-button>
      </span>
    </a-table>
    <pre style="font-size:8pt !important; height: 300px">{{JSON.stringify(userData.result._id,null,2)}}</pre>
    <!-- Модальное окно создания сотрудника -->
    <add-employee-modal :visible="newEmplVisible" :close="newEmplClose" @create="createEmployee" />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import {
  GET_USERS,
  INSERT_USER_INFO,
  MARK_USER_DELETED,
  UNMARK_USER_DELETED
} from "@/store/user/actions.type";

import { REPLACE_GROUPS_OWNER } from "@/store/group/actions.type";
import { CLEAR_HEAD_OF_DEPTS } from "@/store/structure/actions.type";

import AddEmployeeModal from "@/components/modal/AddEmployeeModal";

const cols = [
  {
    title: "ФИО",
    dataIndex: "fio",
    key: "fio",
    scopedSlots: { customRender: "fio" }
  },
  {
    title: "e-mail",
    dataIndex: "email",
    key: "email"
  },
  {
    title: "Должности",
    dataIndex: "positions",
    key: "positions"
  },
  {
    title: "Телефон",
    dataIndex: "phone",
    key: "phone"
  },
  {
    title: "Роль",
    dataIndex: "role",
    key: "role",
    scopedSlots: { customRender: "role" }
  },
  {
    title: "Действия",
    key: "actions",
    scopedSlots: { customRender: "actions" }
  }
];
export default {
  components: { AddEmployeeModal },
  data() {
    return {
      tblLoading: false,
      cols: cols,
      newEmplVisible: false,
      showDeleted: true
    };
  },
  computed: {
    employees() {
      if (!this.users) return [];
      return this.users
        .map(e => {
          const {
            googleImage,
            firstName,
            lastName,
            positions,
            phone,
            email
          } = e;
          const row = {
            fio: { googleImage, firstName, lastName, id: e._id },
            positions: positions.join(", "),
            phone,
            email,
            role: e.email == "w.project.portal3@gmail.com" ? "admin" : "-",
            key: e._id,
            mark_del: e.deletion_mark
          };
          return row;
        })
        .filter(e => (!this.showDeleted && !e.mark_del) || this.showDeleted);
    },
    ...mapGetters(["errorRegister", "userData", "currentClient"]),
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
    rowStyling(rec, index) {
      return rec.mark_del ? "deleted" : "";
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
      this.$store.dispatch(GET_USERS, this.currentClient.workspace);
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
          emailSend: true,
          workspace: empl_data.workspace
        })
        .then(() => {
          if (!this.errorRegister) {
            console.log(
              "Сount of users before GET_USERS: " + this.users.length
            );
            this.$store
              .dispatch(GET_USERS, this.currentClient.workspace)
              .then(() => {
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
    },
    deleteEmployee(empl_data) {
      // Предварительные проверки на самого себя и админа
      if (
        this.$can("read", { accessEmail: empl_data.email, __type: "Admin" })
      ) {
        this.$error({
          centered: true,
          title: "Ошибка при удалении",
          content: "Невозможно удалить администратора"
        });
        return;
      }
      if (empl_data.key == this.userData.result._id) {
        this.$error({
          centered: true,
          title: "Ошибка при удалении",
          content: "Невозможно удалить самого себя"
        });
        return;
      }

      const fio = empl_data.fio.firstName + " " + empl_data.fio.lastName;
      const title = !empl_data.mark_del
        ? "Подтвердите удаление сотрудника"
        : "Восстановить удаленного сотрудника";
      const content =
        `Сотрудник «${fio}» будет ` +
        (!empl_data.mark_del ? "удален" : "восстановлен");
      // TODO: добавить проверку на текущего пользователя, чтобы нельзя было удалить себя, и на администратора
      this.$confirm({
        centered: true,
        title,
        content,
        okType: "danger",
        okText: "ОК",
        cancelText: "Отменить",
        onOk: () => {
          this.deleteEmployeeAction(empl_data, !empl_data.mark_del);
        },
        class: "test"
      });
    },
    async deleteEmployeeAction(d, deleting_mark) {
      const disp_name = deleting_mark ? MARK_USER_DELETED : UNMARK_USER_DELETED,
        del_type = deleting_mark ? "удален" : "восстановлен",
        fio = d.fio.firstName + " " + d.fio.lastName;
      console.log(`Deleting empl ${fio} with id ${d.key}`);
      let step = del_type + "ие";
      try {
        await this.$store.dispatch(disp_name, d.key); // помечаем как удаленного или восстанавливаем
        step = "Замена в группах";
        await this.$store.dispatch(REPLACE_GROUPS_OWNER, d.key); // заменяем создателя в группах на админа
        step = "Удаление как начальника";
        await this.$store.dispatch(CLEAR_HEAD_OF_DEPTS, d.key); // убираем из начальников отделов
        await this.$store.dispatch(GET_USERS, this.currentClient.workspace); // получаем список сотрудников для обновления таблицы
        this.$success({
          centered: true,
          title: "Сотруник " + del_type,
          content: `Сотрудник ${fio} был ${del_type}`
        });
      } catch (error) {
        this.$error({
          title: "Ошибка при удалении сотрудника",
          content: "Шаг: " + step + " \n" + error.stack
        });
      }
    }
  },
  created() {
    if (this.currentClient) {
      this.$store.dispatch(GET_USERS, this.currentClient.workspace);
    }
  }
};
</script>

<style lang="scss">
.page {
  margin: 5px 30px;
}

.empl_table table tr.ant-table-row td {
  padding: 5px 8px !important;
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

tr.ant-table-row.deleted {
  background-color: lightgray;
  color: dimgray;
  text-decoration: line-through;
}
</style>