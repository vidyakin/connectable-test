<template>
  <a-modal
    closable
    destroyOnClose
    wrapClassName="add-event-modal"
    :visible="visible"
    :footer="null"
    @cancel="close"
    :bodyStyle="{height:'auto', padding:'0'}"
  >
    <div slot="title">
      <h3>{{ event == undefined ? "Новое событие" : "Изменение события" }}</h3>
    </div>
    <a-form-model ref="eventForm" :model="theform" :rules="rules" layout="vertical">
      <!-- Название события -->
      <a-row>
        <a-col :span="24">
          <a-form-model-item prop="name">
            <app-input
              v-model="theform.name"
              placeholder="Название"
              label="Название"
              class="secondary form-input"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <!-- Дата и рамки события -->
      <a-row>
        <a-col :span="10">
          <div class="label">Дата события</div>
          <a-form-model-item prop="dateEvent">
            <a-date-picker v-model="theform.dateEvent" :locale="locale" placeholder="Дата" />
          </a-form-model-item>
        </a-col>
        <a-col :span="7">
          <div class="label">Начало в:</div>
          <a-form-model-item prop="timeEvent">
            <a-time-picker
              class="time-picker"
              v-model="theform.timeEvent"
              format="HH:mm"
              :minuteStep="10"
              :locale="locale"
              placeholder="Время"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="7">
          <div class="label">Окончание в:</div>
          <a-form-model-item prop="timeTo">
            <a-time-picker
              class="time-picker"
              v-model="theform.timeTo"
              format="HH:mm"
              :minuteStep="10"
              :locale="locale"
              placeholder="Время"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <!-- Участники события -->
      <a-row>
        <a-col :span="24">
          <div class="label">Пригласить участников</div>
          <a-form-model-item prop="members">
            <a-select
              v-model="theform.members"
              labelInValue
              mode="multiple"
              placeholder="Выберите пользователей"
              style="width: 100%"
              :filterOption="false"
              @search="search"
              @change="onMembersTextChange"
              :notFoundContent="'Пользователь не найден'"
            >
              <a-select-option
                v-for="d in usersData"
                :key="d._id"
              >{{d.firstName + ' ' + d.lastName}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <!-- Комментарий -->
      <a-row>
        <a-col :span="24">
          <a-form-model-item class="no-margin" prop="comment">
            <app-input
              v-model="theform.comment"
              placeholder="Дополнительная информация"
              label="Комментарий"
              class="secondary form-input"
            ></app-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <!-- Цвет карточки события -->
      <a-row>
        <a-col :span="24">
          <div class="event-color">
            <label>Цвет</label>
            <svg
              viewBox="0 0 20 20"
              height="30px"
              width="30px"
              v-for="color in colors"
              @click="setCurrentColor(color)"
              :key="color.color"
            >
              <circle cx="10" cy="10" r="10" :fill="color.color" />
              <circle
                cx="10"
                cy="10"
                r="7"
                :fill="theform.color.color === color.color ? color.color : 'white'"
              />
            </svg>
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-model-item>
            <div class="action">
              <a-button @click="createEvent">{{!event ? "Создать событие" : "Сохранить изменения" }}</a-button>
            </div>
          </a-form-model-item>
        </a-col>
      </a-row>
      <!-- <div>
        {{ JSON.stringify(this.theform, null, 3)}}
      </div>-->
    </a-form-model>
  </a-modal>
</template>

<script>
import store from "../../store";
import { mapGetters } from "vuex";
import moment, { duration } from "moment";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";

import {
  CREATE_EVENT,
  UPDATE_EVENT,
  GET_USERS
} from "../../store/user/actions.type";
import { GET_NOTIFICATION } from "../../store/notification/actions.type";

import AppInput from "../common/Input";

export default {
  props: {
    visible: Boolean,
    close: Function,
    day: Object,
    event: Object
  },
  components: {
    AppInput
  },

  data() {
    return {
      theform: {
        name: "",
        dateEvent: moment(),
        timeEvent: moment(),
        timeTo: moment(),
        members: [],
        comment: "",
        color: "#ff0000"
      },
      isEdit: false,
      modalStyle: {
        height: "auto",
        padding: "5px"
      },
      colors: [
        { color: "#ff0000" },
        { color: "#ffaa00" },
        { color: "#e6d700" },
        { color: "#00d43f" },
        { color: "#00dfc9" },
        { color: "#3b86ff" },
        { color: "#8e55d9" }
      ],
      // currentColor: {
      //   color: '#ff0000',
      // },
      usersData: [],
      selectedItems: [],
      date: moment(),
      statusEmailSend: false,
      timeError: "",
      timeErrorHelp: "",
      rules: {
        name: [
          {
            required: true,
            message: "Название не может быть пустым!",
            transform: this.tr,
            trigger: "blur"
          },
          {
            max: 100,
            message: "Максимальная длина заголовка - 100 символов",
            transform: this.tr,
            trigger: "blur"
          },
          {
            min: 5,
            message: "Слишком короткое название, введите больше 5 символов",
            transform: this.tr,
            trigger: "blur"
          }
        ],
        dateEvent: [
          { required: true, message: "Нужно указать дату", trigger: "blur" },
          { validator: this.validDate }
        ],
        timeEvent: [
          { required: true, message: "Нужно указать время", trigger: "blur" },
          { validator: this.validTime }
        ],
        timeTo: [{ validator: this.validTimeTo }],
        members: [
          {
            required: true,
            message: "Нужно выбрать участников",
            trigger: "blur"
          }
        ]
      }
      //userInfo: (store.getters.userData ? store.getters.userData : store.getters.user),
    };
  },
  /**
   * МЕТОДЫ КОМПОНЕНТА
   */
  methods: {
    setCurrentColor(color) {
      this.theform.color = color;
    },
    tr(v) {
      return v === undefined ? "" : v.trim();
    },
    validDate(rule, d, callback) {
      if (d.isBefore(moment().startOf("day"))) {
        callback("Дата не может быть в прошлом");
      } else {
        callback();
      }
    },
    validTime(rule, t, callback) {
      if (t) {
        const hour = t.hour();
        if (hour > 19 || hour < 8) {
          // TODO: сделать настройку в компании "Рабочие часы" и определять по ней
          callback(new Error("Выберите рабочие часы"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    validTimeTo(rule, t, callback) {
      // проверяем только время, т.к. предполагается что дата та же во время инициализации нового события
      if (this.theform.timeTo.isBefore(this.theform.timeEvent)) {
        callback("Неверное время окончания");
      } else {
        callback();
      }
    },

    /**
     * Создание события по кнопке "Создать"
     */
    async createEvent(e) {
      e.preventDefault();
      const usersData = this.usersData; // чтоб не потерять this
      const blancDate = moment()
        .hours(12)
        .minutes(0)
        .seconds(0);

      // формируем правильные границы события на основе полей формы
      let start = moment(this.theform.dateEvent);
      let end = moment(this.theform.dateEvent);
      const t1 = this.theform.timeEvent;
      const t2 = this.theform.timeTo;
      start
        .hour(t1.hour())
        .minute(t1.minutes())
        .seconds(0)
        .utcOffset(3); // set H&m&s from time field to date field
      end
        .hour(t2.hour())
        .minutes(t2.minutes())
        .seconds(0)
        .utcOffset(3);
      const duration = end.diff(start, "minutes") + " minutes";
      console.log(`event starts at: ${start.format()}`);

      const valid = await this.$refs.eventForm.validate(); // (async valid => {
      if (!valid) {
        console.log(`Form not valid`);
        return;
      }
      const keys = this.selectedItems.map(e => e.key);
      // Выбираем емейлы указанных в списке лиц
      const attendees = usersData
        .filter(ud => keys.includes(ud._id))
        .map(e => ({ email: e.email }));
      //this.createButtonSpinning = true;
      // Объект для передачи в Монго
      const event = {
        name: this.theform.name,
        date: start,
        end,
        duration,
        comment: this.theform.comment,
        color: this.theform.color.color,
        userId: this.userInfo.result._id,
        userEmail: this.userInfo.result.email,
        emailSend: this.statusEmailSend,
        attendees: this.selectedItems ? attendees : ""
      };
      if (this.isEdit) {
        event._id = this.event._id;
      }
      console.log(`event is ${JSON.stringify(event, null, 3)}`);
      //const calendar = google.calendar({version: 'v3', auth:""});
      await this.$store.dispatch(
        this.isEdit ? UPDATE_EVENT : CREATE_EVENT,
        event
      );
      //.finally(() => {
      // this.form.setFieldsValue({
      //   name: '',
      //   dateEvent: blancDate,
      //   timeEvent: blancDate,
      //   comment: ''
      // });
      this.close();
      //});
      //});
    },
    onMembersTextChange(value) {
      this.selectedItems = value;
      // Object.assign(this, {
      //   value,
      //   data: [],
      // });
      // this.selectVal = value;
    },
    search(text) {
      text = text.toLowerCase();
      this.usersData = this.users.filter(el => {
        return (
          el.firstName.toLowerCase().indexOf(text) !== -1 ||
          el.lastName.toLowerCase().indexOf(text) !== -1 ||
          (el.firstName + " " + el.lastName).toLowerCase().indexOf(text) !==
            -1 ||
          (el.lastName + " " + el.firstName).toLowerCase().indexOf(text) !== -1
        );
      });
    }
  },
  /**
   * ВЫЧИСЛЯЕМЫЕ СВОЙСТВА
   */
  computed: {
    ...mapGetters(["user", "userData", "users", "notification"]),
    userInfo() {
      return this.userData ? this.userData : this.user;
    },
    locale() {
      let loc = { ...locale };
      loc.dateFormat = "D MMMM YYYY г.";
      loc.lang.monthFormat = "MMMM";
      return loc;
    }
  },
  /**
   * ХУКИ ЖИЗНЕННОГО ЦИКЛА
   */
  beforeCreate() {
    //this.form = this.$form.createForm(this, { name: 'eventCreatingForm' });
  },
  created() {
    if (this.userData && this.userData.result) {
      this.$store.dispatch(GET_NOTIFICATION, this.userData.result._id);
      console.log(`created: ${this.notification}`);
    } else {
      console.log(`AddEventModal.vue->created(): No userData.result here`);
    }
  },
  watch: {
    notification(notification) {
      this.statusEmailSend =
        notification && notification.userId == store.getters.userData.result._id
          ? notification.publications
          : false;
    },
    visible() {
      if (this.visible) {
        this.isEdit = !!this.event; // признак редактирования события
        console.log(`Форма открылась`);
        if (this.isEdit) {
          const emails = this.event.attendees.map(att => att.email);
          this.theform = {
            name: this.event.name,
            dateEvent: moment(this.event.date),
            timeEvent: moment(this.event.date),
            timeTo: moment(this.event.end),
            color: { color: this.event.color },
            // ищем юзеров с емейлами из списка и создаем массив объектов {key,label}
            members: this.users
              .filter(u => emails.includes(u.email))
              .map(e => ({
                key: e._id,
                label: `${e.firstName} ${e.lastName}`
              })),
            comment: this.event.comment
          };
          this.selectedItems = this.theform.members;
        } else {
          this.day
            .hours(12)
            .minutes(0)
            .seconds(0);
          this.theform = {
            name: "",
            dateEvent: this.day,
            timeEvent: moment(this.day), // если просто this.day, то присваивает по ссылке
            timeTo: moment(),
            members: [],
            comment: "",
            color: "#ff0000"
          };
          this.theform.timeTo = moment(this.day).add(1, "hour");
        }
      }
    }
  },
  async mounted() {
    await this.$store.dispatch(GET_USERS);
    this.usersData = this.users;
    //console.log('userData: ',JSON.stringify(this.usersData,null,2))
  }
};
</script>

<style lang="scss">
.add-event-modal {
  .ant-modal-content {
    padding: 1.5rem;
    width: 37rem;
    height: 38rem;
    // max-width: 100%;
  }

  .ant-modal-header {
    border: 0;
  }

  h3 {
    font-weight: bold;
    text-align: center;
  }

  label {
    font-weight: bold;
  }

  .action {
    margin-top: 1rem;
    text-align: center;

    .ant-btn {
      border-radius: 4px;
      background-color: #3b86ff;
      color: #ffffff;
    }
  }
  // .ant-modal-content {
  //   padding: 2rem;
  //   width: 30rem;
  //   height: auto;
  // }
}

.ant-form-item.no-margin {
  margin-bottom: 0;
}

.no-bottom-margin {
  margin-bottom: 5px;
}

.event-date-time {
  display: flex;

  .event-date {
    flex: 3;
    padding-right: 2rem;

    span {
      width: 100% !important;
    }
  }

  .event-time {
    flex: 1;
  }
}

.time-picker.ant-time-picker {
  width: 130px;
}

.event-color {
  display: flex;
  margin-top: 1rem;
  line-height: 26px;
  height: 26px;

  label {
    margin-right: 2rem;
  }

  svg {
    cursor: pointer;
    margin-right: 0.5rem;
  }
}

.form-line {
  margin-top: 0.6rem;
}
</style>