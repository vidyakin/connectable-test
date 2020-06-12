import Vue from 'vue';
import { SET_NOTIFICATION, SET_MESSAGES, ADD_MESSAGE, MARK_MESSAGE_READ } from '@/store/notification/mutations.type';

export const postNotification = (context: any, notificationInfo: any) => {
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
        .get(`api/notification/${userId}`)
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
export const getMessages = (context: any, params: any) => {
    return Vue.axios
        .get(`api/message`, { params })
        .then((response: any) => {
            context.commit(SET_MESSAGES, response.data.result);
        });
};

// пока непонятно надо ли будет это вообще
// export const markMessagesAsRead = (context: any, msg_id: string) => {
//     return Vue.axios
//         .put('/api/message/read/' + msg_id)
//         .then(res => {
//             if (msg_id == '')
//                 context.commit(MARK_MESSAGE_READ, res.data.resuls)
//             else
//                 context.commit(SET_MESSAGES, res.data.resuls)
//         })
// }