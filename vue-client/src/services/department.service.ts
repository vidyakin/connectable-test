import Vue from 'vue';
import {ADD_DEP} from '@/store/structure/mutations.type';
import {ADD_NEW_DEP, DELETE_DEP} from '@/store/structure/actions.type';
import {SET_USERS} from '@/store/user/mutations.type';
import {REMOVE_GROUP} from '@/store/group/mutations.type';

export const putDepartmentsList = (context: any, depinfo: any) => {
    return Vue.axios
        .post(`api/department`, depinfo).then((response: any) => {
            console.log(response.data);
            context.commit(ADD_DEP, response.data);

        }).catch(err => {
            console.log(err);
        });
};
export const getDepartmentsList = (context: any) => {
    return Vue.axios
        .get(`api/department/` )
        .then((response: any) => {
            context.commit(ADD_DEP, response.data);
        });
};

export const deleteDepartment = (context: any, depId: any) => {
    return Vue.axios
        .delete(`api/department/${depId}`)
        .then((response: any) => {
            context.commit(ADD_DEP, response.data);
        });
};

export const updateDepartment = (context: any, dep: any) => {
    return Vue.axios
        .put(`api/department/`, dep)
        .then((response: any) => {
            context.commit(ADD_DEP, response.data);
        });
};
