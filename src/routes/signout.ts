import "reflect-metadata";
const Router = require('koa-router')
const router = new Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /signout 登出
router.get('/', checkLogin, async (ctx, next) =>{
  // 清空 session 中用户信息
  ctx.session.user = null
  ctx.flash('success', '登出成功')
  // 登出成功后跳转到主页
  ctx.redirect('/posts')
})

module.exports = router.routes()