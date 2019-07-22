import {CREATE_GROUP, DELETE_GROUP, EDIT_GROUP, GET_CURRENT_GROUP, GET_GROUPS} from "@/store/group/actions.type";
import {createGroup, deleteGroup, editGroup, getCurrentGroup, getGroups} from "@/services/group.service";
import {ADD_GROUP, REMOVE_GROUP, SET_CURRENT_GROUP, SET_GROUPS, UPDATE_GROUP} from "@/store/group/mutations.type";

interface State {
  groups: any[],
  currentGroup: any,
};

const store: State = {
  groups: [],
  currentGroup: null,
};

const getters = {
  groups(state: State) {
    return state.groups;
  },
  currentGroup(state: State) {
    return state.currentGroup;
  },
};

const actions = {
  [CREATE_GROUP]: createGroup,
  [GET_GROUPS]: getGroups,
  [GET_CURRENT_GROUP]: getCurrentGroup,
  [DELETE_GROUP]: deleteGroup,
  [EDIT_GROUP]: editGroup,
};

const mutations = {
  [ADD_GROUP](state: State, group: any) {
    state.groups = [group, ...state.groups];
  },
  [SET_GROUPS](state: State, groups: any) {
    state.groups = groups;
  },
  [SET_CURRENT_GROUP](state: State, group: any) {
    state.currentGroup = group;
  },
  [REMOVE_GROUP](state: State, groupId: any) {
    if (state.groups) {
      const index = state.groups.findIndex(({_id}) => _id === groupId);
      state.groups = [
        ...state.groups.slice(0, index),
        ...state.groups.slice(index + 1),
      ]
    }
  },
  [UPDATE_GROUP](state: State, group: any) {
    state.currentGroup = group;
    if (state.groups) {
      const index = state.groups.findIndex(({_id}) => _id === group._id);
      state.groups = [
        ...state.groups.slice(0, index),
        group,
        ...state.groups.slice(index + 1),
      ]
    }
  },
};

export default {
  state: store,
  getters,
  actions,
  mutations,
};