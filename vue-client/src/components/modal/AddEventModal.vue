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
      <label>Продолжительность</label>
      <a-input v-model="duration"></a-input>
    </div>
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
  import {mapGetters} from "vuex";
  import AppInput from '../common/Input'
  import moment from 'moment'
  import {CREATE_EVENT, UPDATE_USER_INFO} from "../../store/user/actions.type";

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
        date: moment(),
        time: moment.relTime,
        comment: '',
        duration: '',
      }
    },
    methods: {
      setCurrentColor(color) {
        this.currentColor = color;
      },
      createEvent() {
        const {name, date, time, duration, comment, currentColor} = this;
        const event = {name, date, time, duration, comment, color: currentColor.color};
        event.userId = this.user._id;
        this.$store.dispatch(CREATE_EVENT, event)
          .finally(() => {
            this.name = '';
            this.date = moment();
            this.time = moment.relTime;
            this.comment = '';
            this.duration = '';
            this.close();
          });

      },
      changeTime(time, timeString) {
        this.time = timeString;
      },
    },
    components: {
      AppInput,
    },
    computed: {
      ...mapGetters(['user']),
    },
    props: {
      visible: Boolean,
      close: Function,
    }
  }
</script>

<style lang="scss">

  .add-event-modal {
    .ant-modal-content {
      padding: 2.5rem;
      width: 33.75rem;
      height: 30rem;
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

</style>