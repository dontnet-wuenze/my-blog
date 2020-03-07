import "reflect-metadata";
import { Post } from "../entity/Post";
import { Comment } from "../entity/Comment";
import { getRepository } from "typeorm";
const Router = require('koa-router');
const router = new Router();

const checkLogin = require('../middlewares/check').checkLogin

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/',  async (ctx, next) => {
    let author = ctx.query.author;
    //console.log(author);
    let posts = [];
    try {
        let postRepository = getRepository(Post);
        //let posts = await postRepository.find({relations : ["author"]});
        if(author !== undefined) {
          posts = await postRepository
                .createQueryBuilder("post")
                .leftJoinAndSelect("post.author", "author")
                .where("author._id = :author", { author: author })
                .getMany();
        } else {
          posts = await postRepository.find({relations : ["author"]});
        }

        //console.log(posts);
        await ctx.render('posts', {
            posts : posts
        })
    } catch(err) {
        throw err;
    }
})

// POST /posts/create 发表一篇文章
router.post('/create', checkLogin, async (ctx, next) =>{
    const author = ctx.session.user;
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
        throw err;
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
    let commentRepository = getRepository(Comment);
    const postManager = postRepository.manager;
    
    try {
      let post = await postRepository.findOne(postId, {relations : ["author"]});
      //let comments = await commentRepository.find(postId);
      let comments = await commentRepository
                    .createQueryBuilder("comment")
                    .leftJoinAndSelect("comment.author", "author")
                    .leftJoinAndSelect("comment.post", "post")
                    .where("post._id = :_id", {_id : postId})
                    .getMany();
      await postManager.increment(Post, {_id : postId}, "pv", 1)
      
      if(!post) {
        throw new Error('该文章不存在');
      }
      await ctx.render('post', {
          post : post,
          comments : comments
      })
    } catch(err) {
      throw err;
    }
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, async (ctx, next) =>{
  const postId = ctx.params.postId
  const author = ctx.session.user._id

  const postRepository = getRepository(Post);

  try {
      let post = await postRepository.findOne(postId, {relations : ["author"]});
      if(!post) {
        throw new Error('该文章不存在');
      }
      if(author.toString() !== post.author._id.toString()) {
        throw new Error('权限不足')
      }
      await ctx.render('edit', {
        post : post
      })
  } catch(err) {
    throw err;
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
    let post = await postRepository.findOne(postId, {relations : ["author"]});
    if(!post) {
      throw new Error('文章不存在');
    }
    if(post.author._id.toString() !== author.toString()) {
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
      let post = await postRepository.findOne(postId, {relations : ["author"]});
      if(!post) {
        throw new Error('文章不存在')
      }
      if(post.author._id.toString() !== author.toString()) {
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