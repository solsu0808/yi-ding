const Router = require('koa-router')
const path = require('path')
const fs = require('fs')
const Sellers = require(path.join(__dirname, '../dbs/models/sellers'))
const Product = require(path.join(__dirname, '../dbs/models/product'))

const router = new Router({prefix: '/sellers'})

// 商家图片上传
router.post('/upload', async (ctx, next) => {
  ctx.body = path.basename(ctx.request.fields.file[0].path)
})

// 删除上传的图片
router.post('/del-upload', async (ctx, next) => {
    await fs.unlink(path.join(__dirname, '../../static/upload/sellers/img/',ctx.request.fields.file),(err) => {
      if(err){
        ctx.status = 500
        return ctx.body = 'del-upload err'
      }
    })
    return ctx.body = '删除成功'
})

// 判断商家 ID 是否已经存在
router.post('/id-existed', async (ctx, next) => {
  let result = await Sellers.findOne({sellerId: ctx.request.fields.sellerId})
  if(result){
    // 商家 ID 已存在
    return ctx.body = true
  }
  // 商家 ID 未存在
  return ctx.body = false
})

// 商家注册
router.post('/signup', async (ctx, next) => {
  let req = ctx.request.fields
  // 将 req.img 转化为服务器绝对路径，并作为参数传入数据库
  let img = req.img.map((item) => {
    return path.join('/upload/sellers/img', item)
  })
  let newSeller = new Sellers({
    sellerId: req.sellerId,
    pass: req.pass
  })
  let newProduct = new Product({
    sellerid: req.sellerId,
    pname: req.pName,
    typeid: req.productType,
    city: req.city,
    location: req.location,
    averagepay: req.consume,
    phone: req.phone,
    info: req.desc,
    img: img
  })
  try{
    let seller = await newSeller.save()
  } catch(err){
    ctx.status = 500
    return ctx.body = 'seller save err'
  }
  try{
    let product = await newProduct.save()
  } catch(err){
    ctx.status = 500
    return ctx.body = 'product save err'
  }
  ctx.body = '商户注册成功'
})

// 商家登录接口
router.post('/signin', async (ctx, next) => {
  let { sellerId, pass } = ctx.request.fields
  try{
    let result = await Sellers.findOne({ "sellerId": sellerId })
    if(result === null){
      return ctx.body = '商户ID不存在'
    }
    if( pass !== result.pass){
      return ctx.body = '密码不正确'
    }
    if(pass === result.pass){
      ctx.session.sellerinfo = sellerId
      return ctx.body = '登录成功'
    }
  } catch(err){
    ctx.status = 500
    console.log(err)
    return ctx.body = err
  }
})

// 商家登出接口
router.get('/logout', async (ctx, next) => {
  ctx.session.sellerinfo = null
  if(ctx.session.sellerinfo === null){
    return ctx.body = 'success'
  }
  ctx.status = 500
  ctx.body = 'error'
})

module.exports = router
