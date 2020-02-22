import "reflect-metadata";
const Router = require('koa-router');
const checkLogin = require('../middlewares/check').checkLogin
const router = new Router();

module.exports = function (app) {
    /*app.use(router.get('/',   (ctx) =>{
      ctx.redirect('/posts')
    }).routes())*/
//    app.use('/signup', require('./signup'))
  //  app.use('/signin', require('./signin'))
//    app.use('/signout', require('./signout'))
//    app.use('/posts', require('./posts'))
  //  app.use(require('./comments'))
  /*  app.use('/comments', router.post('/', checkLogin, async (ctx, next) =>{
      ctx.body = ('创建留言')
    }).routes())*/
    router.use(router.get('/',   (ctx) =>{
      ctx.redirect('/posts')
    }).routes())
    router.use('/signup', require('./signup'))
    router.use('/signin', require('./signin'))
    router.use('/signout', require('./signout'))
    router.use('/posts', require('./posts'))  
    router.use('/comments', require('./comments'))
      app
        .use(router.routes())
        .use(router.allowedMethods());
  }
