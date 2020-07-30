
const mongoose = require('mongoose');

const Post = require('@models/post')
const User = require('@models/user')
const Group = require('@models/group')
const Comment = require('@models/comment')
const GroupParticipant = require('@models/groupParticipant')

const serializers = require('@/serializers');

/**
 * Common way for CRUD the model
 */
const router = require('@/crud')(Post, serializers.postSerializer)

function compareByDate(a, b) {
  if (a.created < b.created) return 1;
  if (a.created > b.created) return -1;
  return 0;
}

/**
 * Подписчики пользователя
 */
router.get('/follows/:user_id', async (req, res) => {
  const posts = await Post.find({ "author.followers": req.params.user_id })
  res.send(posts);
})

router.post('/like', async (req, res) => {
  const { post_id, user_id, parent } = req.body
  try {
    const post = await Post.findById(mongoose.Types.ObjectId(post_id))
    if (!post) return res.status(404).send('post not found')
    // set like, if user did not liked earlier
    if (!post.likes.find(l => l.author._id.toString() == user_id)) {
      post.likes.push({ author: user_id })
      await post.save()
      // populate existing doc and send full data to client
      await post.populate(`likes.${post.likes.length - 1}.author`, 'firstName lastName').execPopulate()
      res.send({
        status: 201,
        result: {
          ...post.likes[post.likes.length - 1]._doc,
          parent
        }
      });
    }
    else {
      res.send({
        status: 400,
        result: 'The user has likes the post yet'
      });
    }
  } catch (error) {
    console.log('>> LIKE ERROR ', error);
    res.status(500).send(error)
  }
})

router.post('/dislike', async (req, res) => {
  const { post_id, user_id, parent } = req.body
  try {
    const post = await Post.findById(mongoose.Types.ObjectId(post_id))
    if (!post) return res.status(404).send('post not found')
    const deletedLike = post.likes.find(l => l.author._id.toString() === user_id)
    // if post has user's like, remove it
    if (deletedLike) {
      post.likes = post.likes.filter(l => l.author._id.toString() !== user_id)
      await post.save()
      res.send({
        status: 201,
        result: {
          ...deletedLike._doc,
          parent
        },
        info: deletedLike ? 'The post was be disliked' : 'User didn"t not liked this post'
      });
    } else {
      res.send({
        status: 404,
        result: {},
        info: "No likes was deleted"
      })
    }
  } catch (error) {
    console.log('>> DISLIKE ERROR ', error);
    res.status(500).json(error)
  }
})

/**
 * Посты, в группах, в которых состоит пользователь
 */
router.get('/group/user/:user_id', async (req, res) => {
  //console.log(`>> Posts in groups`);
  // 1st - find a workspace of user  
  const user = await User.findById(req.params.user_id)
  //console.log(`>> Client ID ${user._id} , ${user.client_id}`);
  // 2nd - find groups where user is participant
  let groupIds = await GroupParticipant.find()
    .where('participantId').equals(user._id)
    .select('groupId')
  if (groupIds.length) {
    groupIds = groupIds.map(_ => mongoose.Types.ObjectId(_.groupId))
  }
  //console.log(`>> groupIds ${groupIds}`);
  // 3rd - find all groups that user can see messages - open groups and groups as participant, not own groups
  const user_groups = await Group.find({
    client_id: user.client_id,
    // собственные группы исключать?
    //creatorId: {"$ne": user._id}, 
    _id: { $in: groupIds }
  })
  // 3rd - post in that groups
  try {
    //console.log(`>> groupsIds ${groupsIds}`);
    const posts = await Post.find({
      "parent.type": "group",
      "parent.id": user_groups.map(u => u._id.toString())
    })
    //console.log(`posts: ${JSON.stringify(posts,null,2)}`);
    res.send(posts)
  } catch (error) {
    res.status(500).send(error)
  }
})

/**
 * Лента комментариев разных типов
 */
router.get('/comments_feed/:user_id', async (req, res) => {
  try {
    let comments = [], posts = []
    // 1. Комментарии к приветственному посту
    posts = await Post.find({ "parent.type": "system.GROUPS.NEW_USER", "parent.user.id": req.params.user_id }).select('_id')
    const comments_hello = await Comment
      .find({ "parent.id": { $in: posts.map(p => p._id.toString()) } })
      .select('parent.id author.id author.firstName author.lastName message created')
      .lean()
    comments = comments.concat(comments_hello.map(c => ({ ...c, type: "GROUPS.NEW_USER" })))

    // 2. Комментарии в блоге пользователя
    const obj = { type: "user", id: req.params.user_id }
    posts = await Post.find({ parent: { $eq: obj } }).select("_id")

    const comments_blog = await Comment
      .find({ "parent.id": { $in: posts.map(p => p._id.toString()) } })
      .select('parent.id author.id author.firstName author.lastName message created')
      .lean()
    comments = comments.concat(comments_blog.map(c => ({ ...c, type: "USER.BLOG" })))

    // 3. Комментарии к постам юзера на стене
    posts = await Post.find({ "parent.type": "feed", "author._id": req.params.user_id }).select("_id")
    const comments_feed = await Comment
      .find({ "parent.id": { $in: posts.map(p => p._id.toString()) } })
      .select('parent.id author.id author.firstName author.lastName message created')
      .lean()
    comments = comments.concat(comments_feed.map(c => ({ ...c, type: "USER.FEED" })))

    // 4. Комментарии к постам юзера в группах
    posts = await Post.find({ "parent.type": "group", "author._id": req.params.user_id }).select("_id")
    const comments_groups = await Comment
      .find({ "parent.id": { $in: posts.map(p => p._id.toString()) } })
      .select('parent.id author.id author.firstName author.lastName message created')
      .lean()
    comments = comments.concat(comments_groups.map(c => ({ ...c, type: "USER.GROUP" })))

    res.send(comments.sort(compareByDate))
  } catch (error) {
    res.status(522).send(error)
  }
})

router.get('/mentions_feed/:user_id', async (req, res) => {
  try {
    // 1. найдем упоминания в постах
    let post_m = await Post
      .find({ mentions: { $in: req.params.user_id } })
      .populate("author_ref", "firstName lastName")
      .select('message parent author_ref created')
      .lean()
    post_m = post_m.map(d => ({
      ...d,
      type: "post." + d.parent.type,
      link: d.parent.id
    }))
    // 2. найдем упоминания в комментариях
    let comment_m = await Comment
      .find({ mentions: { $in: req.params.user_id } })
      //.populate("author_ref", "firstName lastName")
      .select('message parent author.firstName author.lastName created')
      .lean()
    comment_m = await Promise.all(comment_m.map(async d => {
      if (d.parent.type == 'comment') return {
        ...d,
        type: "comment"
      }
      else {
        const post = await Post.findById(d.parent.id).select('parent')
        return {
          ...d,
          type: "comment." + post.parent.type,
          link: post.parent.id
        }
      }
    }))
    // comment_m = comment_m.map(async c => {
    //   if (c.parent.type == 'comment') return c
    //   const post = await Post.findById(c.parent.id).select('parent')
    //   return {
    //     ...c,
    //     type: c.type += '.'+post.parent.type
    //   }
    // })
    res.json([].concat(post_m).concat(comment_m).sort(compareByDate))
  } catch (error) {
    console.log(error);
    res.status(522).send(error)
  }
})

/**
 * Sample select & populate data :
 */
// res.send(await Post.findById(req.params.id)
//     .populate("mentions", "firstName lastName") // get only 2 fields of nested object 
//     .populate("author_ref") // full populate other field
//     .select('created message mentions author_ref')) // all fields of whole object that will be in result

module.exports = router