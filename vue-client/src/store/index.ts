import Vue from 'vue';
import Vuex from 'vuex';
import shower from './shower/shower.module';
import auth from './user/user.module';
import post from './post/post.module';
import group from './group/group.module';
import project from './project/project.module';

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    shower,
    auth,
    post,
    group,
    project
  },
});
