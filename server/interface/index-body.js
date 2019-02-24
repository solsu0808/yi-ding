const Router = require('koa-router')
const path = require('path')
const dbsConfig = require(path.join(__dirname, '../dbs/config.js'))
const CategoryMenus = require(path.join(__dirname, '../dbs/models/category_menus'))
const Product = require(path.join(__dirname, '../dbs/models/product'))

let router = new Router({prefix: '/home'})

router.get('/menus', async (ctx, next) => {
  let result = await CategoryMenus.find({})
  ctx.body = result
})

router.post('/suggest-hotel', async (ctx, next) => {
  try{
    let result = await Product.find({$and: [{city: ctx.request.fields.city}, {typeid: '02'}]},null,{limit: 6})
    ctx.body = result
  } catch(err){
    console.log(err)
    ctx.body = []
  }
})

module.exports  = router
