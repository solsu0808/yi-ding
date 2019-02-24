<template lang="html">
  <div class="head-nav">
    <el-row class="head-row">
      <el-col :span="19">
        <i class="el-icon-location-outline"></i>
        <nuxt-link to="/choosecity" class="main-color chooseCity"><span>{{ $store.state.myCity }}</span></nuxt-link>
        <template v-if="nologin">
          <nuxt-link to="/register"> 注册</nuxt-link>
          <span> / </span>
          <nuxt-link to="/login"><span class="main-color">登录</span></nuxt-link>
        </template>
        <template v-if="logined">
          <nuxt-link to="/user_center"><span class="main-color">{{ userinfo }}</span></nuxt-link>
          <a href="javascript:" @click='logout'> <span> [ 退出 ]</span></a>
        </template>
      </el-col>
      <el-col :span="5">
        <dl class="head-nav-dl">
          <dd class="head-nav-dd"><nuxt-link to="/seller_center">商家中心</nuxt-link></dd>
          <dd class="head-nav-dd"><nuxt-link to="/user_center"><span class="main-color">用户中心</span></nuxt-link></dd>
        </dl>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logined: false,
      nologin: false,
      userinfo: ''
    }
  },
  methods:{
    async logout(){
      let result = await this.$axios.get('/users/logout')
      if(result.data === 'success'){
        this.logined = false
        return this.nologin = true
      }
    }
  },
  async created() {
    let result = await this.$axios.get('/users/getsession')
    if(result.data){
      this.userinfo = result.data
      this.nologin = false
      return this.logined = true
    }
    if(!result.data){
      this.logined = false
      return this.nologin = true
    }
  }
}
</script>

<style lang="css" scoped>
  @import "@/assets/css/public/head-nav.css";
</style>
