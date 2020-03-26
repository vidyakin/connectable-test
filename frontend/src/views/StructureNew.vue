<template>
  <div class='org-chart'>
    <a-page-header
      style='border: 1px solid rgb(235, 237, 240)'
      title='Структура'
    >
    <template slot='extra'>
      <a-button key='3' type='primary'>Редактировать</a-button>
    </template>
    </a-page-header>
    <a-tabs :animated='false' :tabBarGutter='10'>
      <a-tab-pane tab='Отделы' key='1'>
          <Departments />        
      </a-tab-pane>
      <a-tab-pane tab='Проекты' key='2' />
    </a-tabs>
  </div>
</template>

<script>

import Departments from '../components/structure/Departments';

export default {
  name: 'Home',
  components: {
    Departments
  },
  data() {
    return {
      visible: false,
      visible2: true,
      name: 'Vasya'
    };
  }
};
</script>

<style>
/* .home {
  width: 1260px;
  margin: 0 auto;
} */


/* модифицируем стили AntDesign для приближения к макету */
.ant-tabs-bar {
  margin: 0 !important;
}

</style>