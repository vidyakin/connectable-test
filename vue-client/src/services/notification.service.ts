import Vue from 'vue';
import {SET_NOTIFICATION} from '@/store/notification/mutations.type';

export const postNotification = (context: any, notificationInfo : any) => {
    return Vue.axios
        .post(`api/notification`, notificationInfo).then((response: any) => {
            console.log(response.data);
            context.commit(SET_NOTIFICATION, response.data);

        }).catch(err => {
            console.log(err);
        })
};
export const getNotification = (context: any) => {
    return Vue.axios
        .get(`api/notification/` )
        .then((response: any) => {
            context.commit(SET_NOTIFICATION, response.data[0]);
        });
};
