问题描述
=======

之前对于 promise 与 async/await 的理解就不是很到位

现在遇到了情况就陷入了尴尬的境地

大概要实现一个并行的数据库操作

得到数据后渲染前端界面

``` typescript
Promise.all([
        await postRepository.findOne({"_id" : postId}),
        await postManager.increment(Post, {_id : postId}, "pv", 1)
    ]) 
      .then(async result => {
        const post = result[0];
        console.log(result);
        console.log(post);
        if(!post) {
            throw new Error('该文章不存在');
        }
        //ctx.body = post;
        await ctx.render('post', {
            post : post
        })
      })
      .catch(err => {
        console.log(err);
      })
```

但实现起来却问题百出

首先```Repository```框架的异步函数用```await```后就会同步，失去了```Promise```并行的目的

并且当我在```then```中使用```await render```时，就会出现异常(尚未解决)

而不进行异步操作的```ctx.body```却能正常显示