const Router = require('koa-router');
const router = new Router();

const checkLogin = require('../middlewares/check').checkLogin

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/',  (ctx) =>{
ctx.body = ('主页')
})

// POST /posts/create 发表一篇文章
router.post('/create', checkLogin,  (ctx) =>{
ctx.body = ('发表文章')
})

// GET /posts/create 发表文章页
router.get('/create', checkLogin,  (ctx) =>{
ctx.body = ('发表文章页')
})

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId',  (ctx) =>{
ctx.body = ('文章详情页')
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin,  (ctx) =>{
ctx.body = ('更新文章页')
})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin,  (ctx) =>{
ctx.body = ('更新文章')
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin,  (ctx) =>{
ctx.body = ('删除文章')
})

module.exports = router