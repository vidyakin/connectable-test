import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import AppCompany from './views/Company.vue';
import AppProfile from './views/Profile.vue';
import AppCalendar from './views/Calendar.vue';
import AppAddress from './views/Adresses.vue';
import AppGroups from './views/Groups.vue';
import AppGroup from './views/Group.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: '',
      component: Home,
      children: [
        {
          path: '/company',
          name: 'company',
          component: AppCompany,
        },
        {
          path: '/profile/:_id',
          name: 'profile',
          component: AppProfile,
        },
        {
          path: '/calendar/',
          name: 'calendar',
          component: AppCalendar,
        },
        {
          path: '/addressBook/',
          name: 'addressBook',
          component: AppAddress,
        },
        {
          path: '/groups/',
          name: 'groups',
          component: AppGroups,
        },
        {
          path: '/group/:_id',
          name: 'group',
          component: AppGroup,
        },
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});
