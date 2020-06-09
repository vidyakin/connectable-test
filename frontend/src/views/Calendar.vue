<template>
  <div class="calendar">
    <app-add-event-modal
      :visible="createVisible"
      :close="createClose"
      :day="currentDay"
      :event="selectedEvent"
    ></app-add-event-modal>
    <div class="calendar-header">
      <div class="calendar-name">Календарь</div>
      <a-button @click="createOpen(null)">Создать событие</a-button>
    </div>
    <div class="calendar-body">
      <a-calendar v-model="currentDay" :locale="locale" @select="createOpen(null)">
        <template slot="dateCellRender" slot-scope="currDate">
          <!-- <div v-for="val in getEventsForThisMonth().filter(ev => currDate.isSame(ev.date, 'day'))" :key="val._id"> -->
          <div v-for="val in getEventsForDay(currDate)" :key="val._id">
            <div
              class="event-wrapper"
              :style="{
                'background-color' : val.color,
                'border-color': val.userId === userData.result._id ? 'blue' : val.color,
                'border-width': val.userId === userData.result._id ? 2 : 1
              }"
            >
              <div class="event-name">{{getTime(val)}} {{val.name}}</div>
              <div class="event-actions">
                <a-icon
                  :type="val.userId === userData.result._id ? 'form' : 'eye'"
                  @click.stop="createOpen(val)"
                />
                <a-popconfirm
                  title="Подтверите удаление события"
                  okText="Подтверждаю"
                  cancelText="Отмена"
                  @confirm="deleteEvent(val._id)"
                  @visibleChange="deleteConfirmVisChange"
                >
                  <a-icon slot="icon" type="question-circle-o" style="color: red" />
                  <a-icon
                    type="delete"
                    @click.stop="startDelete"
                    v-if="val.userId === userData.result._id"
                  ></a-icon>
                </a-popconfirm>
              </div>
            </div>
          </div>
        </template>
      </a-calendar>
    </div>
    <div class="months-events">
      <div class="month-event">
        <div class="month-name">{{getMonthName()}}</div>
        <div class="event-wrap" v-if="getEventsForThisMonth().length">
          <div
            class="event"
            v-for="event in getEventsForThisMonth()"
            :style="{'border-color':event.color}"
            :key="event._id"
          >
            <div class="event-date">
              <div class="event-date-day">{{getDayFromDate(event.date).day}}</div>
              <div class="event-date-weekday">{{getDayFromDate(event.date).weekday}}</div>
            </div>
            <div class="event-name">
              <div>{{event.name}}, {{event.comment}}</div>
              <div class="event-time">{{event.time}}</div>
            </div>
            <div class="event-action">
              <a-popover title="Действия с событием" trigger="click">
                <template slot="content">
                  <a-icon type="delete" @click="deleteEvent(event._id)"></a-icon>
                </template>
                <a-button icon="menu"></a-button>
              </a-popover>
            </div>
          </div>
        </div>
        <div class="event-wrap" v-else>
          <div class="event no-events">Пока нет запланированных событий</div>
        </div>
      </div>
      <div class="month-event">
        <div class="month-name">{{getNextMonthName()}}</div>
        <div class="event-wrap" v-if="getEventsForNextMonth().length">
          <div
            class="event"
            v-for="event in getEventsForNextMonth()"
            :style="{'border-color':event.color}"
            :key="event._id"
          >
            <div class="event-date">
              <div class="event-date-day">{{getDayFromDate(event.date).day}}</div>
              <div class="event-date-weekday">{{getDayFromDate(event.date).weekday}}</div>
            </div>
            <div class="event-name">
              <div>{{event.name}}, {{event.comment}}</div>
              <div class="event-time">{{event.time}}</div>
            </div>
            <div class="event-action">
              <a-popover title="Действия с событием">
                <template slot="content">
                  <a-icon type="delete" @click="deleteEvent(event._id)"></a-icon>
                </template>
                <a-button icon="menu"></a-button>
              </a-popover>
            </div>
          </div>
        </div>
        <div class="event-wrap" v-else>
          <div class="event no-events">Пока нет запланированных событий</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import store from "../store";
import { mapGetters } from "vuex";
import {
  DELETE_EVENT,
  GET_EVENTS,
  GET_EVENTS_BY_CLIENT
} from "../store/user/actions.type";

import moment from "moment";
import "moment/locale/ru";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";

import AppAddEventModal from "../components/modal/AddEventModal.vue";

export default Vue.extend({
  data() {
    return {
      currentDay: moment(),
      editMode: false,
      selectedEvent: null,
      createVisible: false,
      locale: locale,
      deleting: false // хак для подавления срабатывания @select на ячейке датыы
    };
  },
  // was - beforeCreate
  async created() {
    moment.locale("ru");

    if (this.userIsAdmin) {
      await this.$store.dispatch(
        GET_EVENTS_BY_CLIENT,
        this.currentClient.workspace
      );
    } else {
      await this.$store.dispatch(GET_EVENTS, this.userData.result.email);
    }

    //let april_events = this.getEventsForMonth(moment().subtract(1, "M"));

    if (this.userData.result.outlookId) {
      console.log("beforeCreate get events");
      const a = Vue.axios
        .get("/api/outlook/event")
        .then(response => {
          console.log("beforeCreate resp:", response);
        })
        .catch(e => {
          console.log("beforeCreate error:", e);
        });
      return a;
    } else if (this.userData.result.googleId) {
      //
    }
  },
  components: {
    AppAddEventModal
  },
  computed: {
    ...mapGetters(["user", "events", "userData", "currentClient"]),
    // userInfo() {
    //   return this.userData.result ? this.userData.result : this.user.result;
    // },
    userIsAdmin() {
      return this.$can("read", {
        accessEmail: this.userData.result.email,
        __type: "Admin"
      });
    },
    months() {
      return "Январь.Февраль.Март.Апрель.Май.Июнь.Июль.Август.Сентябрь.Октябрь.Ноябрь.Декабрь".split(
        "."
      );
    },
    weekday() {
      return "ПН.ВТ.СР.ЧТ.ПТ.СБ.ВС".split(".");
    }
  },
  watch: {
    user(user) {
      if (user) {
        this.$store.dispatch(GET_EVENTS, user.email);
      }
    }
  },
  methods: {
    createClose() {
      this.createVisible = false;
    },
    startDelete() {
      this.deleting = true;
      setTimeout(() => {
        this.deleting = false;
      }, 500);
    },
    createOpen(event) {
      if (this.deleting) return;

      const dayEvents = this.events.filter(e =>
        moment(e.date).isSame(this.currentDay, "day")
      );
      this.editMode = !!event;
      if (this.editMode) {
        this.selectedEvent = event;
        this.createVisible = true;
      } else {
        this.selectedEvent = undefined;
      }

      if (this.currentDay.isBefore(moment().startOf("day"))) {
        if (dayEvents.length) {
          //console.log(`В этот день ${dayEvents.length} событий`);
        } else {
          this.$notification["error"]({
            message: "Ошибка",
            description: "Нельзя создать событие в прошедшую дату"
          });
        }
      } else {
        this.createVisible = true;
      }
    },
    deleteConfirmVisChange() {},
    isBeforeToday(c) {
      return c.isBefore(moment().startOf("day"));
    },
    getEventsForDay(currDate) {
      const events = !this.events
        ? []
        : this.events.filter(ev =>
            moment(currDate).isSame(moment(ev.date), "day")
          );
      return events;
    },
    getEventsForMonth(month) {
      return (
        this.events &&
        this.events.find(event => {
          return moment(event.date).isSame(month, "month");
        })
      );
    },
    getMonthName() {
      return this.months[moment().month()];
    },
    getEventsForThisMonth() {
      return !this.events
        ? []
        : this.events &&
            this.events.filter(event => {
              if (event && event.userId === this.userData.result._id) {
                return moment(event.date).isSame(moment(), "month");
              }
            });
    },
    getNextMonthName() {
      if (moment().month() === 11) {
        return this.months[0];
      } else {
        return this.months[moment().month() + 1];
      }
    },
    getEventsForNextMonth() {
      return (
        (this.events &&
          this.events.filter(event => {
            if (event && event.userId === this.userData.result._id) {
              return moment(event.date).isSame(moment().add(1, "M"), "month");
            }
          })) ||
        []
      );
    },
    getEventsForPrevMonth() {
      return (
        (this.events &&
          this.events.filter(event => {
            return moment(event.date).isSame(
              moment().subtract(1, "M"),
              "month"
            );
          })) ||
        []
      );
    },
    getDayFromDate(date) {
      return {
        weekday: this.weekday[moment(date).isoWeekday() - 1],
        day: moment(date).date()
      };
    },
    getTime(v) {
      return v.time
        ? moment(v.time).format("HH:mm")
        : moment(v.date).format("HH:mm");
    },
    deleteEvent(id) {
      this.$store.dispatch(DELETE_EVENT, id).then(() => {
        this.$notification["success"]({
          message: "Событие удалено",
          placement: "topRight"
        });
      });
    }
  }
});
</script>

<style lang="scss">
.months-events {
  display: flex;
  margin: 30px 0;

  @media (max-width: 567px) {
    flex-wrap: wrap;
    margin-bottom: 0;
  }

  .month-name {
    height: 32px;
    font-size: 25px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 0.96;
    letter-spacing: normal;
    color: #000000;

    @media (max-width: 567px) {
      flex: 1 0 100%;
    }
  }

  .event-time {
    height: 14px;
    font-size: 11px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.18;
    letter-spacing: normal;
    text-align: left;
    color: #808495;
    margin-top: 0.5rem;
  }
}

.is-hide-img-header {
  .calendar {
    height: calc(100vh - 50px);
  }
}
.calendar {
  padding: 30px;
  background-color: #f0f0f7;
  height: calc(100vh - 210px);
  overflow: auto;

  @media (max-width: 767px) {
    padding: 20px 15px;
  }

  &-header {
    display: flex;
    margin: 0 0 30px;
    justify-content: space-between;

    @media (max-width: 567px) {
      flex-wrap: wrap;
    }

    .ant-btn {
      border-radius: 4px;
      background-color: #3b86ff;
      color: #ffffff;
    }
  }

  &-name {
    font-size: 1.5rem;
    line-height: 32px;
    color: #43425d;
    text-align: left;

    @media (max-width: 567px) {
      flex: 1 0 100%;
      margin-bottom: 15px;
    }
  }

  .calendar-body {
    background-color: white;
    margin: 30px 0;

    @media (max-width: 767px) {
      width: 100%;
      padding: 15px;
      white-space: nowrap;
      overflow-x: auto;
    }

    .event-wrapper {
      /* margin-top: 50%;*/
      border-radius: 0.25rem;
      border: 1px solid;
      display: flex;
      justify-content: space-between;
      padding: 2px;
      align-items: center;

      .event-name {
        font-size: 0.75rem;
        color: white;

        // &:hover { // подсветка текста тенью
        //   text-shadow: 2px 3px 3px black;
        // }
      }
      .event-actions .anticon {
        margin-left: 3px;
      }
      .event-actions .anticon:hover {
        color: white;
      }
    }
  }
}

.month-event {
  flex: 1;
  margin-right: 2rem;
  max-width: 100%;

  @media (max-width: 567px) {
    flex-wrap: wrap;
    margin-right: 0;
  }
  .no-events {
    flex-direction: column;
  }
  .event {
    display: flex;
    /*height: 80px;*/
    border-radius: 4px;
    background-color: #f5f6fa;
    margin-bottom: 10px;
    padding: 1rem 1.5rem;
    border-left: 4px solid transparent;

    &-date {
      &-weekday {
        width: 16px;
        height: 18px;
        font-size: 14px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 0.93;
        letter-spacing: normal;
        text-align: left;
        color: #808495;
      }

      &-day {
        width: 25px;
        height: 31px;
        font-size: 24px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 1;
        letter-spacing: normal;
        text-align: left;
        color: #000000;
      }
    }

    &-name {
      /*height: 35px;*/
      font-size: 13px;
      font-weight: bold;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.38;
      letter-spacing: normal;
      text-align: left;
      color: #4d565c;
      margin-left: 2rem;
      padding-left: 2rem;
      width: calc(100% - 5rem);
      position: relative;
      word-break: break-word;
    }
    &-name:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      height: 50px;
      width: 1px;
      background-color: rgba(128, 132, 149, 0.6);
    }

    &-action {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
</style>