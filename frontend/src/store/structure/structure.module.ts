import {
    ADD_DEP,
    SET_STRUCTURE,

    SET_DEPT_USERS,
    ADD_DEPT_USERS,
    UPDATE_DEPT_USER,
    REMOVE_DEPT_USER
} from '@/store/structure/mutations.type';
import {
    ADD_NEW_DEP,
    GET_DEP,
    DELETE_DEP,
    UPDATE_DEP,

    GET_STRUCTURE,
    EDIT_STRUCTURE,
    SAVE_STRUCTURE,

    GET_DEPT_USERS,
    SAVE_DEPT_USERS,
    EDIT_DEPT_USER,
    DELETE_DEPT_USER
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
    editStructure,
    getDepartmentUsers,
    saveUsersOfDepartment,
    editUserOfDepartment,
    delUserOfDepartment
} from '@/services/structure.service'

interface State {
    departments: any | null;
    structure: any | null;  // новая структура
    dept_users: any | null; // сотрудники отделов клиента
}

const store: State = {
    departments: null,
    structure: null,
    dept_users: null
};

const getters = {
    departments(state: State) {
        return state.departments;
    },
    structure(state: State) {
        return state.structure
    },
    dept_users(state: State) {
        return state.dept_users || []
    }
};

const mutations = {
    [ADD_DEP](state: State, departments: any) {
        state.departments = departments;
    },
    [SET_STRUCTURE](state: State, structure: any) {
        state.structure = structure
    },
    [SET_DEPT_USERS](state: State, data: any) {
        state.dept_users = data
    },
    [ADD_DEPT_USERS](state: State, data: any) {
        state.dept_users.push(data)
    },
    // переписать для обновления одного сотрудника а не всей записи
    [UPDATE_DEPT_USER](state: State, data: any) {
        const i = state.dept_users.findIndex((el: any) => el._id = data.id)
        state.dept_users.splice(i, 1, data)
    },
    // переписать под удаление одного сотрудника, а не всей записи
    [REMOVE_DEPT_USER](state: State, id: any) {
        const i = state.dept_users.findIndex((el: any) => el._id = id)
        state.dept_users.splice(i, 1)
    }
};

const actions = {
    [ADD_NEW_DEP]: putDepartmentsList,
    [GET_DEP]: getDepartmentsList,
    [DELETE_DEP]: deleteDepartment,
    [UPDATE_DEP]: updateDepartment,

    [GET_STRUCTURE]: getStructure,
    [EDIT_STRUCTURE]: editStructure,
    [SAVE_STRUCTURE]: saveStructure,

    [GET_DEPT_USERS]: getDepartmentUsers,
    [SAVE_DEPT_USERS]: saveUsersOfDepartment,
    [EDIT_DEPT_USER]: editUserOfDepartment,
    [DELETE_DEPT_USER]: delUserOfDepartment
};

export default {
    state: store,
    getters,
    actions,
    mutations
};
