import Vue from 'vue';
import {
  ADD_GROUP,
  REMOVE_GROUP,
  SET_CURRENT_GROUP,
  SET_GROUPS, SET_INVITE,
  SET_PARTICIPANTS_REQUEST,
  UPDATE_GROUP,
} from '@/store/group/mutations.type';
import {GET_CURRENT_GROUP} from '@/store/group/actions.type';

export const createGroup = (context: any, group: any) => {
  return Vue.axios
    .post(`api/group/`, group)
    .then((response: any) => {
      context.commit(ADD_GROUP, response.data.result);
    });
};

export const getGroups = (context: any, userId: any) => {
  return Vue.axios
    .get(`api/group/`)
    .then((response: any) => {
      context.commit(SET_GROUPS, response.data.result);
    });
};

export const getCurrentGroup = (context: any, groupId: any) => {
  return Vue.axios
    .get(`api/group/${groupId}`)
    .then((response: any) => {
      context.commit(SET_CURRENT_GROUP, response.data.result);
    });
};

export const deleteGroup = (context: any, groupId: any) => {
  return Vue.axios
    .delete(`api/group/${groupId}`)
    .then((response: any) => {
      context.commit(REMOVE_GROUP, response.data.result);
    });
};

export const editGroup = (context: any, group: any) => {
  return Vue.axios
    .put(`api/group/${group._id}`, group)
    .then((response: any) => {
      context.commit(UPDATE_GROUP, response.data.result);
    });
};


export const createParticipant = (context: any, participant: any) => {
  return Vue.axios
    .post(`api/groupParticipant/`, participant)
    .then((response: any) => {
      context.dispatch(GET_CURRENT_GROUP, participant.groupId);
    });
};

export const getParticipantsRequest = (context: any, props: any) => {
  return Vue.axios
    .get(`api/checkParticipant/${props.participantId}/group/${props.groupId}`)
    .then((response: any) => {
      context.commit(SET_PARTICIPANTS_REQUEST, response.data);
    });
};

export const approveParticipantsRequest = (context: any, props: any) => {
  return Vue.axios
    .post(`api/approveParticipant/${props.participantId}/group/${props.groupId}`)
    .then((response: any) => {
      context.dispatch(GET_CURRENT_GROUP, props.groupId);
    });
};

export const deleteParticipant = (context: any, props: any) => {
  return Vue.axios
    .delete(`api/deleteParticipant/${props.participantId}/group/${props.groupId}`)
    .then((response: any) => {
      context.dispatch(GET_CURRENT_GROUP, props.groupId);
    });
};

export const createInvite = (context: any, props: any) => {
  return Vue.axios
    .post(`api/groupInvite`, props)
    .then((response: any) => {
      return;
    });
};

export const getInvite = (context: any, id: string) => {
  return Vue.axios
    .get(`api/groupInvite/${id}`)
    .then((response: any) => {
      context.commit(SET_INVITE, response.data.result);
    });
};

export const approveInvite = (context: any, id: string) => {
  return Vue.axios
    .post(`api/approveInvite/${id}`);
};

export const cancelInvite = (context: any, id: string) => {
  return Vue.axios
    .post(`api/cancelInvite/${id}`);
};
