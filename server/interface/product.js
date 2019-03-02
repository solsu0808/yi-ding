const Router = require('koa-router')
const path = require('path')

const axios = require(path.join(__dirname, './util/axios.js'))
const product = require(path.join(__dirname, '../dbs/models/product'))
const comments = require(path.join(__dirname, '../dbs/models/comments'))
const menus = require(path.join(__dirname, '../dbs/models/menus'))

let router = new Router({
  prefix: '/product'
})

router.post('/get-good-profile', async (ctx, next) => {
  let req = ctx.request.fields,
      profile = '',
      totalProduct = ''

  // 判断是关键词搜索pname 还是 类型查找type 还是 详情页面sellerid
  if (req.pname) {
    let pname = new RegExp(req.pname)

    // 获取搜索结果总数
    let productPromise = product.find({
      $and: [{
        city: req.city
      }, {
        pname: pname
      }]
    })

    // 聚合管道
    let profilePromise = product.aggregate([{
        $lookup: {
          from: 'comments',
          localField: 'sellerid',
          foreignField: 'sellerid',
          as: 'comments'
        }
      },
      {
        $match: {
          $and: [{
            city: req.city
          }, {
            pname: pname
          }]
        }
      },
      {
        $skip: (req.page - 1) * 12
      },
      {
        $limit: 12
      }
    ])
    totalProduct = await productPromise
    profile = await profilePromise

  } else if(req.type){
    let type = await menus.findOne({type: req.type})
    let typeid = type.typeid
    let productPromise = product.find({$and:[{typeid: typeid},{city:req.city}]})

    let profilePromise = product.aggregate([{
        $lookup: {
          from: 'comments',
          localField: 'sellerid',
          foreignField: 'sellerid',
          as: 'comments'
        }
      },
      {
        $match: {
          $and: [{
            city: req.city
          }, {
            typeid: typeid
          }]
        }
      },
      {
        $skip: (req.page - 1) * 12
      },
      {
        $limit: 12
      }
    ])
    totalProduct = await productPromise
    profile = await profilePromise
  }else if(req.sellerid){
    profile = await product.aggregate([
      {
        $lookup: {
          from: 'comments',
          localField: 'sellerid',
          foreignField: 'sellerid',
          as: 'comments'
        }
      },
      {
        $match: {
          sellerid: req.sellerid
        }
      },
      {
        $limit: 1
      }
    ])
  }

  ctx.body = {
    profile,
    totalProduct: totalProduct.length
  }
})

// 获取首页搜索框搜索
router.post('/get-search-sug', async (ctx, next) => {
  let req = ctx.request.fields
  let pname = new RegExp(req.searchInput)
  let result = await product.aggregate([{
      $match: {
        $and: [{
          pname: pname
        }, {
          city: req.city
        }]
      }
    },
    {
      $limit: 10
    }
  ])
  ctx.body = result
})

// 获取搜索框下方搜索建议
router.post('/get-suggets', async (ctx, next) => {
  try{
    let result = await product.aggregate([
      {
        $match: {
          city: ctx.request.fields.city
        }
      },
      {
        $limit: 5
      }
    ])
    return ctx.body = result
  } catch(err){
    console.log(err)
    ctx.status = 500
    return ctx.body = '500: get-suggets err'
  }
})

module.exports = router
