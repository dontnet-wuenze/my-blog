import "reflect-metadata";
const Router = require('koa-router');
const router = new Router();

const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signin 登录页
router.get('/', checkNotLogin, async (ctx, next) =>{
    await ctx.render('signin') 
})

// POST /signin 用户登录
router.post('/', checkNotLogin, async (ctx, next) =>{
ctx.body = ('登录')
})

module.exports = router.routes()