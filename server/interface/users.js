const Router = require('koa-router')
const path = require('path')
const nodemailer = require('nodemailer')
const dbsConfig = require(path.join(__dirname, '../dbs/config.js'))
const Users = require(path.join(__dirname, '../dbs/models/users'))
const redis = require('async-redis')

let router = new Router({
  prefix: '/users'
})

// 连接 redis
let client = redis.createClient(dbsConfig.redis.port, dbsConfig.redis.host);
// 连接失败
client.on('error', (error) => {
  return console.log(error)
})

// 获取验证码接口
router.post('/getcode', async (ctx, next) => {
  // 获取请求体对象 email 属性
  let email = ctx.request.fields.email
  // 根据 email 查找数据库
  let user = await Users.findOne({
    "email": email
  })
  if (user) {
    return ctx.body = '该邮箱已被注册'
  }

  // 创建发送服务
  let transporter = nodemailer.createTransport({
    service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
    port: 587, // SMTP 端口
    secureConnection: false, // 不使用 SSL 端口587  使用SSL 端口465
    auth: {
      user: dbsConfig.smtp.messenger,
      // 这里不是qq密码，是你设置的smtp授权码
      pass: dbsConfig.smtp.authorityPass
    },
    ignoreTLS: true,
    secure: false,
    debug: true
  })

  // 生成随机验证码
  let code = dbsConfig.smtp.code
  // 验证码有效时长
  let expire = dbsConfig.smtp.expire
  await client.setex(email, expire, code)
  // 定义发送参数
  let mailOptions = {
    // 发送方
    from: dbsConfig.smtp.messenger,
    // 接收方
    to: email,
    // 邮件标题
    subject: '一订', // Subject line
    // 发送text或者html格式
    html: `<h2>${code}</h2><div> ( 10 分钟内有效 )</div>`
  }

  // 执行发送操作
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return ctx.body = '邮箱发送失败'
    }
  })
  ctx.body = '邮箱发送成功'
})

// 注册接口
router.post('/signup', async (ctx, next) => {
  let {
    email,
    code,
    pass
  } = ctx.request.fields
  // 获取存放在 redis 中的验证码
  let redisCode = await client.get(email)
  if (redisCode !== code) {
    return ctx.body = '验证码不正确'
  }

  // 将用户信息写入 mongodb
  var newUser = new Users({
    email: email,
    pass: pass
  })
  let result = await newUser.save()
  ctx.body = result
})

// 登录接口
router.post('/signin', async (ctx, next) => {
  let {
    email,
    pass
  } = ctx.request.fields
  let result = await Users.findOne({
    "email": email
  })
  if (result === null) {
    return ctx.body = {
      code: -1,
      message: '邮箱未注册'
    }
  }
  if (pass !== result.pass) {
    return ctx.body = {
      code: -1,
      message: '密码不正确'
    }
  }
  if (pass === result.pass) {
    ctx.session.userinfo = email
    return ctx.body = {
      code: 0,
      message: '登录成功'
    }
  }
  ctx.status = 500
  return ctx.body = {
    code: -1,
    message: '未知错误'
  }
})

// 登出接口
router.get('/logout', async (ctx, next) => {
  ctx.session.userinfo = null
  if (ctx.session.userinfo === null) {
    return ctx.body = 'success'
  }
  ctx.body = 'error'
})

module.exports = router
