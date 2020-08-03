import {
  APPROVE_INVITE,
  APPROVE_PARTICIPANTS_REQUEST, CANCEL_INVITE,
  CREATE_GROUP, CREATE_INVITE,
  CREATE_PARTICIPANT,
  DELETE_GROUP, DELETE_PARTICIPANT,
  EDIT_GROUP,
  GET_CURRENT_GROUP,
  GET_GROUPS, GET_GROUPS_BY_CLIENT, GET_INVITE, GET_PARTICIPANTS_REQUEST,
  REPLACE_GROUPS_OWNER, CHANGE_GROUP_OWNER,
  GET_REQUESTS_TO_MY_GROUPS,
  GET_GROUPS_USER_CAN_READ
} from './actions.type';
import {
  approveInvite,
  approveParticipantsRequest, cancelInvite,
  createGroup, createInvite,
  createParticipant,
  deleteGroup, deleteParticipant,
  editGroup,
  getCurrentGroup,
  getGroups, getGroupsByClient, getInvite, getParticipantsRequest,
  replaceGroupsOwner, changeGroupOwner,
  getRequests,
  getGroupsThatUserCanRead
} from './group.service';
import {
  ADD_GROUP,
  REMOVE_GROUP,
  SET_CURRENT_GROUP,
  SET_GROUPS, SET_INVITE,
  SET_PARTICIPANTS_REQUEST,
  UPDATE_GROUP,
  SET_REQUESTS,
  SET_GROUPS_USER_CAN_READ
} from './mutations.type';

interface State {
  groups: any[];
  currentGroup: any;
  participantsRequest: boolean | null;
  invite: any | null;
  requests: any[],
  groupsUserCanRead: string[]
}

const store: State = {
  groups: [],
  currentGroup: null,
  participantsRequest: null,
  invite: null,
  requests: [],
  groupsUserCanRead: []
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
  group_requests(state: State) {
    return state.requests
  },
  groups_available(state: State) {
    return state.groupsUserCanRead
  }
};

const actions = {
  [CREATE_GROUP]: createGroup,
  [GET_GROUPS]: getGroups,
  [GET_GROUPS_BY_CLIENT]: getGroupsByClient,
  [GET_CURRENT_GROUP]: getCurrentGroup,
  [DELETE_GROUP]: deleteGroup,
  [EDIT_GROUP]: editGroup,
  [CREATE_PARTICIPANT]: createParticipant,
  [GET_PARTICIPANTS_REQUEST]: getParticipantsRequest,
  [APPROVE_PARTICIPANTS_REQUEST]: approveParticipantsRequest,
  [DELETE_PARTICIPANT]: deleteParticipant,
  [CREATE_INVITE]: createInvite,
  [GET_INVITE]: getInvite,
  [APPROVE_INVITE]: approveInvite,
  [CANCEL_INVITE]: cancelInvite,
  [REPLACE_GROUPS_OWNER]: replaceGroupsOwner,
  [CHANGE_GROUP_OWNER]: changeGroupOwner,
  [GET_REQUESTS_TO_MY_GROUPS]: getRequests,
  [GET_GROUPS_USER_CAN_READ]: getGroupsThatUserCanRead
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
      const index = state.groups.findIndex(({ _id }) => _id === groupId);
      state.groups.splice(index, 1)
    }
  },
  [UPDATE_GROUP](state: State, group: any) {
    state.currentGroup = group;
    if (state.groups) {
      const index = state.groups.findIndex(({ _id }) => _id === group._id);
      state.groups.splice(index, 1, group)
    }
  },
  [SET_PARTICIPANTS_REQUEST](state: State, req: boolean) {
    state.participantsRequest = req;
  },
  [SET_INVITE](state: State, invite: any) {
    state.invite = invite;
  },
  [SET_REQUESTS](state: State, requests: any[]) {
    state.requests = requests
  },
  [SET_GROUPS_USER_CAN_READ](state: State, data: any[]) {
    state.groupsUserCanRead = data
  },
};

export default {
  state: store,
  getters,
  actions,
  mutations,
};
