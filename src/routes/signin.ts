import "reflect-metadata";
const Router = require('koa-router');
const router = new Router();

const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signin 登录页
router.get('/', checkNotLogin, (ctx) =>{
ctx.body = ('登录页')
})

// POST /signin 用户登录
router.post('/', checkNotLogin, (ctx) =>{
ctx.body = ('登录')
})

module.exports = router