import {
  APPROVE_INVITE,
  APPROVE_PARTICIPANTS_REQUEST, CANCEL_INVITE,
  CREATE_GROUP, CREATE_INVITE,
  CREATE_PARTICIPANT,
  DELETE_GROUP, DELETE_PARTICIPANT,
  EDIT_GROUP,
  GET_CURRENT_GROUP,
  GET_GROUPS, GET_INVITE, GET_PARTICIPANTS_REQUEST,
} from '@/store/group/actions.type';
import {
  approveInvite,
  approveParticipantsRequest, cancelInvite,
  createGroup, createInvite,
  createParticipant,
  deleteGroup, deleteParticipant,
  editGroup,
  getCurrentGroup,
  getGroups, getInvite, getParticipantsRequest,
} from '@/services/group.service';
import {
  ADD_GROUP,
  REMOVE_GROUP,
  SET_CURRENT_GROUP,
  SET_GROUPS, SET_INVITE,
  SET_PARTICIPANTS_REQUEST,
  UPDATE_GROUP,
} from '@/store/group/mutations.type';

interface State {
  groups: any[];
  currentGroup: any;
  participantsRequest: boolean | null;
  invite: any | null;
}

const store: State = {
  groups: [],
  currentGroup: null,
  participantsRequest: null,
  invite: null,
};

const getters = {
  groups(state: State) {
    return state.groups;
  },
  currentGroup(state: State) {
    return state.currentGroup;
  },
  participantsRequest(state: State) {
    return state.participantsRequest;
  },
  invite(state: State) {
    return state.invite;
  },
};

const actions = {
  [CREATE_GROUP]: createGroup,
  [GET_GROUPS]: getGroups,
  [GET_CURRENT_GROUP]: getCurrentGroup,
  [DELETE_GROUP]: deleteGroup,
  [EDIT_GROUP]: editGroup,
  [CREATE_PARTICIPANT]: createParticipant,
  [GET_PARTICIPANTS_REQUEST ]: getParticipantsRequest,
  [APPROVE_PARTICIPANTS_REQUEST]: approveParticipantsRequest,
  [APPROVE_PARTICIPANTS_REQUEST]: approveParticipantsRequest,
  [DELETE_PARTICIPANT]: deleteParticipant,
  [CREATE_INVITE]: createInvite,
  [GET_INVITE]: getInvite,
  [APPROVE_INVITE]: approveInvite,
  [CANCEL_INVITE]: cancelInvite,
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
      ];
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
      ];
    }
  },
  [SET_PARTICIPANTS_REQUEST](state: State, req: boolean) {
    state.participantsRequest = req;
  },
  [SET_INVITE](state: State, invite: any) {
    state.invite = invite;
  },
};

export default {
  state: store,
  getters,
  actions,
  mutations,
};
