import "reflect-metadata";
import { Post } from "../entity/Post";
import { getRepository } from "typeorm";
const Router = require('koa-router');
const router = new Router();

const checkLogin = require('../middlewares/check').checkLogin

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/',  async (ctx, next) => {
    const author = ctx.query.author
    try {
        let postRepository = getRepository(Post);
        let posts = await postRepository.find(author);
        console.log(posts);
        await ctx.render('post', {
            posts : posts
        })
    } catch(err) {
        throw err;
        await next(err);
    }
  /*PostModel.getPosts(author)
    .then(function (posts) {
      res.render('posts', {
        posts: posts
      })
    })
    .catch(next)*/
})

// POST /posts/create 发表一篇文章
router.post('/create', checkLogin, async (ctx, next) =>{
    const author = ctx.session.user._id;
    const title = ctx.request.body.title;
    const content = ctx.request.body.content;
  
    // 校验参数
    try {
      if (!title.length) {
        throw new Error('请填写标题')
      }
      if (!content.length) {
        throw new Error('请填写内容')
      }
    } catch (err) {
      ctx.flash('error', err.message)
      return ctx.redirect('back')
    }
  
    let post = {
      author: author,
      title: title,
      content: content
    }

    try {
        let postRepository = getRepository(Post);
        let article = await postRepository.save(post);
        ctx.flash('success', '发表成功');
        ctx.redirect(`${article._id}`);
    } catch(err) {
        console.log(err);
        await next(err);
    }
  
    /*PostModel.create(post)
      .then(function (result) {
        // 此 post 是插入 mongodb 后的值，包含 _id
        post = result.ops[0]
        req.flash('success', '发表成功')
        // 发表成功后跳转到该文章页
        res.redirect(`/posts/${post._id}`)
      })
      .catch(next)*/
})

// GET /posts/create 发表文章页
router.get('/create', checkLogin, async (ctx, next) =>{
    await ctx.render('create');
})

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', async (ctx, next) =>{
    const postId = ctx.params.postId

    let postRepository = getRepository(Post);

    Promise.all([
        postRepository.findOne(postId),
        postRepository
        .createQueryBuilder()
        .update("post")
        .set({pv: () => "'pv' + 1"
        })
        .execute()

    ]) 
      .then(async result => {
        const post = result[0];
        if(!post) {
            throw new Error('该文章不存在');
        }

        await ctx.render('post', {
            post : post
        })
      })
      .catch(await next())
   /* Promise.all([
      PostModel.getPostById(postId), // 获取文章信息
      PostModel.incPv(postId)// pv 加 1
    ])
      .then(function (result) {
        const post = result[0]
        if (!post) {
          throw new Error('该文章不存在')
        }
  
        res.render('post', {
          post: post
        })
      })
      .catch(next)*/
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, async (ctx, next) =>{
ctx.body = ('更新文章页')
})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, async (ctx, next) =>{
ctx.body = ('更新文章')
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, async (ctx, next) =>{
ctx.body = ('删除文章')
})

module.exports = router.routes()