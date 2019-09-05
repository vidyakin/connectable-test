import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import store from './store';
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
        {
          path: '/settings/',
          name: 'settings',
          component: view('Settings'),
        },
        {
          path: '/list_users/',
          name: 'list_users',
          component: view('ListUsers'),
        },
        {
          path: '/about/',
          name: 'about',
          component: view('About'),
        },
      ],
    },
    /*{
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/!* webpackChunkName: "about" *!/ './views/About.vue'),
    },*/
    {
      path: '/login/',
      name: 'login',
      component: view('Login'),
    },
    {
      path: '/register/',
      name: 'register',
      component: view('Register'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('authorization');
  const isLoggedIn = localStorage.getItem('token');

  if (authRequired && (!isLoggedIn || !loggedIn)) {
    return next({ name: 'login' });
  }
  next();
});
