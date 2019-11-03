import Vue from 'vue';
import {
  ADD_ANSWER_FOR_COMMENT,
  ADD_COMMENT_FOR_POST,
  ADD_LIKE_FOR_COMMENT,
  ADD_LIKE_FOR_POST,
  ADD_POST, CHANGE_POST,
  REMOVE_POST,
  SET_POSTS,
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

export const repost = (context: any, post: any) => {
  return Vue.axios
    .post('api/post', post)
    .then((response: any) => {
      return ;
    });
};

export const getPosts = (context: any, parent: any) => {
  context.commit(SET_POSTS, []);
  return Vue.axios
    .get('api/post', {params: parent})
    .then((response: any) => {
      context.commit(SET_POSTS, response.data.result);
    });
};

export const sendLike = (context: any, like: any) => {
  return Vue.axios
    .post('api/like', like)
    .then((response: any) => {
      const newLike = response.data.result;
      if (newLike.parent.type === 'post') {
        context.commit(ADD_LIKE_FOR_POST, newLike);
      }
      if (newLike.parent.type === 'comment') {
        context.commit(ADD_LIKE_FOR_COMMENT, newLike);
      }
    });
};
export const dislike = (context: any, disLike: any) => {
    return Vue.axios
        //.delete(`api/dislike/${arrRes}`)
        .post('api/dislike', disLike)
        .then((response: any) => {
            return response.data;
            /*const newLike = response.data.result;
            if (newLike.parent.type === 'post') {
                context.commit(ADD_LIKE_FOR_POST, newLike);
            }
            if (newLike.parent.type === 'comment') {
                context.commit(ADD_LIKE_FOR_COMMENT, newLike);
            }*/

        });
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
