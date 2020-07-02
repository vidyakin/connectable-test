
const Post = require('@models/post')
const User = require('@models/user')
const Group = require('@models/group')
const Comment = require('@models/comment')
const GroupParticipant = require('@models/groupParticipant')

const serializers = require('@/serializers');
const comment = require('../../models/comment')

/**
 * Common way for CRUD the model
 */
const router = require('@/crud')(Post, serializers.postSerializer)

/**
 * Подписчики пользователя
 */
router.get('/follows/:user_id', async (req,res) => {
  const posts = await Post.find({ "author.followers": req.params.user_id })
  res.send(posts);
})

/**
 * Посты, в группах, в которых состоит пользователь
 */
router.get('/group/user/:user_id', async (req,res) => {
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
      _id: { $in: groupIds}
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
router.get('/comments_feed/:user_id', async (req,res) => {
  try {
    let comments = [], posts = []
    // 1. Комментарии к приветственному посту
    posts = await Post.find({"parent.type": "system.GROUPS.NEW_USER", "parent.user.id": req.params.user_id}).select('_id')
    const comments_hello = await Comment
        .find({"parent.id": {$in: posts.map(p => p._id.toString())}})
        .select('parent.id author.id author.firstName author.lastName message created')
        .lean()
    comments = comments.concat(comments_hello.map(c => ({...c, type: "GROUPS.NEW_USER"})))

    // 2. Комментарии в блоге пользователя
    const obj = { type: "user", id: req.params.user_id}
    posts = await Post.find({parent: {$eq: obj} }).select("_id")
    
    const comments_blog =  await Comment
      .find({"parent.id": { $in: posts.map(p => p._id.toString()) }})
      .select('parent.id author.id author.firstName author.lastName message created')
      .lean()
    comments = comments.concat(comments_blog.map(c => ({...c, type: "USER.BLOG"})))
    
    // 3. Комментарии к постам юзера на стене
    posts = await Post.find({"parent.type": "feed", "author._id": req.params.user_id }).select("_id")
    const comments_feed =  await Comment
      .find({"parent.id": { $in: posts.map(p => p._id.toString()) }})
      .select('parent.id author.id author.firstName author.lastName message created')
      .lean()
    comments = comments.concat(comments_feed.map(c => ({...c, type: "USER.FEED"})))

    res.send(comments)
  } catch (error) {
    res.status(522).send(error)
  }    
})

module.exports = router