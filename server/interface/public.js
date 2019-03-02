const Router = require('koa-router')
const path = require('path')

const axios = require(path.join(__dirname, './util/axios.js'))
const cityip = require(path.join(__dirname, '../dbs/models/cityip'))
const cities_cn = require(path.join(__dirname, '../dbs/models/cities_cn'))

let router = new Router()

router.get('/getIp', async (ctx, next) => {
  try{
    if(process.env.NODE_ENV === 'production'){
      // 获取本地 IP 线上使用
      var ip = ctx.req.headers['x-forwarded-for'] ||
        ctx.req.ip ||
        ctx.req.connection.remoteAddress ||
        ctx.req.socket.remoteAddress ||
        ctx.req.connection.socket.remoteAddress || '';
      if (ip.split(',').length > 0) {
        ip = ip.split(',')[0]
      }
    } else{
      // 获取外网 IP  223.125.74.12
      var { data: ip } = await axios.get('http://ifconfig.me/ip')
      // let ip = '223.14.200.100'
    }

    // 获取 ip 地址最后一个 '.' 的位置
    let index = ip.lastIndexOf('.')
    // 截取最后一个 '.' 之前的字段  223.125.74
    let subIp = ip.slice(0, index)
    // 得到正则表达式 /^223\.125\.74/
    let subIpReg = new RegExp(('^' + subIp).replace(/\./g, '\\.'))

    // 获取最后一个'.' 和倒数第二个'.' 之间的数字
    let subNum = Number(subIp.slice(subIp.lastIndexOf('.') + 1, subIp.length))
    // 获取倒数第二个 '.' 及前面的字符
    let subIp2 = subIp.slice(0, subIp.lastIndexOf('.') + 1)

    // 根据 subIpReg 查询数据库
    let result = ''
    let getCity = async () => {
      result = await cityip.findOne({
        $or:[{startIp: subIpReg},{endIp: subIpReg}]
      })
      if(!result){
        if(subNum === -1){
          return Promise.resolve('自动定位失败')
        }
        // 如果没查到数据，将 subNum -- 并拼接为新的 ip 地址继续查询
        subIpReg = new RegExp(('^' + subIp2 + (--subNum)).replace(/\./g, '\\.'))
        return getCity()
      }
      if (result) {
        let {
          city
        } = result

        if (city) {
          return Promise.resolve(city.replace('市', ''))
        }
        return Promise.resolve('自动定位失败')
      }
    }
    return ctx.body = await getCity()
  }catch(err){
    return ctx.body = '自动定位失败'
  }
})

// 获取所有城市
router.get('/getCities', async (ctx, next) => {
  // 查询包含 parent_id 不为 0 的数据
  let result = await cities_cn.find({$or:[{"parent_id":{$ne:"0"}}, {"name": /北京|重庆|上海|天津|澳门|香港/ }]})
  let cities = []
  result.forEach((item, index) => {
    // 将所有城市添加到 cities 数组中
    cities.push(item.name)
  })
  // console.log(cities)
  ctx.body = cities
})

// 传送 user seesion
router.get('/users/getsession', async (ctx, next) => {
  return ctx.body = ctx.session.userinfo
})

// 传送 seller seesion
router.get('/sellers/getsession', async (ctx, next) => {
  return ctx.body = ctx.session.sellerinfo
})

// 登录页面，判断是否已经登录
// router.get('/login', async (ctx, next) => {
//   let getSession = await axios.get('/users/getsession')
//   console.log(getSession)
// })

module.exports = router
