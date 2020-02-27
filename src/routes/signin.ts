import "reflect-metadata";
import{User} from '../entity/User';
import { getRepository } from "typeorm";
const Router = require('koa-router');
const router = new Router();
const sha1 = require('sha1');

const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signin 登录页
router.get('/', checkNotLogin, async (ctx, next) =>{
    await ctx.render('signin') 
})

// POST /signin 用户登录
router.post('/', checkNotLogin, async (ctx, next) =>{
   console.log(ctx.request.body);
    const name = ctx.request.body.name
    const password = ctx.request.body.password
  
    // 校验参数
    try {
      if (!name.length) {
        throw new Error('请填写用户名')
      }
      if (!password.length) {
        throw new Error('请填写密码')
      }
    } catch (e) {
      ctx.flash('error', e.message)
      return ctx.redirect('back')
    }
  

    try{
        const userRepository = getRepository(User);
        let user = await userRepository.findOne(name);
        console.log(user);
        if(user == undefined) {
            ctx.flash('error', '用户不存在');
            return ctx.redirect('back');
        }
        //检查密码匹配
        if(sha1(password) != user.password) {
            ctx.flash('error', '用户名或密码错误');
            return ctx.redirect('back');
        } 
        ctx.flash('success', '登录成功');
        //用户信息写入session
        delete user.password;
        ctx.session.user = user;
        //跳转主页
        ctx.redirect('/posts');
    }catch(err) {
        await next(err);
    }
    /*UserModel.getUserByName(name)
      .then(function (user) {
        if (!user) {
          req.flash('error', '用户不存在')
          return res.redirect('back')
        }
        // 检查密码是否匹配
        if (sha1(password) !== user.password) {
          req.flash('error', '用户名或密码错误')
          return res.redirect('back')
        }
        req.flash('success', '登录成功')
        // 用户信息写入 session
        delete user.password
        req.session.user = user
        // 跳转到主页
        res.redirect('/posts')
      })
      .catch(next)*/
})

module.exports = router.routes()