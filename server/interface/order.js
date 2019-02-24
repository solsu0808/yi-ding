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
router.post('/get_orders', async (ctx, next) => {
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
    // 将超时未付款订单关闭
    order.forEach(async (item) => {
      if(new Date().getTime() - new Date(item.oDate).getTime() >= 30 * 60 *1000 && item.status === 1){
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

// 订单评价
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
      let result = await Orders.updateOne({orderid: req.orderId}, {status: 3})
      if(result.nModified){
        return ctx.body = 'success'
      }
    }
    ctx.status = 500
    return ctx.body = '评价失败(err500)'
  } catch(err){
    console.log(err)
    ctx.status = 500
    return ctx.body = '评价失败(err500)'
  }
})

module.exports = router
