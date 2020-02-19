const Router = require("koa-router");
router = new Router();
const checkLogin = require('../middlewares/check').checkLogin

// POST /comments 创建一条留言
router.post('/', checkLogin,(ctx) =>{
  ctx.body = ('创建留言')
})

// GET /comments/:commentId/remove 删除一条留言
router.get('/:commentId/remove', checkLogin,(ctx) =>{
  ctx.body = ('删除留言')
})

module.exports = router