<template>
  <div class="page">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      @back="() => $router.go(-1)"
      title="Управление клиентами"
      subTitle="Доп.данные"
    >
      <template slot="extra">
        <a-button key="1" type="primary">Новый клиент</a-button>
        <!-- <a-button key="2">Operation</a-button>    -->
      </template>
      <a-descriptions size="small" :column="3">
        <a-descriptions-item label="Всего клиентов:">189</a-descriptions-item>
        <a-descriptions-item label="Поступлений за тек. месяц:">
          <a>567 000.00 руб.</a>
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>

    <a-table :columns="columns" :dataSource="data" size="small">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="customTitle">
        <a-icon type="smile-o" />
        {{' Название'}}
      </span>
      <span slot="tarifs" slot-scope="tarif">
        <a-tag :color="tarifColor(tarif)">{{ tarif.toUpperCase() }}</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a>Открыть {{ record.name }}</a>
        <a-divider type="vertical" />
        <a-divider type="vertical" />
        <a class="ant-dropdown-link">
          Больше
          <a-icon type="down" />
        </a>
      </span>
    </a-table>
  </div>
</template>

<script>
import store from "../store";

const columns = [
  {
    title: "Название",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Телефон",
    dataIndex: "phone",
    key: "phone"
  },
  {
    title: "Адрес компании",
    dataIndex: "address",
    key: "address"
  },
  {
    title: "Кол-во сотрудников",
    key: "empl",
    dataIndex: "empl"
  },
  {
    title: "Тариф",
    key: "tarif",
    dataIndex: "tarif",
    scopedSlots: { customRender: "tarifs" }
  },
  {
    title: "Действия",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

const data = [
  {
    key: "1",
    name: "Газпром ПАО",
    phone: "+7 495 719-30-01",
    address: "г. Москва, ул. Наметкина, 16",
    tarif: "prof",
    empl: 1851
  },
  {
    key: "2",
    name: "УкрНафта",
    phone: "0800 404 000",
    address: "Нестеровский пер., 3-5",
    tarif: "prof",
    empl: 1265
  },
  {
    key: "3",
    name: "Яндекс",
    phone: "+7",
    address: "Нестеровский пер., 3-5",
    tarif: "base",
    empl: 121
  },
  {
    key: "4",
    name: "Детский мир",
    phone: "8(495) 781-08-08",
    address: "127238 г. Москва, 3-й Нижнелихоборский пр-д, 3, стр. 6",
    tarif: "free",
    empl: 13
  }
];

export default {
  name: "AppClients",
  data() {
    return {
      data,
      columns
    };
  },
  components: {},
  methods: {
    tarifColor(tarif) {
      const colors = {
        free: "#ff0000",
        base: "#00ff00",
        prof: "#0000ff"
      };
      return colors[tarif];
    }
  }
};
</script>

<style>
.page {
  margin: 30px;
}
</style>