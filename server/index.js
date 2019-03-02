const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

const path = require('path')
const mongoose = require('mongoose')
// const bodyParser = require('koa-bodyparser')
const convert = require('koa-convert')
const betterBody = require('koa-better-body')
const session = require('koa-session')
const users = require(path.join(__dirname, './interface/users'))
const publics = require(path.join(__dirname, './interface/public'))
const indexBody = require(path.join(__dirname, './interface/index-body'))
const product = require(path.join(__dirname, './interface/product'))
const order = require(path.join(__dirname, './interface/order'))
const ali = require(path.join(__dirname, './interface/alipay/ali'))
const sellers = require(path.join(__dirname, './interface/sellers'))


const dbsConfig = require(path.join(__dirname, './dbs/config'))

const app = new Koa()

// 连接数据库
mongoose.connect(dbsConfig.mongo, { useNewUrlParser: true })

// 设置 session
app.keys = ['yd']
const sessionConfig = {
  key: 'yd:sess',
  renew: true
}
app.use(session(sessionConfig, app))

// // bodyParser: 用于解析 post 请求体对象
// app.use(bodyParser())
// 用于解析 post 请求对象 支持上传文件
app.use(convert(betterBody({
  // 文件上传的目标目录
  uploadDir: path.join(__dirname, '../static/upload/sellers/img')
})))

// 中间件阻止 XSS 攻击
app.use(async (ctx, next) => {
  if(ctx.method === 'POST'){
    let req = ctx.request.fields
    for(key in req){
      if(req[key].includes){
        if(req[key].includes('<script>')){
          console.log("非法输入")
          return false
        }
      }
    }
  }
  await next()
})

// 中间件进行登录权限验证
app.use(async (ctx, next) => {
  let { userinfo, sellerinfo } = ctx.session,
                           url = ctx.url

  if(url === '/user_center' || url.indexOf('/reserve') >= 0){
    if(!userinfo){
      return ctx.response.redirect('/login')
    }
  }
  if(url === '/seller_center'){
    if(!sellerinfo){
      return ctx.response.redirect('/seller_login')
    }
  }
  if(url === '/register' || url === '/login'){
    if(userinfo){
      return ctx.response.redirect('/user_center')
    }
  }
  if(url === '/seller_register' || url === '/seller_login'){
    if(sellerinfo){
      return ctx.response.redirect('/seller_center')
    }
  }
  await next()
})

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // 开启路由
  app.use(users.routes()).use(users.allowedMethods())
  app.use(publics.routes()).use(publics.allowedMethods())
  app.use(indexBody.routes()).use(indexBody.allowedMethods())
  app.use(product.routes()).use(product.allowedMethods())
  app.use(order.routes()).use(order.allowedMethods())
  app.use(ali.routes()).use(ali.allowedMethods())
  app.use(sellers.routes()).use(sellers.allowedMethods())

  app.use(ctx => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
