import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import Router = require("koa-router");
const controller = require('./controller');

createConnection().then(async connection => {
    const path = require('path');
    const session = require('koa-session');
    const render = require('koa-ejs');
    const Koa  = require('koa');
    const Router = require('koa-router');
    const koaBody = require('koa-body');
    const router = new Router();
    const app = new Koa();

    render(app,{
        root: path.join(__dirname, 'views'),
        layout: false,
        viewExt: 'ejs',
        cache: false,
        debug: false
  })

    app.use(koaBody());
    

    app
    .use(controller())
    .use(router.allowedMethods());

    app.use(async (ctx : any) => {
        ctx.status = 404;
        ctx.body = "ERR";
      });
    
      app.listen(3000);
      console.log('app started at port 3000...'); 

}).catch(error => console.log(error));
