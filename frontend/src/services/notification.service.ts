import Vue from 'vue';
import {SET_NOTIFICATION, SET_MESSAGES, ADD_MESSAGE} from '@/store/notification/mutations.type';

export const postNotification = (context: any, notificationInfo : any) => {
    return Vue.axios
        .post(`api/notification`, notificationInfo).then((response: any) => {
            console.log(response.data);
            context.commit(SET_NOTIFICATION, response.data.result);

        }).catch(err => {
            console.log(err);
        });
};
export const getNotification = (context: any, userId: any) => {
    return Vue.axios
        .get(`api/notification/${userId}` )
        .then((response: any) => {
            context.commit(SET_NOTIFICATION, response.data.result);
        });
};

// сохранение сообщения в базу
export const createMessage = async (context: any, msg: any) => {
    const resp: any = await Vue.axios.post('api/message', msg)
    context.commit(ADD_MESSAGE, resp.data.result)
    return resp.data.result._id
}

// TODO: пока без userId, надо сделать несколько вариантов получения сообщений
export const getMessages = (context: any) => {
    return Vue.axios
        .get(`api/message` )
        .then((response: any) => {
            context.commit(SET_MESSAGES, response.data.result);
        });
};