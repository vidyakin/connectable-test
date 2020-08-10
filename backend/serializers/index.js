const likeDao = require('../dao/like-dao');
const commentDao = require('../dao/comment-dao');

module.exports.serializer = async (data) => {
  return data;
};

module.exports.postSerializer = async (data) => {
  if (Array.isArray(data)) {
    return await arrayPostSerializer(data);
  } else {
    //data.likes = await likeDao.findByParent({parent: {type: 'post', id:'' + data._id}});
    data.comments = await commentSerializerLocale(await commentDao.findByParent({ parent: { type: 'post', id: '' + data._id } }));
    return data;
  }
};


async function arrayPostSerializer(data) {
  return new Promise((resolve, rejected) => {
    const result = [];
    Promise.all(data.map(async (post) => {
      post.comments = await commentSerializerLocale(await commentDao.findByParent({ parent: { type: 'post', id: '' + post._id } }));
      //post.likes = await likeDao.findByParent({ parent: { type: 'post', id: '' + post._id } });
      result.push(post);
    })).then(() => {
      resolve(result);
    })
      .catch(e => {
        rejected(e);
      });
  })
}

module.exports.commentSerializer = async function (data) {
  if (Array.isArray(data)) {
    return await arrayCommentSerializer(data);
  } else {
    data.likes = await likeDao.findByParent({ parent: { type: 'comment', id: '' + data._id } });
    data.answers = await commentDao.findByParent({ parent: { type: 'comment', id: '' + data._id } });
    return data;
  }
};

async function commentSerializerLocale(data) {
  if (Array.isArray(data)) {
    return await arrayCommentSerializer(data);
  } else {
    data.likes = await likeDao.findByParent({ parent: { type: 'comment', id: '' + data._id } });
    data.answers = await commentDao.findByParent({ parent: { type: 'comment', id: '' + data._id } });
    return data;
  }
}


async function arrayCommentSerializer(data) {
  return new Promise((resolve, rejected) => {
    const result = [];
    Promise.all(data.map(async (post) => {
      post.answers = await answerSerializerLocale(await commentDao.findByParent({ parent: { type: 'comment', id: '' + post._id } }));
      post.likes = await likeDao.findByParent({ parent: { type: 'comment', id: '' + post._id } });
      result.push(post);
    })).then(() => {
      resolve(result);
    })
      .catch(e => {
        rejected(e);
      });
  })
}

module.exports.answerSerializer = async function (data) {
  if (Array.isArray(data)) {
    return await arrayAnswerSerializer(data);
  } else {
    data.likes = await likeDao.findByParent({ parent: { type: 'answer', id: '' + data._id } });
    return data;
  }
};

async function answerSerializerLocale(data) {
  if (Array.isArray(data)) {
    return await arrayAnswerSerializer(data);
  } else {
    data.likes = await likeDao.findByParent({ parent: { type: 'answer', id: '' + data._id } });
    return data;
  }
}


async function arrayAnswerSerializer(data) {
  return new Promise((resolve, rejected) => {
    const result = [];
    Promise.all(data.map(async (post) => {
      post.likes = await likeDao.findByParent({ parent: { type: 'answer', id: '' + post._id } });
      result.push(post);
    })).then(() => {
      resolve(result);
    })
      .catch(e => {
        rejected(e);
      });
  })
}
