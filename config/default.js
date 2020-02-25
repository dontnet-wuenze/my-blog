module.exports = {
    port: 3305,
    session: {
      secret: 'myblog',
      key: 'myblog',
      maxAge: 2592000000
    },
    mysqldb : {
        user: 'root',
        password: '123456',
        database: 'my_blog',
        host: '127.0.0.1',
    },
    cookie :{
        maxAge: '', // cookie有效时长
        expires: '',  // cookie失效时间
        path: '', // 写cookie所在的路径
        domain: '', // 写cookie所在的域名
        httpOnly: '', // 是否只用于http请求中获取
        overwrite: '',  // 是否允许重写
        secure: '',
        sameSite: '',
        signed: '',
    },
    mongodb: 'mongodb://localhost:27017/myblog'
  }