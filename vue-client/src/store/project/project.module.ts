import {
  APPROVE_INVITE,
  APPROVE_PARTICIPANTS_REQUEST, CANCEL_INVITE,
  CREATE_GROUP, CREATE_INVITE,
  CREATE_PARTICIPANT,
  DELETE_GROUP, DELETE_PARTICIPANT,
  EDIT_GROUP,
  GET_CURRENT_GROUP,
  GET_GROUPS, GET_INVITE, GET_PARTICIPANTS_REQUEST
} from "@/store/group/actions.type";
import {
  approveInvite,
  approveParticipantsRequest, cancelInvite,
  createGroup, createInvite,
  createParticipant,
  deleteGroup, deleteParticipant,
  editGroup,
  getCurrentGroup,
  getGroups, getInvite, getParticipantsRequest
} from "@/services/group.service";
import {
  ADD_GROUP,
  REMOVE_GROUP,
  SET_CURRENT_GROUP,
  SET_GROUPS, SET_INVITE,
  SET_PARTICIPANTS_REQUEST,
  UPDATE_GROUP
} from "@/store/group/mutations.type";
import {
  CREATE_PROJECT, CREATE_PROJECT_PARTICIPANT,
  DELETE_PROJECT,
  EDIT_PROJECT,
  GET_CURRENT_PROJECT,
  GET_PROJECTS
} from "@/store/project/actions.type";
import {ADD_PROJECT, REMOVE_PROJECT, SET_CURRENT_PROJECT, SET_PROJECTS} from "@/store/project/mutations.type";
import {
  createProject,
  createProjectParticipant,
  deleteProject,
  editProject,
  getCurrentProject,
  getProjects
} from "@/services/project.service";

interface State {
  projects: any[],
  currentProject: any,
};

const store: State = {
  projects: [],
  currentProject: null,
};

const getters = {
  projects(state: State) {
    return state.projects.map(e => {
      e.participants = [...e.participants.sort((a: any, b: any) => {
        if (a._id === e.creatorId) {
          return -1
        }
        if (b._id ===  e.creatorId) {
          return 1
        }
        return 0
      })];
      return e;
    });
  },
  currentProject(state: State) {
    return state.currentProject;
  },
};

const actions = {
  [CREATE_PROJECT]: createProject,
  [GET_PROJECTS]: getProjects,
  [GET_CURRENT_PROJECT]: getCurrentProject,
  [DELETE_PROJECT]: deleteProject,
  [EDIT_PROJECT]: editProject,
  [CREATE_PROJECT_PARTICIPANT]: createProjectParticipant,
};

const mutations = {
  [ADD_PROJECT](state: State, project: any) {
    state.projects = [project, ...state.projects];
  },
  [SET_PROJECTS](state: State, projects: any) {
    state.projects = projects;
  },
  [SET_CURRENT_PROJECT](state: State, project: any) {
    state.currentProject = project;
  },
  [REMOVE_PROJECT](state: State, projectId: any) {
    if (state.projects) {
      const index = state.projects.findIndex(({_id}) => _id === projectId);
      state.projects = [
        ...state.projects.slice(0, index),
        ...state.projects.slice(index + 1),
      ]
    }
  },
  [UPDATE_GROUP](state: State, project: any) {
    state.currentProject = project;
    if (state.projects) {
      const index = state.projects.findIndex(({_id}) => _id === project._id);
      state.projects = [
        ...state.projects.slice(0, index),
        project,
        ...state.projects.slice(index + 1),
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