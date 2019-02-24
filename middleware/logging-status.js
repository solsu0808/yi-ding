
export default async (ctx) => {
  // 预订需要登录
  if(ctx.route.path.indexOf('/reserve') === 0){
    let result = await ctx.$axios.get('/users/getsession')
    // 判断用户是否登录
    if(result.status === 204 && Boolean(result.data) === false){
      return ctx.app.router.push('/login')
    }
  }

  // 登录后不允许再进入登录或注册页面
  if(ctx.route.path.indexOf('/login') === 0 || ctx.route.path.indexOf('/register') === 0){
    let result = await ctx.$axios.get('/users/getsession')
    // 判断用户是否登录
    if(result.status === 200 && Boolean(result.data) === true){
      return ctx.app.router.back()
    }
  }

  // 进入用户中心需要先登录
  if(ctx.route.path.indexOf('/user_center') === 0){
    let result = await ctx.$axios.get('/users/getsession')
    // 判断是否登录
    if(result.status === 204 && Boolean(result.data) === false){
      return ctx.app.router.replace('/login')
    }
  }

  // 进入商家中心需要先预订
  if(ctx.route.path.indexOf('/seller_center') === 0){
    let result = await ctx.$axios.get('/sellers/getsession')
    // 判断商家是否登录
    if(result.status === 204 && Boolean(result.data) === false){
      return ctx.app.router.replace('/seller_login')
    }
  }

  // 商家登录后不允许再进入登录或注册页面
  if(ctx.route.path.indexOf('/seller_login') === 0 || ctx.route.path.indexOf('/seller_register') === 0){
    let result = await ctx.$axios.get('/sellers/getsession')
    // 判断用户是否登录
    if(result.status === 200 && Boolean(result.data) === true){
      return ctx.app.router.back()
    }
  }
  return false
}
