import Vue from 'vue';
import {
  ADD_GROUP,
  REMOVE_GROUP,
  SET_CURRENT_GROUP,
  SET_GROUPS, SET_INVITE,
  SET_PARTICIPANTS_REQUEST,
  UPDATE_GROUP,
  SET_REQUESTS,
  SET_GROUPS_USER_CAN_READ
} from '@/store/group/mutations.type';
import { GET_CURRENT_GROUP } from '@/store/group/actions.type';

export const createGroup = (context: any, group: any) => {
  return Vue.axios
    .post(`api/group/`, group)
    .then((response: any) => {
      context.commit(ADD_GROUP, response.data.result);
      return response.data.result._id
    })
};

export const getGroups = (context: any, userId: any) => {
  return Vue.axios
    .get(`api/group/byUser/${userId}`)
    .then((response: any) => {
      context.commit(SET_GROUPS, response.data.result);
    });
};

export const getGroupsByClient = (context: any, workspace: any) => {
  return Vue.axios
    .get(`api/group/byClient/${workspace}`)
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


export const createParticipant = (context: any, data: any) => {
  return Vue.axios
    .post(`api/group/${data.groupId}/participant/${data.userId}`, data)
    .then((response: any) => {
      context.dispatch(GET_CURRENT_GROUP, data.groupId);
    });
};

export const getParticipantsRequest = (context: any, props: any) => {
  return Vue.axios
    .get(`api/group/${props.groupId}/checkParticipant/${props.participantId}`)
    .then((response: any) => {
      context.commit(SET_PARTICIPANTS_REQUEST, response.data);
    });
};

export const approveParticipantsRequest = (context: any, data: any) => {
  return Vue.axios
    .post(`api/group/${data.groupId}/participant/${data.userId}/approve`)
    .then((response: any) => {
      context.dispatch(GET_CURRENT_GROUP, data.groupId);
    });
};

export const deleteParticipant = (context: any, data: any) => {
  return Vue.axios
    .delete(`api/group/${data.groupId}/participant/${data.userId}`)
    .then((response: any) => {
      context.dispatch(GET_CURRENT_GROUP, data.groupId);
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
    .post(`api/group/approveInvite/${id}`);
};

export const cancelInvite = (context: any, id: string) => {
  return Vue.axios
    .post(`api/group/cancelInvite/${id}`);
};

export const replaceGroupsOwner = (context: any, userId: string) => {
  return Vue.axios
    .post(`api/group/replace_owner/${userId}`);
};

export const changeGroupOwner = (context: any, data: any) => {
  return Vue.axios
    .put(`api/group/${data.groupId}/owner/${data.newOwner}`)
    .then((response: any) => {
      context.dispatch(GET_CURRENT_GROUP, data.groupId);
    });
};

export const getRequests = (context: any, userId: string) => {
  return Vue.axios
    .get(`api/group/requests/${userId}`)
    .then((response: any) => {
      context.commit(SET_REQUESTS, response.data);
    });
}

export const getGroupsThatUserCanRead = (context: any, userId: string) => {
  return Vue.axios
    .get(`api/group/can_read_by/${userId}`)
    .then((response: any) => {
      context.commit(SET_GROUPS_USER_CAN_READ, response.data);
    });
}