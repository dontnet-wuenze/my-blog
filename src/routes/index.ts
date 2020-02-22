import "reflect-metadata";
const Router = require('koa-router');
const router = new Router();

module.exports = function (app) {
    app.use(router.get('/',   (ctx) =>{
      ctx.redirect('/posts')
    }).routes())
    app.use('/signup', require('./signup'))
    app.use('/signin', require('./signin'))
    app.use('/signout', require('./signout'))
    app.use('/posts', require('./posts'))
    app.use('/comments', require('./comments'))
  }
