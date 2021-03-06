import Vue from 'vue';
import {
  ADD_ANSWER_FOR_COMMENT,
  ADD_COMMENT_FOR_POST,
  ADD_LIKE_FOR_COMMENT,
  ADD_LIKE_FOR_POST, REMOVE_LIKE_FOR_POST,
  ADD_POST, CHANGE_POST, CHANGE_COMMENT, CHANGE_ANSWER,
  REMOVE_POST,
  REMOVE_COMMENT,
  REMOVE_ANSWER,
  SET_POST,
  SET_POSTS,
  SET_POSTS_OF_FOLLOWS,
  SET_POSTS_OF_GROUPS,
  SET_COMMENTS_FEED,
  SET_MENTIONS_FEED
} from '@/store/post/mutations.type';

export const sendNewPost = (context: any, post: any) => {
  if (post.formData) {
    return Vue.axios
      .post('api/upload', post.formData)
      .then((response) => {
        post.attachment = [response.data.file];
        delete post.formData;
        Vue.axios
          .post('api/post', post)
          .then((resp: any) => {
            context.commit(ADD_POST, resp.data.result);
          });
      });
  } else {
    return Vue.axios
      .post('api/post', post)
      .then((response: any) => {
        context.commit(ADD_POST, response.data.result);
      });
  }


};
export const editPost = (context: any, post: any) => {
  if (post.formData) {
    return Vue.axios
      .post('api/upload', post.formData)
      .then((response) => {
        post.attachment = [response.data.file];
        delete post.formData;
        Vue.axios
          .put('api/post/' + post._id, post)
          .then((resp: any) => {
            context.commit(CHANGE_POST, resp.data.result);
          });
      });
  } else {
    return Vue.axios
      .put('api/post/' + post._id, post)
      .then((response: any) => {
        context.commit(CHANGE_POST, response.data.result);
      });
  }
};
export const editComment = (context: any, comment: any) => {
  return Vue.axios
    .put('api/comment/' + comment._id, comment)
    .then((response: any) => {
      if (comment.status) {
        context.commit(CHANGE_ANSWER, response.data.result);
      } else {
        context.commit(CHANGE_COMMENT, response.data.result);
      }
    });
};
export const repost = async (context: any, post: any) => {
  const response = await Vue.axios
    .post('api/post', post);
  return;
};

export const getPosts = async (context: any, parent: any) => {
  context.commit(SET_POSTS, []);
  const response = await Vue.axios
    .get('api/post', { params: parent });
  context.commit(SET_POSTS, response.data.result);
};

export const getPostsOfFollows = async (context: any, user_id: string) => {
  const posts = await Vue.axios
    .get('/api/post/follows/' + user_id)
  context.commit(SET_POSTS_OF_FOLLOWS, posts.data)
}

export const getPostsOfuserGroups = async (context: any, user_id: string) => {
  const posts = await Vue.axios
    .get('/api/post/group/user/' + user_id)
  context.commit(SET_POSTS_OF_GROUPS, posts.data)
}

export const getPost = async (context: any, postId: any) => {
  const response = await Vue.axios
    .get(`api/post/${postId}`);
  context.commit(SET_POST, response.data.result);
};

type Like = {
  post_id: string,
  user_id: string,
  parent: {
    type: 'post' | 'user' | 'group' | 'comment',
    id: string
  }
}

type LikeResponse = {
  _id: string,
  author: {
    _id: string,
    firstName: string,
    lastName: string
  },
  created: Date
}

/**
 * 
 * @param context 
 * @param like : Like  // TODO: доработать на стороне клиента отправку 
 */
export const sendLike = async (context: any, like: Like) => {
  const response = await Vue.axios
    .post('api/post/like', like);
  if (response.data.status == 201) {
    const newLike: LikeResponse = response.data.result;
    if (like.parent.type === 'post') {
      context.commit(ADD_LIKE_FOR_POST, newLike);
    }
    if (like.parent.type === 'comment') {
      context.commit(ADD_LIKE_FOR_COMMENT, newLike);
    }
  }
};

export const sendDislike = async (context: any, dislike: Like) => {
  const response = await Vue.axios
    // .delete(`api/dislike/${arrRes}`)
    .post('api/post/dislike', dislike);
  if (response.data.status == 201) {
    const newDislike: LikeResponse = response.data.result;
    if (dislike.parent.type === 'post') {
      context.commit(REMOVE_LIKE_FOR_POST, newDislike);
    }
    // if (dislike.parent.type === 'comment') {
    //   context.commit(REMOVE_LIKE_FOR_COMMENT, newDislike);
    // }
  }
  return response.data;
};

export const sendComment = (context: any, comment: any) => {
  return Vue.axios
    .post('api/comment', comment)
    .then((response: any) => {
      const newComment = response.data.result;

      if (newComment.parent.type === 'post') { context.commit(ADD_COMMENT_FOR_POST, newComment); }
      if (newComment.parent.type === 'comment') { context.commit(ADD_ANSWER_FOR_COMMENT, newComment); }
    });
};
export const deletePost = (context: any, postId: number) => {
  return Vue.axios
    .delete('api/post/' + postId)
    .then((response: any) => {
      context.commit(REMOVE_POST, response.data.result);
    });
};
export const deleteComment = (context: any, commentId: any) => {
  return Vue.axios
    .delete('api/comment/' + commentId._id)
    .then((response: any) => {
      if (commentId.type) {
        context.commit(REMOVE_ANSWER, commentId);
      } else {
        context.commit(REMOVE_COMMENT, response.data.result);
      }

    });
};

export const getComments = (context: any, user_id: string) => {
  return Vue.axios
    .get('/api/post/comments_feed/' + user_id)
    .then((response: any) => {
      context.commit(SET_COMMENTS_FEED, response.data)
    })
}

export const getMentions = (context: any, user_id: string) => {
  return Vue.axios
    .get('/api/post/mentions_feed/' + user_id)
    .then((response: any) => {
      context.commit(SET_MENTIONS_FEED, response.data)
    })
}