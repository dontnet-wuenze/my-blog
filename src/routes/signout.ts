import "reflect-metadata";
const Router = require('koa-router')
const router = new Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /signout 登出
router.get('/', checkLogin, (ctx) =>{
  ctx.body = ('登出')
})

module.exports = router