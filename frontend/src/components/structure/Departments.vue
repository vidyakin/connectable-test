<template>
  <div class="departments">
    <!-- <a-page-header
        style='border: 1px solid rgb(235, 237, 240)'
        title='Структура'
      >
      <template slot='extra'>
        <a-button key='3' type='primary'>Редактировать</a-button>
      </template>
    </a-page-header>-->
    <vo-edit
      v-if="chartData && !loading"
      :data="chartData"
      :pan="true"
      :toggleCollapse="false"
      :toggleSiblingsResp="true"
      :createNode="createdNode"
    ></vo-edit>
    <div id="replaceInfoMessage" v-show="replacingMessageVisible">Выберите отдел для переноса</div>
    <div id="zoom-buttons">
      <a-button icon="plus" shape="circle" @click="zoom(1)" />
      <a-button icon="minus" shape="circle" @click="zoom(-1)" />
      <a-button icon="reload" shape="circle" @click="zoom(0)" />
    </div>
    <div v-show="false">
      <label class="selected-node-group"></label>
      <input type="text" id="selected-node" class="selected-node-group" />
    </div>
    <!-- Контекстное меню -->
    <vue-context ref="contextMenu">
      <!-- Пункты меню для сотрудников -->
      <li class="context-menu-item" v-for="empl of employeesOfDept" :key="empl._id">
        <a :href="'/profile/'+empl._id">
          <div class="title">{{empl.name}}</div>
          <div class="subtitle">{{empl.position}}</div>
          <a-icon type="crown" class="chief-crown" v-show="empl.isChief" />
        </a>
      </li>
      <!-- Пункты меню для действий -->
      <li
        :class="'context-menu-item ' + item.style"
        v-for="item of contextMenuItems"
        :key="item.name"
        v-show="userIsAdmin"
      >
        <a @click.prevent="item.clickHandler">
          <div class="title">
            <a-icon :type="item.icon" />
            {{item.name}}
          </div>
        </a>
      </li>
      <li class="context-menu-item" v-show="!userIsAdmin && employeesOfDept.length == 0">
        <a href>
          <div class="title">Нет сотрудников</div>
          <div class="subtitle"></div>
        </a>
      </li>
    </vue-context>
    <!-- Диалог редактирования отдела -->
    <department-edit-form
      ref="deptEditForm"
      :visible="editDepartmentVisible"
      :dataToShow="dataForDepartment"
      @create="createDeptAction"
      @cancel="cancelCreateDeptAction"
    />
    <department-edit-employees
      :visible="dialogDeptEmployeesVisible"
      :mode="dialogEmplMode"
      :dept-id="clickedDeptId || 'no'"
      :employees="employeesOfDept"
      @create="addEmployeesToDeptAction"
      @cancel="cancelAddEmployeesToDeptAction"
      @deleteEmpl="deleteEmployee"
      @setEmplAsChief="setEmployeeAsDeptChief"
    />
    <!-- <pre>{{JSON.stringify(chartData,null,3)}}</pre> -->
    <!-- Диалог для изменения названия -->
    <a-modal
      title="Укажите новое название"
      centered
      v-model="dialogDeptNewNameVisible"
      @ok="changeDeptNameAction"
    >
      <app-input
        v-model="deptNewName"
        placeholder="Название"
        label="Название"
        class="secondary form-input"
      />
    </a-modal>
  </div>
</template>

<script>
// vuex parts
import { mapGetters } from "vuex";
import {
  GET_STRUCTURE,
  SAVE_STRUCTURE,
  EDIT_STRUCTURE,
  GET_DEPT_USERS, // получение данных по всем отделам
  SAVE_DEPT_USERS, // изменение сотрудника отдела
  DELETE_DEPT_USER, // удалить сотрудника из отдела
  EDIT_DEPT_USER // изменение данныз - в частности установка начальника
} from "@/store/structure/actions.type";

// actions & mutations
import { GET_USERS } from "@/store/user/actions.type";

// external components
import { VoBasic, VoEdit } from "vue-orgchart";
import { VueContext } from "vue-context";
import "vue-context/src/sass/vue-context.scss";
import "vue-orgchart/dist/style.min.css";

// internal components
import DepartmentEditForm from "./DepartmentEditForm";
import DepartmentEditEmployees from "./DepartmentEditEmployees";
import AppInput from "../common/Input";

/**
 * Ищем имя узла графа по id узла
 */
function findNameById(graf, id) {
  if (graf.id == id) return graf.name;
  if (graf.children)
    return graf.children.reduce(
      (res, node) => findNameById(node, id) || res,
      ""
    );
  return "";
}
/**
 * Ищем весь узел графа по id узла
 */
function findNodeById(graf, id) {
  if (graf.id == id) return graf;
  if (graf.children) {
    const finded = graf.children.find(node => node.id == id);
    //console.log(`in ${graf.id} > finded: ${finded?.id||'no'}, ${level}`)
    if (finded) return finded;
    return graf.children.reduce(
      (res, node) => res || findNodeById(node, id),
      null
    );
  }
}
/**
 * Добавляем узел к указанному узлу
 */
function addChildToId(graf, id, child) {
  if (graf.id == id) {
    if (!graf.children) graf.children = [];
    graf.children.push(child);
    return true;
  } else if (graf.children) {
    let added = false;
    graf.children.forEach(node => (added = addChildToId(node, id, child)));
    return added;
  } else return false;
}

/**
 * Меняем имя узла графа по id узла
 */
function changeNameById(graf, id, newName) {
  if (graf.id == id) {
    graf.name = newName;
    return true;
  }
  if (graf.children) {
    let changed = false;
    graf.children.forEach(v => {
      if (changeNameById(v, id, newName)) changed = true;
    });
    return changed;
  }
  return false;
}

/**
 * Удаление узла по ID
 */
function delNodeById(graf, id) {
  if (!graf.children) return false;
  const finded = graf.children.findIndex(node => node.id == id);
  //console.log(`in ${graf.id} > finded: ${finded}, ${level}`)
  if (finded != -1) {
    graf.children.splice(finded, 1);
    return true;
  } else if (graf.children) {
    for (let node of graf.children) {
      if (delNodeById(node, id)) return true;
    }
  }
}

export default {
  name: "Departments",
  components: {
    VoEdit,
    VueContext,
    DepartmentEditForm,
    DepartmentEditEmployees,
    AppInput
  },
  data() {
    return {
      editDepartmentVisible: false,
      dataForDepartment: undefined,
      clickedDeptId: null,
      dialogEmplMode: "",
      dialogDeptNewNameVisible: false,
      dialogDeptDeleteVisible: false,
      dialogDeptEmployeesVisible: false,
      deptNewName: "",
      employeesOfDept: [],
      replacingMessageVisible: false,
      replacingDeptId: null,
      struct_id: "",
      loading: true, // без нее не работает, it's a MAGIC!
      labels: ["CEO-1", "CEO-2", "CEO-3", "CEO-4", "CEO-5"],
      zoomLevel: 0,
      orgChartObj: {},
      orgchart: null,
      chartData: {},
      contextMenuItems: [
        {
          name: "Добавить сотрудников",
          icon: "user-add",
          style: "new-empl",
          clickHandler: this.showAddEmployeeToDepartmentDialog
        },
        {
          name: "Выбрать руководителя",
          icon: "crown",
          style: "set-chief",
          clickHandler: this.showSelectDeptChiefDialog
        },
        {
          name: "Удалить сотрудника",
          icon: "user-delete",
          style: "del-empl",
          clickHandler: this.showDelEmployeeOfDepartmentDialog
        },
        {
          name: "Добавить отдел",
          icon: "usergroup-add",
          style: "add-dept",
          clickHandler: this.addDepartmentOnClick
        },
        {
          name: "Изменить название",
          icon: "edit",
          style: "ch-dept-name",
          clickHandler: this.editDeptNameOnClick
        },
        {
          name: "Перенести отдел",
          icon: "swap",
          style: "replace-dept",
          clickHandler: this.replaceDeptOnClick
        },
        {
          name: "Удалить отдел",
          icon: "delete",
          style: "del-dept",
          clickHandler: this.delDepartmentOnClick
        }
      ]
    };
  },
  mounted() {
    if (this.currentClient && this.orgchart == null) {
      console.log(`Грузим данные в mounted`);
      this.loadData(this.currentClient);
    }
  },
  async created() {},
  updated() {
    this.$nextTick(function() {
      // Код, который будет запущен только после
      // обновления всех представлений
      this.$children.forEach(child => {
        if (child.orgchart !== undefined) {
          this.orgChartObj = child;
          this.orgchart = child.orgchart;
          this.drawLevelLabels();
          //console.log(`Область диаграммы получена`);
        }
      });
    });
  },
  computed: {
    ...mapGetters([
      "userData",
      "user",
      "users",
      "structure",
      "dept_users",
      "currentClient",
      "userIsAdmin"
    ]),
    orgChart() {
      if (this.structure && this.structure.length) {
        return this.structure.orgTree;
      } else return {};
    }
  },
  watch: {
    async currentClient(client) {
      if (!client) return;
      console.log(`Грузим данные в watch`);
      await this.loadData(client);
    }
  },
  methods: {
    datauser() {
      // TODO: переделать везде также. Может вообще отдельный геттер сделать с этой проверкой
      return this.userData ? this.userData.result : this.user;
    },
    /**
     * Loading data for given client workspace
     */
    async loadData(client) {
      try {
        await this.$store.dispatch(GET_STRUCTURE, client.workspace);
      } catch (error) {
        console.error(`ошибка получения данных по структуре: ${error.message}`);
        return;
      }
      // Если структуры в базе нет, создаем головной элемент и сохраняем в базу
      if (this.structure.orgTree == undefined) {
        this.chartData = {
          id: "ceo",
          name: "Главное управление"
        };
        await this.$store.dispatch(SAVE_STRUCTURE, {
          client_id: client.workspace,
          orgTree: this.chartData
        });
        await this.$store.dispatch(GET_STRUCTURE, client.workspace); // обновление стора надо бы засунуть в SAVE_STRUCTURE
      }
      if (!this.structure._id) {
        this.$error({
          title: "Ошибка",
          content: "Не удалось загрузить данные о структуре",
          centered: true
        });
        return;
      }
      // 0-й элемент потому что пока что возвращается массив ( все схемы ), а будет с отбором по клиенту одна
      this.struct_id = this.structure._id;
      this.chartData = this.structure.orgTree;
      this.loading = false; //  без этого не работает загрузка данных в схему!

      if (!this.users || !this.users.length) {
        await this.$store.dispatch(GET_USERS, client.workspace);
      }
      // заполняем пользователей
      try {
        await this.$store.dispatch(GET_DEPT_USERS, client.workspace);
      } catch (error) {
        console.error(
          `ошибка получения данных по сотрудникам: ${error.message}`
        );
        return;
      }
    },
    // mountOrgChart() {
    //   this.$children.forEach(item => {
    //     item.orgchart !== undefined ? (this.orgChartObj = item) : null;
    //     item.orgchart !== undefined ? (this.orgchart = item.orgchart) : null;
    //   });
    // },
    contextClick(e) {
      e.preventDefault();
      this.clickedDeptId = e.currentTarget.id;
      document.getElementById(
        "selected-node"
      ).dataset.node = this.clickedDeptId;
      // выбираем сотрудников отдела
      const dept_data = this.dept_users.find(
        e => e != null && e.dept_id == this.clickedDeptId
      );
      if (dept_data) {
        this.employeesOfDept = this.users
          .filter(u => dept_data.users.includes(u._id) && !u.deletion_mark)
          .map(u => ({
            _id: u._id,
            name: u.firstName + " " + u.lastName,
            isChief: u._id == dept_data.headUser,
            position: u.positions[0] || "должность не указана",
            del: u.deletion_mark
          }));
        const chief_i = this.employeesOfDept.findIndex(e => e.isChief);
        if (chief_i != -1) {
          this.employeesOfDept.unshift(
            this.employeesOfDept.splice(chief_i, 1)[0]
          );
        }
      } else {
        this.employeesOfDept = [];
      }
      // открываем само меню
      this.$refs.contextMenu.open(e, this.clickedDeptId);
    },
    onClick(data) {
      console.log(data);
      // alert('Clicked for ' + e.currentTarget.id);
    },
    nclick(e) {
      const id = e.toElement.parentNode.id;
      const pos = { x: e.pageX, y: e.pageY };
      console.log(`CLICKed on id: ${id}, at ${pos.x}:${pos.y}`);
      // если в момент клика есть перемещаемый отдел, текущий отдел делается его родителем
      if (this.replacingDeptId !== null) {
        // запоминаем данные
        const replacingNode = findNodeById(
          this.chartData,
          this.replacingDeptId
        );
        // удаляем из старого места
        this.orgChartObj.orgchart.removeNodes(
          document.getElementById(this.replacingDeptId)
        );
        delNodeById(this.chartData, this.replacingDeptId);
        // помещаем как подчиненный отдел
        let selectedNode = document.getElementById(id);
        let hasChild = selectedNode.parentNode.colSpan > 1;
        const nodeVals = [{ ...replacingNode }];
        if (!hasChild) {
          //let rel = nodeVals.length > 1 ? "110" : "100"; // одновременно несколько можно?
          this.orgChartObj.orgchart.addChildren(selectedNode, {
            children: nodeVals.map(item => {
              return { ...item, relationship: "100" };
            })
          });
          // добавляем в источник данных. И потом в базу
        } else {
          let lastChild = findNodeById(this.chartData, id).children.slice(
            -1
          )[0];
          lastChild = document.getElementById(lastChild.id);
          // надо найти крайнего и добавить соседа
          this.orgchart.addSiblings(lastChild, {
            siblings: nodeVals.map(item => {
              return { ...item, relationship: "110" };
            })
          });
        }
        this.replacingDeptId = null;
        this.replacingMessageVisible = false;
      }
      this.$emit("changeCurrDept", { id, text: e.toElement.innerText });
    },
    hide() {
      console.log(111);
      this.visible = false;
    },
    // eslint-disable-next-line no-unused-vars
    createdNode(n, d) {
      n.oncontextmenu = this.contextClick;
      n.onclick = this.nclick;
      if (!n.id) {
        n.id = d.id || d.Id;
      }
    },
    drawLevelLabels() {
      let cc = document.getElementById("chart-container");
      if (!cc) {
        console.log("Не найден блок диаграммы");
        return;
      }
      // выводим метки на полосах фона
      this.labels.map((l, i) => {
        let num = i + 1;
        const labelDiv = document.createElement("div");
        labelDiv.id = "label" + num;
        labelDiv.innerText = "CEO-" + num;
        labelDiv.classList.add("label", "label-" + num);
        cc.firstChild.append(labelDiv);
      });
    },
    cancelCreateDeptAction() {
      this.editDepartmentVisible = false;
    },
    createDeptAction() {
      const form = this.$refs.deptEditForm.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        console.log("Received values of form: ", values);
        form.resetFields();
        this.editDepartmentVisible = false;
        // добавляем узел
        let nodeVals = [
          {
            id: values.code || "dept" + Math.floor(Math.random() * 1001),
            name: values.title.trim()
          }
        ];
        let selectedNode = document.getElementById(
          document.getElementById("selected-node").dataset.node
        );
        // если есть подчиненные, то не добавляем. Улучшить потом - добавлять в правый конец
        let hasChild = selectedNode.parentNode.colSpan > 1;
        if (!hasChild) {
          let rel = nodeVals.length > 1 ? "110" : "100"; // одновременно несколько можно?
          this.orgChartObj.orgchart.addChildren(selectedNode, {
            children: nodeVals.map(item => {
              return { name: item.name, relationship: rel, id: item.id };
            })
          });
          // добавляем в источник данных. И потом в базу
        } else {
          let lastChild = findNodeById(
            this.chartData,
            this.clickedDeptId
          ).children.slice(-1)[0];
          lastChild = document.getElementById(lastChild.id);
          // надо найти крайнего и добавить соседа
          this.orgchart.addSiblings(lastChild, {
            siblings: nodeVals.map(item => {
              return { ...item, relationship: "110" };
            })
          });
        }
        addChildToId(this.chartData, this.clickedDeptId, { ...nodeVals[0] });
        this.save(); // сохраняем в БД
      });
    },
    changeDeptNameAction() {
      changeNameById(this.chartData, this.clickedDeptId, this.deptNewName);
      console.log(
        "name changed...",
        findNameById(this.chartData, this.clickedDeptId)
      );
      // this.orgChartObj.data = this.chartData; // не работает установка данных, надо вручную заголовок менять
      // this.orgChartObj.initOrgChart();
      // let dtSrc = document.getElementById(this.clickedDeptId).dataset.source // изменение датасета тоже не работает
      document.getElementById(
        this.clickedDeptId
      ).children[0].innerText = this.deptNewName;
      this.dialogDeptNewNameVisible = false;
      this.save();
    },
    async addEmployeesToDeptAction(selected_empls) {
      this.dialogDeptEmployeesVisible = false;
      const data = {
        client_id: this.currentClient.workspace,
        dept_id: this.clickedDeptId,
        users: selected_empls,
        headUser: ""
      };
      try {
        await this.$store.dispatch(SAVE_DEPT_USERS, data);
        this.$notification["success"]({
          message: "Сотрудник добавлен",
          description: `Сотрудник(и) добавлен(ы) в отдел`
        });
      } catch (error) {
        this.$notification["error"]({
          message: "Сотрудник не добавлен",
          description: `${error}`
        });
      }
      // this.$message('success'){}
      console.log(
        "Сотрудники отдела выбраны\n" + JSON.stringify(data, null, 2)
      );
    },
    deleteEmployee(d) {
      this.dialogDeptEmployeesVisible = false;
      this.$confirm({
        centered: true,
        title: "Подтвердите удаление сотрудника",
        content: "Сотрудник «" + d.name + "» будет удален",
        okType: "danger",
        okText: "ОК",
        cancelText: "Отменить",
        onOk: async () => {
          try {
            await this.$store.dispatch(DELETE_DEPT_USER, {
              client_id: this.currentClient.workspace,
              dept_id: this.clickedDeptId,
              user_id: d.id
            });
            this.$notification["success"]({
              message: "Сотрудник удален",
              description: `${d.name} удален из отдела`
            });
          } catch (error) {
            this.$notification["error"]({
              message: "Сотрудник не удален",
              description: `${error}`
            });
          }
          console.log(JSON.stringify(d, null, 2));
        },
        class: "test"
      });
    },
    async setEmployeeAsDeptChief(d) {
      if (!this.currentClient.workspace) {
        this.$error({
          title: "Ошибка",
          content: "Не задана текущая компания",
          centered: true
        });
        return;
      }
      this.dialogDeptEmployeesVisible = false;
      const data = {
        client_id: this.currentClient.workspace,
        dept_id: this.clickedDeptId,
        user_id: d.id
      };
      try {
        await this.$store.dispatch(EDIT_DEPT_USER, data);
        this.$notification["success"]({
          message: "Руководитель установлен",
          description: `Руководитель отдела теперь ${d.name}`
        });
      } catch (error) {
        this.$notification["error"]({
          message: "Ошибка выбора руководителя",
          description: `${error}`
        });
      }
    },

    restoreStructure() {
      console.log(`restore scale`);
      document.getElementsByClassName("orgchart")[0].style.transform = "";
      // после добавления отдела почему то создается еще один элемент orgchart и перестает работать
      // this.orgchart.chart.style.transform = "";
      //this.orgChartObj.initOrgChart();
    },
    zoom(val) {
      const orgchart = document.getElementsByClassName("orgchart")[0];
      if (val == 0) {
        this.zoomLevel = 0;
        orgchart.style.transform = "";
        return;
      }
      const newZoom = parseFloat(this.zoomLevel || 1) + val / 10;
      if (newZoom <= 0.2) return;
      this.zoomLevel = newZoom.toFixed(1);
      let trData = orgchart.style.transform
        .substring(7, orgchart.style.transform.length - 1)
        .split(", ");
      if (trData.length == 1) {
        trData = ["" + this.zoomLevel, "0", "0", "" + this.zoomLevel, "0", "0"];
      } else {
        trData[0] = trData[3] = this.zoomLevel;
      }
      console.log("zoom:", this.zoomLevel);
      orgchart.style.transform = "matrix(" + trData.join(", ") + ")";
    },
    async save() {
      try {
        await this.$store.dispatch(EDIT_STRUCTURE, {
          _id: this.struct_id,
          client_id: this.userData.result.client_id,
          orgTree: this.chartData // this.chartData
        });
        this.$notification["success"]({
          message: "Сохранено",
          description: "Структура сохранена"
        });
      } catch (error) {
        this.$notification["error"]({
          message: "Ошибка при сохранении",
          description: error.message
        });
      }
    },
    showAddEmployeeToDepartmentDialog() {
      this.dialogEmplMode = "select";
      this.dialogDeptEmployeesVisible = true;
      console.log("add empl to " + this.clickedDeptId);
    },
    showDelEmployeeOfDepartmentDialog() {
      this.dialogEmplMode = "delete";
      const dept_data = this.dept_users.find(
        e => e != null && e.dept_id == this.clickedDeptId
      );
      if (!dept_data || dept_data.users.length == 0) {
        this.$error({
          centered: true,
          title: "Ошибка",
          content: "В данном отделе нет сотрудников"
        });
        return;
      }
      this.dialogDeptEmployeesVisible = true;
    },
    showSelectDeptChiefDialog() {
      this.dialogEmplMode = "chief";
      this.dialogDeptEmployeesVisible = true;
    },
    addDepartmentOnClick() {
      const deptInfo = {
        id: this.clickedDeptId,
        text: findNameById(this.chartData, this.clickedDeptId)
      };
      this.editDepartmentVisible = true;
      this.dataForDepartment = { type: "new", dept: deptInfo };
      //console.log("Окно открыто, параметр ", param);
    },
    editDeptNameOnClick() {
      this.deptNewName = findNameById(this.chartData, this.clickedDeptId);
      this.dialogDeptNewNameVisible = true;
    },
    replaceDeptOnClick() {
      this.replacingMessageVisible = true;
      this.replacingDeptId = this.clickedDeptId;
      console.log(`replace dept`);
    },
    delDepartmentOnClick() {
      // проверка на головной отдел
      if (this.clickedDeptId == "ceo") {
        this.$error({
          centered: true,
          title: "Ошибка удаления отдела",
          content: "Головной отдел нельзя удалить"
        });
        return;
      }
      // проверка на наличие сотрудников
      const dept_data = this.dept_users.find(
        e => e != null && e.dept_id == this.clickedDeptId
      );
      if (dept_data && dept_data.users.length) {
        this.$error({
          centered: true,
          title: "Ошибка удаления отдела",
          content: `В отделе есть ${dept_data.users.length} сотрудник${this.skl(
            dept_data.users.length
          )}`
        });
        return;
      }
      // подтверждение удаления
      const name = findNameById(this.chartData, this.clickedDeptId);
      const orgchart = this.orgChartObj.orgchart;
      this.$confirm({
        centered: true,
        title: "Подтвердите удаление отдела",
        content: "Отдел «" + name + "» будет удален",
        okType: "danger",
        okText: "ОК",
        cancelText: "Отменить",
        onOk: () => {
          let selectedNode = document.getElementById(
            document.getElementById("selected-node").dataset.node
          );
          orgchart.removeNodes(selectedNode);
          delNodeById(this.chartData, this.clickedDeptId);
          this.$emit("changeCurrDept", {});
          this.save();
        },
        class: "test"
      });
    },
    cancelAddEmployeesToDeptAction() {
      this.dialogDeptEmployeesVisible = false;
    },
    skl(n) {
      // простое склонение по числам
      return ["ов", "", "а", "а", "а", "ов", "ов", "ов", "ов", "ов"][n % 10];
    }
  }
};
</script>

<style lang="scss">
.orgchart {
  background-size: 50px !important;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAADSCAIAAACHGQRkAAAA20lEQVR42u3RsQnCUAAA0fzsP6JgIw6gkKBFopYB+1zxboIHN5blPfUaWFhYgbCwsAphYWEVwsLCKoSFhVUICwurEBYWViEsLKxCWFhYhbCwsAphYWEVwsLCKoSFhVUICwurEBYWViEsLKxCWFhYhaqsx/M1xtmKY/s+jet93bb9bMmheR7jclv3lmr63vuxzmb8k2FhYQXCwsIqhIWFVQgLC6sQFhZWISwsrEJYWFiFsLCwCmFhYRXCwsIqhIWFVQgLC6sQFhZWISwsrEJYWFiFsLCwCmFhYRX6ACZTVVNncImeAAAAAElFTkSuQmCC");
  padding-left: 40px;

  .node {
    display: inline-table !important;
    margin: 0 20px !important;
    width: 200px !important;
    border: 1px solid lightsteelblue;
    border-radius: 4px;
    cursor: default;

    .title {
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      background-color: white !important;
      border-radius: 4px !important;
      width: 200px !important;
      height: 55px !important;
      font-family: "Source Sans Pro";
      font-size: 16px !important;
      font-weight: bold !important;
      color: #949494 !important;
      white-space: pre-line !important;
      padding: 5px;
    }
  }

  tr.lines .rightLine,
  tr.lines .leftLine {
    width: 100px !important;
  }
}

// .orgchart tr.lines .rightLine,
// .orgchart tr.lines .leftLine {
//   width: 100px !important;
// }

#chart-container {
  height: 520px !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
}

$top: 35px;
$between: 107px;

.label {
  position: absolute;
  left: 10px;
  font-size: 12pt;
  font-weight: bold;
  color: darkgray;

  @for $i from 0 through 4 {
    &-#{$i + 1} {
      top: $top + $between * $i;
    }
  }
}

/* настраиваем меню */
.v-context {
  min-width: 16rem;
}
.context-menu-item {
  .title {
    font-weight: bold;
    font-size: 12pt;
  }
  .subtitle {
    font-size: 11pt;
  }
  a {
    text-align: left;
    padding: 0.3rem 1.5rem;
  }
  i.anticon {
    margin-right: 10px;
  }
}
/* Отдельный пункт для добавления нового сотрудника в текущий блок */
.new-empl {
  background-color: lavender;
}
.del-empl {
  background-color: lightsteelblue;
}
.set-chief {
  background-color: gold;
}
// Добавить отдел
.add-dept {
  background-color: bisque;
}
// Изменить название
.ch-dept-name {
  background-color: khaki;
}
// Удалить отдел
.del-dept {
  background-color: darksalmon;
}
.replace-dept {
  background-color: lemonchiffon;
}
.chief-crown {
  position: absolute;
  top: 13px;
  right: 10px;
  font-size: 14pt;
  color: goldenrod;
}
div#zoom-buttons {
  position: absolute;
  left: 70px;
  top: 64px;
  display: flex;
  flex-direction: column;

  button {
    margin: 1px;
  }
}

div#replaceInfoMessage {
  position: absolute;
  top: 82px;
  left: 160px;
  font-size: 12pt;
  font-weight: bold;
  color: cornflowerblue;
}
</style>