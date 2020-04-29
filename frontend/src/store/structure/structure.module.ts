import {
    ADD_DEP,
    SET_STRUCTURE
} from '@/store/structure/mutations.type';
import {
    ADD_NEW_DEP,
    GET_DEP,
    DELETE_DEP,
    UPDATE_DEP,

    GET_STRUCTURE,
    EDIT_STRUCTURE,
    SAVE_STRUCTURE
} from '@/store/structure/actions.type';

import {
    putDepartmentsList,
    getDepartmentsList,
    deleteDepartment,
    updateDepartment
} from '@/services/department.service';
import {
    getStructure,
    saveStructure,
    editStructure
} from '@/services/structure.service'

interface State {
    departments: any | null;
    structure: any | null;  // новая структура
}

const store: State = {
    departments: null,
    structure: null
};

const getters = {
    departments(state: State) {
        return state.departments;
    },
    structure(state: State) {
        return state.structure
    }
};

const mutations = {
    [ADD_DEP](state: State, departments: any) {
        state.departments = departments;
    },
    [SET_STRUCTURE](state: State, structure: any) {
        state.structure = structure
    }
};

const actions = {
    [ADD_NEW_DEP]: putDepartmentsList,
    [GET_DEP]: getDepartmentsList,
    [DELETE_DEP]: deleteDepartment,
    [UPDATE_DEP]: updateDepartment,

    [GET_STRUCTURE]: getStructure,
    [EDIT_STRUCTURE]: editStructure,
    [SAVE_STRUCTURE]: saveStructure
};

export default {
    state: store,
    getters,
    actions,
    mutations
};
