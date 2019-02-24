<template lang="html">
  <div class="center-header-nav">
    <el-row>
      <el-col :span="12">
        <nuxt-link to="/"><img src="@/assets/img/logo.png" class="logo"></nuxt-link>
      </el-col>
      <el-col :span="12">
        <a href="javascript:" @click="logout">
          <span class="logout-btn">
            <el-button>退出登录</el-button>
          </span>
        </a>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  methods: {
    async logout(){
      // 判断是用户中心页面还是商家中心页面
      if(this.$route.fullPath === '/user_center'){
        let result = await this.$axios.get('/users/logout')
        if(result.status === 200 && result.data === 'success'){
          return this.$router.replace('/login')
        }
        return false
      }
      if(this.$route.fullPath === '/seller_center'){
        let result = await this.$axios.get('/sellers/logout')
        if(result.status === 200 && result.data === 'success'){
          return this.$router.replace('/seller_login')
        }
        return false
      }
    }
  }
}
</script>

<style lang="css" scoped>
@import "@/assets/css/user-seller-center/header-nav.css"
</style>
