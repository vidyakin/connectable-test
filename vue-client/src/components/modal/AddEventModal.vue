<template>
  <a-modal
    closable
    destroyOnClose
    wrapClassName="add-event-modal"
    :visible="visible"
    :footer="null"
    @cancel="close"
  >
    <div slot="title">
      <h3>Новое событие</h3>
    </div>
    <div class="event-name">
      <label>Название</label>
      <a-input v-model="name"></a-input>
    </div>
    <div class="event-date-time">
      <div class="event-date">
        <label>Дата</label>
        <div>
          <a-date-picker v-model="date"></a-date-picker>
        </div>
      </div>
      <div class="event-time">
        <label>Время</label>
        <div>
          <a-time-picker format="HH:mm" @change="changeTime"></a-time-picker>
        </div>
      </div>
    </div>
    <div class="event-name">
    <a-form-item>
      <label>Пригласить участника</label>
      <a-select v-decorator="['members']"
                labelInValue
                mode="multiple"
                placeholder="Выберите пользователей"
                style="width: 100%"
                :filterOption="false"
                @search="search"
                @change="handleChange"
                :notFoundContent="'Пользователя не найдено'"
      >
        <a-select-option v-for="d in data" :key="d.email">{{d.firstName + ' ' + d.lastName}}</a-select-option>
      </a-select>
    </a-form-item>
    </div>
    <!--<div class="event-name">
      <label>Продолжительность</label>

      <a-date-picker v-model="duration"></a-date-picker>
    </div>-->
    <div class="event-name">
      <label>Комментарий</label>
      <a-input v-model="comment"></a-input>
    </div>
    <div class="event-color">
      <label>
        Цвет
      </label>
      <svg viewBox="0 0 20 20" height="30px" width="30px" v-for="color in colors" @click="setCurrentColor(color)">
        <circle cx="10" cy="10" r="10" :fill="color.color">
        </circle>
        <circle cx="10" cy="10" r="7" :fill="currentColor.color === color.color ? color.color : 'white'">
        </circle>
      </svg>
    </div>
    <div class="action">
      <a-button @click="createEvent">Создать событие</a-button>
    </div>
  </a-modal>
</template>

<script>
  import {mapGetters} from 'vuex';
  import AppInput from '../common/Input';
  import moment from 'moment';
  import {CREATE_EVENT, UPDATE_USER_INFO, GET_USERS} from '../../store/user/actions.type';
  import store from '../../store';
  import {GET_NOTIFICATION} from '../../store/notification/actions.type';
  export default {
    data() {
      return {
        colors: [
          {color: '#ff0000'},
          {color: '#ffaa00'},
          {color: '#e6d700'},
          {color: '#00d43f'},
          {color: '#00dfc9'},
          {color: '#3b86ff'},
          {color: '#8e55d9'},
        ],
        currentColor: {
          color: '#ff0000',
        },
        name: '',
        data: [],
        selectVal: '',
        date: moment(),
        time: moment.relTime,
        comment: '',
        statusEmailSend: false,
        userInfo: (store.getters.userData ? store.getters.userData : store.getters.user),
      };
    },
    methods: {
      setCurrentColor(color) {
        this.currentColor = color;
      },

      createEvent() {
        const {name, date, time, comment, currentColor, userInfo} = this;
        const event = {name, date, time, comment, color: currentColor.color};
        event.userId = this.userInfo.result._id;
        event.userEmail = this.userInfo.result.email;
        event.emailSend = this.statusEmailSend;
        event.attendees = (this.selectVal ? this.selectVal.map(el => {
          return {'email': el.key}
        }) : '');

        this.$store.dispatch(CREATE_EVENT, event)
          .finally(() => {
            this.name = '';
            this.date = moment();
            this.time = moment.relTime;
            this.comment = '';
            this.close();
          });

      },
      changeTime(time, timeString) {
        this.time = timeString;
      },
      handleChange(value) {
        Object.assign(this, {
          value,
          data: [],
        });
        this.selectVal = value;
      },
      search(text) {
        text = text.toLowerCase();
        this.data = this.users.filter(el => {
          return (
                  el.firstName.toLowerCase().indexOf(text) !== -1 ||
                  el.lastName.toLowerCase().indexOf(text) !== -1 ||
                  (el.firstName + ' ' + el.lastName).toLowerCase().indexOf(text) !==
                  -1 ||
                  (el.lastName + ' ' + el.firstName).toLowerCase().indexOf(text) !== -1
          );
        });
      },
    },
    components: {
      AppInput,
    },
    computed: {
      ...mapGetters(['user', 'userData', 'users', 'notification']),
    },
    props: {
      visible: Boolean,
      close: Function,
    },
    beforeCreate() {
      this.$store.dispatch(GET_NOTIFICATION);
    },
    watch: {
      notification(notification) {
        this.statusEmailSend = (notification ? notification.eventCalendar : false);
      }
    },
    mounted() {
      this.$store.dispatch(GET_USERS);
    },
  };
</script>

<style lang="scss">

  .add-event-modal {
    .ant-modal-content {
      padding: 2.5rem;
      width: 33.75rem;
      height: 35rem;
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
  .add-event-modal .ant-modal-content {
    max-width: 100%;
  }

</style>