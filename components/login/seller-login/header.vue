<template lang="html">
  <div class="login-header">
    <el-row>
      <el-col :span="12">
        <nuxt-link to="/"><img src="@/assets/img/logo.png" class="logo"></nuxt-link>
      </el-col>
      <el-col :span="12">
        <nuxt-link to="/seller_register"><span class="login-btn"><el-button>商家入驻</el-button></span></nuxt-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="css">
@import "@/assets/css/login/header.css"
</style>
