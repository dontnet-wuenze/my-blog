import "reflect-metadata";
import { Post } from "../entity/Post";
import { getRepository, EntityManager } from "typeorm";
import { create } from "domain";
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
        await ctx.render('posts', {
            posts : posts
        })
    } catch(err) {
        console.log(err);
        await next();
    }
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
  
})

// GET /posts/create 发表文章页
router.get('/create', checkLogin, async (ctx, next) =>{
    await ctx.render('create');
})

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', async (ctx, next) =>{
    const postId = ctx.params.postId

    let postRepository = getRepository(Post);
    const postManager = postRepository.manager;
    
    try {
      let post = await postRepository.findOne({"_id" : postId});
      await postManager.increment(Post, {_id : postId}, "pv", 1)

      if(!post) {
        throw new Error('该文章不存在');
      }
      await ctx.render('post', {
          post : post
      })
    } catch(err) {
      console.log(err);
    }
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, async (ctx, next) =>{
  const postId = ctx.params.postId
  const author = ctx.session.user._id

  const postRepository = getRepository(Post);

  try {
      let post = await postRepository.findOne({"_id" : postId});
      if(!post) {
        throw new Error('该文章不存在');
      }
      if(author.toString() !== post.author.toString()) {
        throw new Error('权限不足')
      }
      await ctx.render('edit', {
        post : post
      })
  } catch(err) {
        console.log(err);
  }
})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, async (ctx, next) =>{
  const postId = ctx.params.postId
  const author = ctx.session.user._id
  const title = ctx.request.body.title
  const content = ctx.request.body.content

  const postRepository = getRepository(Post);

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

  try {
    let post = await postRepository.findOne({_id : postId});
    if(!post) {
      throw new Error('文章不存在');
    }
    if(post.author.toString() !== author.toString()) {
      throw new Error('没有权限');
    }

    await postRepository.update(postId, {title : title, content : content});
    ctx.flash('success', '编辑成功');
    ctx.redirect(`/post/${postId}`);
  } catch (err) {
    console.log(err);
    await next();
  }
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, async (ctx, next) =>{
  const postId = ctx.params.postId
  const author = ctx.session.user._id

  const postRepository = getRepository(Post);

  try {
      let post = await postRepository.findOne({"_id" : postId});
      if(!post) {
        throw new Error('文章不存在')
      }
      if(post.author.toString() !== author.toString()) {
        throw new Error('没有权限');
      }
      
      await postRepository.delete(postId);
      ctx.flash('success', '删除文章成功');
      // 删除成功跳转主页
      ctx.redirect('/posts');
  } catch(err) {
      console.log(err);
      await next();
  } 

})

module.exports = router.routes()