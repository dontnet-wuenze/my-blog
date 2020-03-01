import "reflect-metadata";
import { Comment } from "../entity/Comment";
import { getRepository } from "typeorm";
import { cpus } from "os";
const Router = require("koa-router");
const router = new Router();
const checkLogin = require('../middlewares/check').checkLogin

// POST /comments 创建一条留言
router.post('/', checkLogin, async (ctx, next) =>{
  const author = ctx.session.user._id;
  const postId = ctx.request.body.postId;
  const content = ctx.request.body.content;

  // 校验参数
  try {
    if (!content.length) {
      throw new Error('请填写留言内容')
    }
  } catch (err) {
    ctx.flash('error', err.message)
    return ctx.redirect('back')
  }

  const comment = {
    author: author,
    postId: postId,
    content: content
  }

  let commentRespository = getRepository(Comment);

  try {
    await commentRespository.insert(comment);
    ctx.flash('success', '留言成功');
    // 留言成功后跳转
    ctx.redirect('back');
  } catch(err) {
    throw err;
  }

})

// GET /comments/:commentId/remove 删除一条留言
router.get('/:commentId/remove', checkLogin, async (ctx, next) =>{
  const commentId = ctx.params.commentId;
  const author = ctx.session.user._id;

  let commentRespository = getRepository(Comment);

  try {
    let comment = await commentRespository.find(commentId);
    console.log(comment);
    /*if(!comment) {
      throw new Error('留言不存在');
    }
    if(comment.author.toString() !== author.toString()) {
      throw new Error('没有权限删除留言');
    }
    await commentRespository.delete(commentId);
    ctx.flash('success', '删除留言成功');
    //删除成功后跳转
    ctx.redirect('back');*/
  } catch(err) {
    throw err;
  }

})

module.exports = router.routes()