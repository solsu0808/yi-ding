import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let state = {
  myCity:'定位中...',
  menus:'',
  user:'',
  beforeLogin:'/',
  searchSuggetsList: []
}

let mutations = {
  myCity(state, param){
    state.myCity = param
  },
  menus(state, param){
    state.menus = param
  },
  beforeLogin(state, param){
    state.beforeLogin = param
  },
  searchSuggetsList(state, param){
    state.searchSuggetsList = param
  }
}

let actions = {
  myCityAction(context,param){
    context.commit('myCity',param)
  },
  beforeLoginAction(context, param){
    context.commit('beforeLogin',param)
  },
  searchSuggetsListAction(context, param){
    context.commit('searchSuggetsList',param)
  },
  // 在项目初始时，页面渲染前获取分类列表
  async nuxtServerInit ({ commit }, ctx) {
    let menus = []
    let result = await ctx.$axios.get('/home/menus')
    result.data.forEach((item) => {
      menus.push(item)
    })
    commit('menus', menus)
  }
}

const store = () => new Vuex.Store({
  state,
  mutations,
  actions
})

export default store
