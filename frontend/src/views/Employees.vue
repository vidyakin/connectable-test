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
        <!-- <a-button key="3" type="success" @click="newEmployeeTest">Тест сообщения</a-button> -->
        <a-button key="2" @click="reload">Обновить</a-button>
        <!-- <a-button key="2">Operation</a-button>    -->
      </template>
      <a-descriptions size="small" :column="4">
        <a-descriptions-item label="Всего сотрудников">{{employees && employees.length}}</a-descriptions-item>
        <!-- <a-descriptions-item label="Ген.директор">Иванов Борис</a-descriptions-item>
        <a-descriptions-item label="Зам. директора">Смирнова Светлана</a-descriptions-item>-->
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
      <div slot="fio" slot-scope="text, record" class="table-row-name" @click="goTo(text.id)">
        <a-avatar :src="text.googleImage"></a-avatar>
        <span :class="['a', text.mark_del ? 'deleted' : '']">{{text.firstName}} {{text.lastName}}</span>
        <a-icon type="crown" class="icon-admin" v-if="record.is_admin" />
      </div>
      <span slot="is_admin" slot-scope="is_admin">
        <a-tag :color="roleView(is_admin).color">{{ roleView(is_admin).text.toUpperCase() }}</a-tag>
      </span>
      <span slot="actions" slot-scope="text, record" class="action-buttons">
        <a-button size="small" @click="deleteEmployee(record)">
          <a-icon type="delete" />
          {{ record.mark_del ? 'Восстановить' : 'Удалить' }}
        </a-button>
        <a-button size="small">
          <a-icon type="unlock" />Сбросить пароль
        </a-button>
        <!-- Меню изменения ролей -->
        <a-dropdown :trigger="['click']" v-if="userIsAdmin">
          <a-menu slot="overlay" @click="e=> hndChangeRoleClick(e, record)">
            <a-menu-item key="1">
              <a-icon :type="record.is_admin ? 'minus' : 'plus'" />Администратор
            </a-menu-item>
            <a-menu-item key="2" disabled>
              <a-icon type="user" />Модератор групп
            </a-menu-item>
            <a-menu-item key="3" disabled>
              <a-icon type="user" />Управление структурой
            </a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px" size="small">
            <a-icon type="compass" />Изменить роль
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </span>
    </a-table>
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
import { CREATE_MESSAGE } from "@/store/notification/actions.type";
import { REPLACE_GROUPS_OWNER } from "@/store/group/actions.type";
import { CLEAR_HEAD_OF_DEPTS } from "@/store/structure/actions.type";
import { INSERT_ROLE, DELETE_ROLE } from "@/store/user/actions.type";

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
    dataIndex: "is_admin",
    key: "is_admin",
    scopedSlots: { customRender: "is_admin" }
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
            mark_del: e.deletion_mark,
            is_admin: e.roles && e.roles.includes("admin")
          };
          return row;
        })
        .filter(e => (!this.showDeleted && !e.mark_del) || this.showDeleted);
    },
    ...mapGetters([
      "errorRegister",
      "userData",
      "userIsSuperAdmin",
      "userIsAdmin",
      "currentClient"
    ]),
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
    },
    currentClient(client) {
      if (client) {
        this.$store.dispatch(GET_USERS, client.workspace);
      }
    }
  },
  methods: {
    goTo(id) {
      this.$router.push({ name: "profile", params: { _id: id } });
    },
    rowStyling(rec, index) {
      const styles = [];
      if (rec.mark_del) styles.push("deleted");
      if (rec.is_admin) styles.push("is-admin");
      return styles;
    },
    roleView(is_admin) {
      if (is_admin) {
        return { text: "Администратор", color: "volcano" };
      } else {
        return { text: "Сотрудник", color: "blue" };
      }
      // switch (r) {
      //   case "admin":
      //     return { text: "Администратор", color: "volcano" };
      //     break;
      //   default:
      //     return { text: "Сотрудник", color: "blue" };
      // }
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
    newMsgForEmpl(full_name, client_id, id) {
      return {
        msgType: "NEW_EMPL", // тип сообщения, для разделения бизнес-логики - "NEW_GROUP","YOU_ADDED_IN_GROUP", ""
        dateCreated: Date.now(), // Дата создания сообщения
        text: full_name, // текст сообщения
        senderId: "system", // id отправителя
        listenerType: "all", // тип приемников сообщений - все, выборочно или еще как-то
        linkedObjType: "employee", // связанный объект - группа, проект, и т.д.
        linkedObjId: id,
        client_id
      };
    },
    createEmployee(empl_data) {
      this.newEmplVisible = false;
      this.tblLoading = true;
      console.log("Before INSERT: " + this.users.length);
      const newEmpl = {
        firstName: empl_data.name,
        lastName: empl_data.surname,
        email: empl_data.email,
        password: empl_data.password,
        emailSend: true,
        workspace: empl_data.workspace
      };
      this.$store
        .dispatch(INSERT_USER_INFO, newEmpl)
        .then(newEmpl => {
          if (this.errorRegister) {
            this.$error({
              centered: true,
              title: "Ошибка при сохранении сотрудника",
              content: this.errorRegister
            });
            return;
          }
          // объект-модель для сохранения в БД
          const newMsg = this.newMsgForEmpl(
            `${empl_data.name} ${empl_data.surname}`,
            empl_data.workspace,
            newEmpl.id
          );
          // Создаем сообщение в БД и сторе
          this.$store.dispatch(CREATE_MESSAGE, newMsg).then(newMsgId => {
            this.$socket.client.emit("to all", {
              type: "NEW_EMPL",
              val: newMsg
            });
          });
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
        })
        .finally(() => {
          this.tblLoading = false;
        });
    },
    newEmployeeTest() {
      const newEmpl = {
        firstName: "Иван",
        lastName: "Иванов",
        email: "ivan@gmail.com",
        client_id: this.userData.result.client_id
      };
      const newMsg = this.newMsgForEmpl(
        newEmpl.firstName + " " + newEmpl.lastName,
        newEmpl.client_id,
        "23412341235"
      );
      this.$store.dispatch(CREATE_MESSAGE, newMsg).then(newMsgId => {
        this.$socket.client.emit("to all", {
          type: "NEW_EMPL",
          val: newMsg
        });
      });
    },
    deleteEmployee(empl_data) {
      // Предварительные проверки на самого себя и админа
      if (empl_data.is_admin) {
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
    },
    hndChangeRoleClick(e, rec) {
      if (e.key == 1) {
        if (rec.key == this.userData.result._id) {
          this.$error({
            centered: true,
            title: "Ошибка изменения роли",
            content: "Нельзя изменять собственную роль"
          });
          return;
        }
        const fio = rec.fio.firstName + " " + rec.fio.lastName;
        const content = rec.is_admin
          ? `Снять с ${fio} права администратора`
          : `Сделать сотрудника ${fio} администратором?`;
        this.$confirm({
          centered: true,
          title: "Подтверждение",
          content,
          okType: "danger",
          okText: "Да",
          cancelText: "Отменить",
          onOk: () => {
            this.manageUserAdminRoleAction(rec);
          },
          class: "test"
        });
      }
    },
    async manageUserAdminRoleAction(rec) {
      try {
        await this.$store.dispatch(rec.is_admin ? DELETE_ROLE : INSERT_ROLE, {
          user_id: rec.key,
          role: "admin"
        });
        await this.$store.dispatch(GET_USERS, this.currentClient.workspace);
        this.$success({
          centered: true,
          title: "Изменение роли",
          content: `Роль администратора ${
            rec.is_admin ? "установлена" : "снята"
          } успешно`
        });
      } catch (error) {
        this.$error({
          centered: true,
          title: "Ошибка изменения роли",
          content: error.message
        });
      }
    }
  },
  mounted() {
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

.ant-table-row {
  &.deleted {
    background-color: lightgray;
    color: dimgray;
    text-decoration: line-through;
  }
  &.is-admin {
    background-color: beige;
  }
}

.icon-admin {
  margin-left: 10px;
  color: goldenrod;
}
</style>