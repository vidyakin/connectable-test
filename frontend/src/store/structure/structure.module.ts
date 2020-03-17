import {
    ADD_DEP
} from '@/store/structure/mutations.type';
import {
    ADD_NEW_DEP,
    GET_DEP,
    DELETE_DEP,
    UPDATE_DEP
} from '@/store/structure/actions.type';

import {
    putDepartmentsList,
    getDepartmentsList,
    deleteDepartment,
    updateDepartment
} from '@/services/department.service';

interface State {
    departments: any | null;
}

const store: State = {
    departments: null,
};

const getters = {
    departments(state: State) {
        return state.departments;
    },
};

const mutations = {
    [ADD_DEP](state: State, departments: any) {
        state.departments = departments;
    },
};

const actions = {
    [ADD_NEW_DEP]: putDepartmentsList,
    [GET_DEP]: getDepartmentsList,
    [DELETE_DEP]: deleteDepartment,
    [UPDATE_DEP]: updateDepartment
};

export default {
    state: store,
    getters,
    actions,
    mutations
};
