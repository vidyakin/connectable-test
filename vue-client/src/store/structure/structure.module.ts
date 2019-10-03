import {
    ADD_DEP
} from '@/store/structure/mutations.type';
import {
    ADD_NEW_DEP,
    GET_DEP
} from '@/store/structure/actions.type';
import {putDepartmentsList, getDepartmentsList} from '@/services/department.service';
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
};

export default {
    state: store,
    getters,
    actions,
    mutations
};
