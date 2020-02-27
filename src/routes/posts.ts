import "reflect-metadata";
const Router = require('koa-router');
const router = new Router();

const checkLogin = require('../middlewares/check').checkLogin

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/',  async (ctx, next) =>{
 await ctx.render('post');
})

// POST /posts/create 发表一篇文章
router.post('/create', checkLogin, async (ctx, next) =>{
ctx.body = ('发表文章')
})

// GET /posts/create 发表文章页
router.get('/create', checkLogin, async (ctx, next) =>{
ctx.body = ('发表文章页')
})

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', async (ctx, next) =>{
ctx.body = ('文章详情页')
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