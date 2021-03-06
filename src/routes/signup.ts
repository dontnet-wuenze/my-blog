import "reflect-metadata";
import { resolve } from "url";
import{User} from "../entity/User";
import { getRepository } from "typeorm";
const Router = require('koa-router')
const router = new Router()
const path = require('path')
const sha1 = require('sha1')
const fs = require('fs')

const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signup 注册页
router.get('/',  checkNotLogin, async (ctx, next) =>{
  await ctx.render('signup')
})
/*   ctx.body = 'sign up'
})*/

// POST /signup 用户注册
router.post('/', checkNotLogin, async (ctx, next) =>{
  ctx.body = JSON.stringify(ctx.request.files);
  ctx.type = 'application/json';
  //console.log(ctx.request.body);
  //console.log(ctx.request.files);
  const name = ctx.request.body.name || "";
  const gender = ctx.request.body.gender || ""
  const bio = ctx.request.body.bio || ""
  const avatar = ctx.request.files.avatar.path.split(path.sep).pop()
  let password = ctx.request.body.password || ""
  const repassword = ctx.request.body.repassword || ""

  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在 1-10 个字符')
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('性别只能是 m、f 或 x')
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介请限制在 1-30 个字符')
    }
    if (!ctx.request.files.avatar.name) {
      throw new Error('缺少头像')
    }
    if (password.length < 6) {
      throw new Error('密码至少 6 个字符')
    }
    if (password !== repassword) {
      throw new Error('两次输入密码不一致')
    }
  } catch (e) {
    // 注册失败，异步删除上传的头像
    fs.unlink(ctx.request.files.avatar.path, (err) => {
      if(err)
        throw(err);
      console.log("file was deleted");
    })
    ctx.flash('error', e.message)
    return ctx.redirect('/signup')
  }

  // 明文密码加密
  password = sha1(password)

  // 待写入数据库的用户信息
  let user = {
    name: name,
    password: password,
    gender: gender,
    bio: bio,
    avatar: avatar
  }
  try {
    let userRepository = getRepository(User);
    await userRepository.insert(user);
    console.log(user);
    delete user.password;
    ctx.session.user = user;
    ctx.flash('success', '注册成功');
    ctx.redirect('/posts');
  }catch(err){
    fs.unlink(ctx.request.files.avatar.path, (err) => {
      console.log("file was deleted");
    })
    console.log(err.message);
    // 用户名被占用则跳回注册页，而不是错误页
    if (err.message.match('ER_DUP_ENTRY')) {
      ctx.flash('error', '用户名已被占用')
      return ctx.redirect('/signup')
    }
    await next(err)
  }
/*  // 用户信息写入数据库
  UserModel.create(user)
    .then(function (result) {
      // 此 user 是插入 mongodb 后的值，包含 _id
      user = result.ops[0]
      // 删除密码这种敏感信息，将用户信息存入 session
      delete user.password
      request.session.user = user
      // 写入 flash
      request.flash('success', '注册成功')
      // 跳转到首页
      res.redirect('/posts')
    })
    .catch(function (e) {
      // 注册失败，异步删除上传的头像
      fs.unlink(request.files.avatar.path)
      // 用户名被占用则跳回注册页，而不是错误页
      if (e.message.match('duplicate key')) {
        request.flash('error', '用户名已被占用')
        return res.redirect('/signup')
      }
      next(e)
    })*/
})

module.exports = router.routes()