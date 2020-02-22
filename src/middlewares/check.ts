module.exports = {
    checkLogin:  (ctx, next) =>{
      if (!ctx.session.user) {
        ctx.flash('error', '未登录')
        return ctx.redirect('/signin')
      }
      next()
    },
  
    checkNotLogin: (ctx, next) =>{
      if (ctx.session.user) {
        ctx.flash('error', '已登录')
        return ctx.redirect('back')// 返回之前的页面
      }
      next()
    }
  }