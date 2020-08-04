import Vue from 'vue';
import { SET_NOTIFICATION, SET_MESSAGES, ADD_MESSAGE, SOCKET_NEW_MESSAGE } from '@/store/notification/mutations.type';

function compareByDate(a: any, b: any) {
    if (a.dateCreated < b.dateCreated) return 1;
    if (a.dateCreated > b.dateCreated) return -1;
    return 0;
}

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
            context.commit(SET_MESSAGES, response.data.result.sort(compareByDate));
        });
};

export const newSocketMessage = (context: any, socket_message: any) => {
    context.commit(SOCKET_NEW_MESSAGE, socket_message)
}
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