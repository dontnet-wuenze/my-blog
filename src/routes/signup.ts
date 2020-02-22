import "reflect-metadata";
import { resolve } from "url";
const Router = require('koa-router')
const router = new Router()

const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signup 注册页
router.get('/',  async (ctx, next) =>{
  await ctx.render('signup')
})
/*   ctx.body = 'sign up'
})*/

// POST /signup 用户注册
router.post('/', checkNotLogin, async (ctx, next) =>{
  ctx.body = ('注册')
})

module.exports = router.routes()