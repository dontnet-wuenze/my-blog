import "reflect-metadata";
const Router = require('koa-router')
const router = new Router()

const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signup 注册页
router.get('/', checkNotLogin, (ctx) =>{
  ctx.body = ('注册页')
})

// POST /signup 用户注册
router.post('/', checkNotLogin, (ctx) =>{
  ctx.body = ('注册')
})

module.exports = router