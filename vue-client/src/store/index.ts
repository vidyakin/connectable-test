import Vue from 'vue';
import Vuex from 'vuex';
import shower from './shower/shower.module';
import auth from './user/user.module';
import post from './post/post.module';
import group from './group/group.module';
import project from './project/project.module';
import structure from './structure/structure.module';
import notification from './notification/notification.module';
import follower from './followers/follower.module';
Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    shower,
    auth,
    post,
    group,
    project,
    structure,
    notification,
    follower,
  },
});
