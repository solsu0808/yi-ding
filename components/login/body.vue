<template lang="html">
  <div class="login-main">
    <div class="login-body">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" @keyup.enter.native="signin('ruleForm')"></el-input>
        </el-form-item>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off" @keyup.enter.native="signin('ruleForm')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="signin('ruleForm')">登录</el-button>
          <span><nuxt-link to="#">忘记密码?</nuxt-link></span>
          <span class="login-err" v-if="loginErr">{{ loginErr }}</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        email: '',
        pass: ''
      },
      rules: {
        email: [{
          required: true,
          message: '请输入邮箱地址'
        }],
        pass: [{
          required: true,
          message: '请输入密码'
        }]
      },
      loginErr: false
    }
  },
  methods: {
    // 登录按钮事件
    async signin(formName) {
      let self = this
      self.$refs[formName].validate(async (valid) => {
        if (valid) {
          let result = await self.$axios.post('/users/signin', {
            email: self.ruleForm.email,
            pass: self.ruleForm.pass
          })
          if(result.data === '邮箱未注册' || result.data === '密码不正确' ){
            return self.loginErr = result.data
          }
          if(result.data === '登录成功'){
            self.loginErr = false
            return self.$router.replace(self.$store.state.beforeLogin)
          }
        } else {
          console.log('err form')
          return false
        }
      })
    }
  }
}
</script>

<style lang="css">
@import "@/assets/css/login/body.css"
</style>
