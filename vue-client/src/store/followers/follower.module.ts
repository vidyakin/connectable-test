import {
    FOLLOW_USER_STATUS,
} from '@/store/followers/mutations.type';
import {
    USER_FOLLOW, USER_UNFOLLOW, GET_FOLLOW
} from '@/store/followers/actions.type';
import {followUser, unfollowUser, getfollowUser} from '@/services/follower.service';

interface State {
    follower: any[] | null;
}

const store: State = {
    follower: [],
};

const getters = {
    followers(state: State) {
        return state.follower;
    },
};

const mutations = {
    [FOLLOW_USER_STATUS](state: State, follower: any[]) {
        state.follower = follower;
    },
};

const actions = {
    [USER_FOLLOW]: followUser,
    [USER_UNFOLLOW]: unfollowUser,
    [GET_FOLLOW]: getfollowUser,
};

export default {
    state: store,
    getters,
    actions,
    mutations
};
