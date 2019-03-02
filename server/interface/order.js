const Router = require('koa-router')
const path = require('path')

const axios = require(path.join(__dirname, './util/axios'))
const Orders = require(path.join(__dirname, '../dbs/models/order'))
const Comments = require(path.join(__dirname, '../dbs/models/comments'))

let router = new Router({prefix: '/order'})

// 提交订单
router.post('/submit', async (ctx, next) => {
  try{
    let req = ctx.request.fields
    // 实例化 model 并插入数据
    let newOrder = new Orders({
      userid: req.userId,
      sellerid: req.sellerId,
      rname:req.name,
      phone:req.phone,
      rnumber: req.numberPeople,
      rDate: req.date,
      remark:req.remark,
      orderid: req.orderId,
      status: 1,
      oDate: req.oDate,
      rPrice: req.rPrice
    })
    // 保存数据到数据库
    let result = await newOrder.save()
    if(!result){
      ctx.status = 500
      return ctx.body = '订单创建失败'
    }
    ctx.status = 200
    ctx.body = '订单创建成功'
  } catch(err){
    ctx.status = 500
    ctx.body = '服务器错误'
  }

})

// 获取用户订单
router.post('/get_user_orders', async (ctx, next) => {
  try{
    let order = await Orders.aggregate([
      {
        $lookup: {
          from: 'product',
          localField: 'sellerid',
          foreignField: 'sellerid',
          as: 'product'
        }
      },
      {
        $match: {userid: ctx.request.fields.userId}
      },
      {
        $sort: {rDate: -1}
      }
    ])

    order.forEach(async (item) => {
      // 把符合条件（日期到了预订日期）的待使用订单转换为待评价
      if(new Date() - new Date(item.rDate) >= 0 && item.status === 2){
        let changeStatus = await Orders.updateOne({orderid: item.orderid},{status: 3})
        if(changeStatus.nModified){
          item.status = 3
        }
      }
      // 将超时未付款订单关闭
      if(new Date() - new Date(item.oDate) >= 30 * 60 *1000 && item.status === 1){
        let changeStatus = await Orders.updateOne({orderid: item.orderid},{status: 0})
        if(changeStatus.nModified){
          item.status = 0
        }
      }
    })

    return ctx.body = order
  } catch(err){
    ctx.status = 500
    return ctx.body = 'get_orders err'
  }
})

// 用户订单评价
router.post('/comment',async (ctx, next) => {
  let req = ctx.request.fields
  try{
    let newComment = new Comments({
      orderid: req.orderId,
      info: req.info,
      star: req.star,
      userid: req.userId,
      sellerid: req.sellerId,
      ctime: req.cTime
    })
    let result = await newComment.save()
    if(result.orderid){
      let result = await Orders.updateOne({orderid: req.orderId}, {status: 4})
      if(result.nModified){
        return ctx.body = 'success'
      }
    }
    ctx.status = 500
    console.log('评价失败1(err500)')
    return ctx.body = '评价失败1(err500)'
  } catch(err){
    console.log('评价失败2(err500)')
    ctx.status = 500
    return ctx.body = '评价失败2(err500)'
  }
})

// 获取商家订单
router.post('/get_seller_orders', async (ctx, next) => {
  try{
    // 取得待使用和待商家回复订单
    let order = await Orders.find({$and: [{sellerid: ctx.request.fields.sellerId},{$or:[{status: 2},{status: 4},{status: 5}]}]})
    // 把符合条件（日期到了预订日期）的待使用订单转换为待评价
    order.forEach(async (item) => {
      if(new Date() - new Date(item.rDate) >= 0 && item.status === 2){
        let changeStatus = await Orders.updateOne({orderid: item.orderid},{status: 3})
        if(changeStatus.nModified){
          item.status = 3
        }
      }
    })
    return ctx.body = order
  }catch(err){
    console.log(err)
    ctx.status = 500
    return ctx.body = '500: get seller order err'
  }
})

// 商家回复
router.post('/reply', async (ctx, next) => {
  let req = ctx.request.fields
  try{
    let result = await Comments.updateOne({orderid: req.orderId},{$set:{reply: req.info, rtime: req.rTime}})
    if(result.nModified){
      let result = await Orders.updateOne({orderid: req.orderId}, {status: 5})
      if(result.nModified){
        return ctx.body = 'success'
      }
      ctx.status = 500
      console.log('500: reply err1')
      return ctx.body = '500: reply err1'
    }
    ctx.status = 500
    console.log('500: reply err2')
    return ctx.body = '500: reply err2'
  } catch(err){
    console.log(err)
    return ctx.body = '500: reply err3'
  }
})

// 取消订单
router.post('/close', async (ctx, next) => {
  try{
    let result = await Orders.updateOne({orderid: ctx.request.fields.orderId}, {status: 0})
    if(result.nModified){
      return ctx.body = 'success'
    }
    ctx.status = 500
    return status = '500: close err1'
  } catch(err){
    console.log(err)
    ctx.status = 500
    return ctx.body = '500: close err2'
  }

})

module.exports = router
