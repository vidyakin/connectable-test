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
      :zoom="true"
      :pan="true"
      :toggleCollapse="false"
      :toggleSiblingsResp="true"
      :createNode="createdNode"
    ></vo-edit>
    <div v-show="false">
      <label class="selected-node-group"></label>
      <input type="text" id="selected-node" class="selected-node-group" />
    </div>
    <vue-context ref="contextMenu">
      <li class="context-menu-item">
        <a @click.prevent="onClick(1)">
          <div class="title">Иван Иванов</div>
          <div class="subtitle">Начальник подразделения</div>
        </a>
      </li>
      <li class="context-menu-item">
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
      </li>
      <li class="context-menu-item new-empl">
        <a @click.prevent="addEmployee">
          <div class="title">
            <a-icon type="user-add" />Добавить сотрудника
          </div>
        </a>
      </li>
      <li class="context-menu-item add-dept">
        <a @click.prevent="addDepartment">
          <div class="title">
            <a-icon type="usergroup-add" />Добавить отдел
          </div>
        </a>
      </li>
      <li class="context-menu-item ch-dept-name">
        <a @click.prevent="editDeptName">
          <div class="title">
            <a-icon type="edit" />Изменить название
          </div>
        </a>
      </li>
      <li class="context-menu-item del-dept">
        <a @click.prevent="delDepartment">
          <div class="title">
            <a-icon type="delete" />Удалить отдел
          </div>
        </a>
      </li>
    </vue-context>
    <!-- Диалог редактирования отдела -->
    <department-edit-form
      ref="deptEditForm"
      :visible="editVisible"
      :dataToShow="dataToShow"
      @cancel="handleCancel"
      @create="handleCreate"
    />
    <!-- Диалог для изменения названия -->
    <a-modal title="Укажите новое название" v-model="dialogDeptNewName" @ok="changeDeptName">
      <app-input
        v-model="deptNewName"
        placeholder="Название"
        label="Название"
        class="secondary form-input"
      />
    </a-modal>
    <!-- Диалог для добавления нового отдела -->
    <a-modal title="Укажите новое название" v-model="dialogDeptNewName" @ok="changeDeptName">
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
  EDIT_STRUCTURE
} from "@/store/structure/actions.type";

// external components
import { VoBasic, VoEdit } from "vue-orgchart";
import { VueContext } from "vue-context";
import "vue-context/src/sass/vue-context.scss";
import "vue-orgchart/dist/style.min.css";

// internal components
import DepartmentEditForm from "./DepartmentEditForm";
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
 * Ищем имя узла графа по id узла
 */
function findNodeById(graf, id) {
  if (graf.id == id) return graf;
  if (graf.children) {
    const finded = graf.children.find(node => node.id == id);
    if (finded != undefined) return finded;
    else
      return graf.children.reduce((res, node) => {
        const f = findNodeById(node, id);
        return f == {} ? res : f;
      }, {});
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

export default {
  name: "Departments",
  components: {
    VoEdit,
    VueContext,
    DepartmentEditForm,
    AppInput
  },
  data() {
    return {
      editVisible: false,
      dataToShow: undefined,
      clickedDeptId: null,
      dialogDeptNewName: false,
      dialogNewDept: false,
      deptNewName: "",
      struct_id: "",
      loading: true, // без нее не работает, it's a MAGIC!
      labels: ["CEO-1", "CEO-2", "CEO-3", "CEO-4", "CEO-5"],
      orgChartObj: {},
      orgchart: null,
      chartData2: {},
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
    await this.$store
      .dispatch(GET_STRUCTURE)
      .then(() => {
        // 0й элемент потому что пока что возвращается массив ( все схемы ), а будет с отбором по клиенту одна
        //this.chartData2 = this.$store.getters.structure[0].orgTree;
        this.struct_id = this.structure[0]._id;
        console.log(`_id of structure is ${this.struct_id}`);
        this.loading = false; //  без этого не работает загрузка данных в схему!
      })
      .then(() => {
        this.mountOrgChart();
        let cc = document.getElementById("chart-container");
        // выводим метки на полосах фона
        this.labels.map((l, i) => {
          let num = i + 1;
          const labelDiv = document.createElement("div");
          labelDiv.id = "label" + num;
          labelDiv.innerText = "CEO-" + num;
          labelDiv.classList.add("label", "label-" + num);
          cc.firstChild.append(labelDiv);
        });
      });
  },
  async created() {
    // await this.$store.dispatch(GET_ORGCHART, this.$store.getters.GET_CURR_CLIENT) // заполнение оргструктуры для текущего клиента
    // this.chartdata = await this.$store.getters.GET_CHARTDATA // получение данных о структуре
    //});
    // let cc = document.getElementById("chart-container");
    // if (!cc) {
    //   console.log("Не найден блок диаграммы");
    //   return;
    // }
    // this.mountOrgChart();
  },
  async mounted() {
    // mount chartdata
    // this.$nextTick(this.mountOrgChart());
    //this.orgChartObj._props.data = this.orgChart;
    //this.orgChartObj.initOrgChart();
  },
  computed: {
    ...mapGetters(["userData", "user", "structure"]),
    orgChart() {
      if (this.structure && this.structure.length) {
        //console.log(`orgTree: ${this.structure[0].orgTree}`);
        return this.structure[0].orgTree;
      } else return {};
    }
  },
  watch: {
    // chartData2(response) {
    //   this.chartData2 = response;
    // }
  },
  methods: {
    datauser() {
      // TODO: переделать везде также. Может вообще отдельный геттер сделать с этой проверкой
      return this.userData ? this.userData.result : this.user;
    },
    mountOrgChart() {
      this.$children.forEach(item => {
        item.orgchart !== undefined ? (this.orgChartObj = item) : null;
        item.orgchart !== undefined ? (this.orgchart = item.orgchart) : null;
      });
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
    /**
     * @param param Структура { type, dept }
     */
    handleShow(param) {
      this.editVisible = true;
      this.dataToShow = param;
      console.log("Окно открыто, параметр ", param);
    },
    handleCancel() {
      this.editVisible = false;
    },
    handleCreate() {
      const form = this.$refs.deptEditForm.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        console.log("Received values of form: ", values);
        form.resetFields();
        this.editVisible = false;
        // добавляем узел
        let nodeVals = [
          {
            id: values.code || "dept" + Math.floor(Math.random() * 1001),
            name: values.title
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
              return { name: item.name, relationship: rel, Id: item.id };
            })
          });
        } else {
          const el = findNodeById(this.chartData, this.clickedDeptId);
          console.log(`node: ${el.name}`);
        }
        // добавляем в источник данных. И потом в базу
        addChildToId(this.chartData, this.clickedDeptId, { ...nodeVals[0] });
      });
    },
    restoreStructure() {
      console.log(`restore scale`);
      this.orgchart.chart.style.transform = "";
      this.orgChartObj.initOrgChart();
    },
    async save() {
      try {
        await this.$store.dispatch(EDIT_STRUCTURE, {
          _id: this.struct_id,
          client_id: "client_123123",
          orgTree: this.orgChart
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
    addEmployee() {
      console.log("add empl to " + this.clickedDeptId);
    },
    addDepartment() {
      const deptInfo = {
        id: this.clickedDeptId,
        text: findNameById(this.chartData, this.clickedDeptId)
      };
      this.handleShow({ type: "new", dept: deptInfo });
      console.log("add dept to" + this.clickedDeptId);
    },
    editDeptName() {
      this.deptNewName = findNameById(this.chartData, this.clickedDeptId);
      this.dialogDeptNewName = true;
      console.log("edit dept: " + this.clickedDeptId);
    },
    delDepartment() {
      console.log("del dept: " + this.clickedDeptId);
    },
    changeDeptName() {
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
      this.dialogDeptNewName = false;
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
</style>