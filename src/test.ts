const path = require('path');
const config = require('config-lite')(path.join(__dirname, '..'  ));
const session = require('koa-session-minimal');
const MysqlSession = require('koa-mysql-session');
const render = require('koa-ejs');
const Koa  = require('koa');
const flash = require('koa-better-flash');
const Static = require('koa-static');
const Router = require('koa-router');
const koaBody = require('koa-body');
const pkg = require('../package')
const router = new Router();
const route = require('./routes');
const app = new Koa();

render(app,{
    root: path.join(__dirname, '../views'),
    layout: false,
    viewExt: 'ejs',
    cache: false,
    debug: false
  })

  const staticPath = '../public';
  app.use(Static(path.join( __dirname,  staticPath)))
  // session 中间件
/*app.use(session({
  name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true, // 强制更新 session
  saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
  cookie: config.cookie,
  store: new MysqlSession({
    user: config.mysqldb.user,
    password: config.mysqldb.password,
    database: config.mysqldb.database,
    host: config.mysqldb.host,
  })}))*/
// flash 中间件，用来显示通知
app.use(async (ctx, next) =>{
    ctx.state.blog = {
      title: pkg.name,
      description: pkg.description
    }

    ctx.state.user = {
        _id : 1
    }
  //  ctx.state.user = ctx.session.user
    ctx.state.success = "success";
    ctx.state.error = "error";
    await next()
  })
  router.get('/', async(ctx, next) => {
      await ctx.render('signup');
  })

  app.use(router.routes());
  app.use(async (ctx : any) => {
      ctx.status = 404;
      ctx.body = "ERR";
    });
  
    app.listen(3000);
    console.log('app started at port 3000...'); 