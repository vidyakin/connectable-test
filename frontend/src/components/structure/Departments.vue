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
      v-if="orgChart && !loading"
      :data="orgChart"
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
    <vue-context ref="contextMenu">
      <li class="context-menu-item" v-for="empl of employeesOfDept(clickedDeptId)" :key="empl._id">
        <a @click.prevent="onClick(1)">
          <div class="title">Иван Иванов</div>
          <div class="subtitle">Начальник подразделения</div>
        </a>
      </li>
      <!-- <li class="context-menu-item">
        <a @click.prevent="onClick(2)">
          <div class="title">Петр Васильев</div>
          <div class="subtitle">Менеджер по продажам</div>
        </a>
      </li>
      <li class="context-menu-item">
        <a @click.prevent="onClick(3)">
          <div class="title">Наталья Нетопырева</div>
          <div class="subtitle">Бухгалтер</div>
        </a>
      </li>-->
      <li class="context-menu-item new-empl">
        <a @click.prevent="addEmployeeOnClick">
          <div class="title">
            <a-icon type="user-add" />Добавить сотрудника
          </div>
        </a>
      </li>
      <li class="context-menu-item add-dept">
        <a @click.prevent="addDepartmentOnClick">
          <div class="title">
            <a-icon type="usergroup-add" />Добавить отдел
          </div>
        </a>
      </li>
      <li class="context-menu-item replace-dept">
        <a @click.prevent="replaceDeptOnClick">
          <div class="title">
            <a-icon type="swap" />Перенести отдел
          </div>
        </a>
      </li>
      <li class="context-menu-item ch-dept-name">
        <a @click.prevent="editDeptNameOnClick">
          <div class="title">
            <a-icon type="edit" />Изменить название
          </div>
        </a>
      </li>
      <li class="context-menu-item del-dept">
        <a @click.prevent="delDepartmentOnClick">
          <div class="title">
            <a-icon type="delete" />Удалить отдел
          </div>
        </a>
      </li>
    </vue-context>
    <!-- Диалог редактирования отдела -->
    <department-edit-form
      ref="deptEditForm"
      :visible="editDepartmentVisible"
      :dataToShow="dataForDepartment"
      @create="createDeptAction"
      @cancel="cancelCreateAction"
    />
    <department-edit-employees
      :visible="dialogDeptEmployeesVisible"
      :dept-id="clickedDeptId || 'no'"
    />
    <!-- <pre>{{JSON.stringify(chartData,null,3)}}</pre> -->
    <!-- Диалог для изменения названия -->
    <a-modal
      title="Укажите новое название"
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
  GET_DEPT_USERS,
  EDIT_DEPT_USER,
  DELETE_DEPT_USER,
  CREATE_DEPT_USER
} from "@/store/structure/actions.type";

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
      dialogDeptNewNameVisible: false,
      dialogDeptDeleteVisible: false,
      dialogDeptEmployeesVisible: false,
      deptNewName: "",
      employeesOfDepts: {},
      replacingMessageVisible: false,
      replacingDeptId: null,
      struct_id: "",
      loading: true, // без нее не работает, it's a MAGIC!
      labels: ["CEO-1", "CEO-2", "CEO-3", "CEO-4", "CEO-5"],
      zoomLevel: 0,
      orgChartObj: {},
      orgchart: null,
      chartData: {
        id: "ceo1",
        name: "CEO",
        children: [
          {
            id: "depm",
            name: "Департамент маркетинга",
            children: [
              { id: "offlm", name: "Отдел оффлайн маркетинга" },
              {
                id: "onlm",
                name: "Отдел онлайн маркетинга",
                children: [
                  { id: "rrc", name: "Группа PPC" },
                  { id: "seo", name: "Группа SEO" },
                  { id: "fb", name: "Группа Facebook" }
                ]
              }
            ]
          },
          {
            id: "hr",
            name: "Департамент HR",
            children: [{ id: "preact", name: "Preact" }]
          },
          {
            id: "it",
            name: "Департамент IT",
            children: [{ id: "moon", name: "Moon" }]
          }
        ]
      }
    };
  },
  async beforeCreate() {
    try {
      await this.$store.dispatch(GET_STRUCTURE); // TODO: добавить (на бэке) отбор по текущему клиенту
    } catch (error) {
      console.error(`ошибка получения данных по структуре: ${error.message}`);
      return;
    }
    // Если структуры в базе нет, создаем головной элемент и сохраняем в базу
    if (this.structure.length == 0) {
      this.chartData = {
        id: "ceo",
        name: "Главное управление"
      };
      await this.$store.dispatch(SAVE_STRUCTURE, {
        client_id: "client1313",
        orgTree: this.chartData
      });
      await this.$store.dispatch(GET_STRUCTURE);
    }
    // 0-й элемент потому что пока что возвращается массив ( все схемы ), а будет с отбором по клиенту одна
    this.struct_id = this.structure[0]._id;
    this.chartData = this.structure[0].orgTree;
    console.log(`_id of structure is ${this.struct_id}`);
    this.loading = false; //  без этого не работает загрузка данных в схему!
    // заполняем пользователей
    this.dept_users.forEach(({ dept_id, users }) => {
      this.employeesOfDepts.dept_id = users;
    });
  },
  async created() {
    // await this.$store.dispatch(GET_ORGCHART, this.$store.getters.GET_CURR_CLIENT) // заполнение оргструктуры для текущего клиента
    // this.chartdata = await this.$store.getters.GET_CHARTDATA // получение данных о структуре
    //});
    // this.mountOrgChart();
  },
  async mounted() {
    //
  },
  updated() {
    this.$nextTick(function() {
      // Код, который будет запущен только после
      // обновления всех представлений
      this.$children.forEach(child => {
        if (child.orgchart !== undefined) {
          this.orgChartObj = child;
          this.orgchart = child.orgchart;
          this.drawLevelLabels();
          console.log(`Область диаграммы получена`);
        }
      });
    });
  },
  computed: {
    ...mapGetters(["userData", "user", "users", "structure", "dept_users"]),
    orgChart() {
      if (this.structure && this.structure.length) {
        //console.log(`orgTree: ${this.structure[0].orgTree}`);
        return this.structure[0].orgTree;
      } else return {};
    }
  },
  watch: {},
  methods: {
    datauser() {
      // TODO: переделать везде также. Может вообще отдельный геттер сделать с этой проверкой
      return this.userData ? this.userData.result : this.user;
    },
    // mountOrgChart() {
    //   this.$children.forEach(item => {
    //     item.orgchart !== undefined ? (this.orgChartObj = item) : null;
    //     item.orgchart !== undefined ? (this.orgchart = item.orgchart) : null;
    //   });
    // },
    employeesOfDept(n) {
      return [];
    },
    contextClick(e) {
      e.preventDefault();
      this.clickedDeptId = e.currentTarget.id;
      document.getElementById(
        "selected-node"
      ).dataset.node = this.clickedDeptId;
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
    cancelCreateAction() {
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
          client_id: "client_123123",
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
    addEmployeeOnClick() {
      this.dialogDeptEmployeesVisible = true;
      console.log("add empl to " + this.clickedDeptId);
    },
    addDepartmentOnClick() {
      const deptInfo = {
        id: this.clickedDeptId,
        text: findNameById(this.chartData, this.clickedDeptId)
      };
      this.editDepartmentVisible = true;
      this.dataForDepartment = { type: "new", dept: deptInfo };
      //console.log("Окно открыто, параметр ", param);
      //this.showAddDepartmentDialog({ type: "new", dept: deptInfo });
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
    /**
     * @param param Структура { type, dept }
     */
    showAddDepartmentDialog(param) {},
    /**
     * @param param Структура { type, dept }
     */
    showAddEmployeeToDepartmentDialog(param) {
      this.editDepartmentVisible = true;
      this.dataForDepartment = param;
      console.log("Окно открыто, параметр ", param);
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

  &-1 {
    top: $top + 0;
  }
  &-2 {
    top: $top + $between;
  }
  &-3 {
    top: $top + $between * 2;
  }
  &-4 {
    top: $top + $between * 3;
  }
  &-5 {
    top: $top + $between * 4;
  }
}

/* настраиваем меню */
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

div#zoom-buttons {
  position: absolute;
  left: 70px;
  top: 75px;

  button {
    margin: 3px;
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