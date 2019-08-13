import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

const view = (name: string) => {
  return () => import(`./views/${name}.vue`);
};

export const router =  new Router({
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
          component: view('Company'),
        },
        {
          path: '/profile/:_id',
          name: 'profile',
          component: view('Profile'),
        },
        {
          path: '/calendar/',
          name: 'calendar',
          component: view('Calendar'),
        },
        {
          path: '/addressBook/',
          name: 'addressBook',
          component: view('Address'),
        },
        {
          path: '/groups/',
          name: 'groups',
          component: view('Groups'),
        },
        {
          path: '/group/:_id',
          name: 'group',
          component: view('Group'),
        },
        {
          path: '/invite/:_id',
          name: 'invite',
          component: view('Invite'),
        },
        {
          path: '/structure',
          name: 'structure',
          component: view('Structure'),
        },
        {
          path: '/project/:_id',
          name: 'project',
          component: view('Project'),
        },
      ],
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

router.beforeEach((to, from, next) => {
  const publicPages = ['/company', '/sign-up'];
  const authRequired = !publicPages.includes(to.path);

  const loggedIn = localStorage.getItem('authorization');
  if (authRequired && !loggedIn) {
    return next({ name: 'company' });
  }
  next();
});
