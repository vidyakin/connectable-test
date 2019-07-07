const likeDao = require('./dao/like-dao');
const commentDao = require('./dao/comment-dao');

module.exports.postSerializer = async (data) => {
  if (Array.isArray(data)) {
    return await arrayPostSerializer(data);
  } else {
    data.likes = await likeDao.findByParent({parent: {type: 'post', id:'' + data._id}});
    data.comments = await commentDao.findByParent({parent: {type: 'post', id:'' + data._id}});
    return data;
  }
};

module.exports.serializer = async (data) => {
  return data;
};

async function arrayPostSerializer(data) {
  return new Promise((resolve, rejected) => {
    const result = [];
    Promise.all(data.map(async(post) => {
      post.comments = await commentDao.findByParent({parent: {type: 'post', id:'' + post._id}});
      post.likes = await likeDao.findByParent({parent: {type: 'post', id:'' + post._id}});
      result.push(post);
    })).then(() => {
      resolve(result);
    })
      .catch(e => {
        rejected(e);
      });
  })
}
