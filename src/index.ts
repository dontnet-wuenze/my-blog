import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
//import Router = require("koa-router");
const controller = require('./controller');

createConnection().then(async connection => {
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
      app.use(Static(path.join( __dirname,  staticPath)
      ))
      // session 中间件
    app.use(session({
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
      })}))
    // flash 中间件，用来显示通知
      app.use(flash())

      app.use(koaBody({
        multipart:true, // 支持文件上传
        encoding:'gzip',
        formidable:{
          uploadDir:path.join(__dirname,'../public/upload'), // 设置文件上传目录
          keepExtensions: true,    // 保持文件的后缀
          maxFieldsSize:2 * 1024 * 1024, // 文件上传大小
          onFileBegin:(name,file) => { // 文件上传前的设置
            // console.log(`name: ${name}`);
            // console.log(file);
          },
        }
      }));
    

    /*  app
      .use(controller())
      .use(router.allowedMethods());*/

      app.use(async (ctx, next) => {
        try {
          await next();
        } catch (err) {
          /*ctx.status = err.status || 500;
          ctx.body = err.message;
          ctx.app.emit('error', err, ctx);*/
          console.error(err)
          ctx.flash('error', err.message)
          ctx.redirect('/posts')
        }
      });

      app.use(async (ctx, next) =>{
        ctx.state.blog = {
          title: pkg.name,
          description: pkg.description
        }
        ctx.state.user = ctx.session.user
        ctx.state.success = ctx.flash('success').toString()
        ctx.state.error = ctx.flash('error').toString()
        await next()
      })
      route(app);

      app.use(async (ctx : any, next : any) => {
          ctx.status = 404;
          ctx.body = "ERR";
        });
      
        app.listen(3000);
        console.log('app started at port 3000...'); 

}).catch(error => console.log(error));
