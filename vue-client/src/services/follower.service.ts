import Vue from 'vue';
import {FOLLOW_USER_STATUS} from '@/store/followers/mutations.type';


export const followUser = (context: any, usersID: any) => {

    return Vue.axios
        .post(`api/follow`, usersID )
        .then((response: any) => {
            context.commit(FOLLOW_USER_STATUS, response.data);
        });
};
export const unfollowUser = (context: any, usersID: any) => {
    return Vue.axios
        .post(`api/unfollow`, usersID )
        .then((response: any) => {
            context.commit(FOLLOW_USER_STATUS, response.data);
        });
};
export const getfollowUser = (context: any) => {
    return Vue.axios
        .get(`api/follow` )
        .then((response: any) => {
            context.commit(FOLLOW_USER_STATUS, response.data);
        });
};
