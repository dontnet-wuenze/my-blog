import "reflect-metadata";
const koa = require("koa");
const koaBody = require('koa-body');


var users_name_get = async(ctx, next)=> {
    await ctx.render('signup')
  }
  
  module.exports = {
      'GET /user/:name': users_name_get
  }