<template lang="html">
  <div class="register-body">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button round @click="getCode(ruleForm.email)" v-show="getCodeBtn">获取邮箱验证码</el-button>
        <span class="getCodeMess" v-if = 'codeSendErr'> {{ codeSendErr }} </span>
        <span class="getCodeMess" v-if = 'codeSend'> 验证码已发送，{{ countdown }} 秒后可重新获取。若没收到，请翻翻垃圾箱</span>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input type="text" v-model="ruleForm.code" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <transition-group name="fade" mode="out-in">
          <div v-if="signupBtn" key="signupBtn">
            <el-button type="primary" @click="signup('ruleForm')">同意一订协议并入驻</el-button>
            <a href="" class="agreement-user">《一订商家协议》</a>
          </div>
          <span class="signup-err" v-if='signupErr' key="signupErr"> {{ signupErr }} </span>
          <span class="signup-ok" v-if='signupOk' key="signupOk"> {{ signupOk }} </span>
        </transition-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {

      if (value === '') {
        callback(new Error('请再次确认密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入的密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        email: '',
        code: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        email: [{
            required: true,
            message: '请输入邮箱地址'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址'
          }
        ],
        pass: [{
          required: true,
          min: 8,
          max: 16,
          message: '密码长度必须 8 ~ 16 个字符'
        }],
        checkPass: [{
          required: true,
          validator: validatePass
        }]
      },
      countdown: 60,
      codeSendErr: false,
      codeSend: false,
      getCodeBtn: true,
      signupErr: false,
      signupOk: false,
      signupBtn: true
    };
  },
  methods: {
    // 注册按钮事件
    async signup(formName) {
      let self = this
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          self.signupBtn = false
          self.signupErr = false
          self.signupOk = false
          let result = await self.$axios.post('/users/signup', {
            email: self.ruleForm.email,
            code: self.ruleForm.code,
            pass: self.ruleForm.pass
          })
          if(result){
            if(result.data === '验证码不正确'){
              self.signupOk = false
              self.signupBtn = true
              return self.signupErr = result.data
            }
            self.signupErr = false
            self.signupOk = '注册成功, 正在跳转...'
            setTimeout(() => {
              self.$router.push('/login')
            }, 1000)
          }
        } else {
          console.log('err form')
          return false
        }
      })
    },
    // 获取验证码
    async getCode(email) {
      if (/^.+@([a-zA-Z0-9-])+(\.([a-zA-Z0-9-])+)*(\.[a-zA-Z]([a-zA-Z])+)$/.test(email)) {
        let result = await this.$axios.post('/users/getcode', {
          email
        })
        if (result.data === '该邮箱已被注册') {
          this.codeSend = false
          this.codeSendErr = '该邮箱已被注册'
          this.countdown = 60
          return
        }
        if (result.data === '邮箱发送失败') {
          this.codeSend = false
          this.codeSendErr = '服务器错误，请稍后重试'
          this.countdown = 60
          return
        }
        this.codeSendErr = false
        this.getCodeBtn = false
        this.codeSend = true
        let timer = setInterval(() => {
          this.countdown--
          if (this.countdown === 0) {
            clearInterval(timer)
            this.codeSend = false
            this.getCodeBtn = true
            this.countdown = 60
          }
        }, 1000)
      }
    }
  }
}
</script>

<style lang="css">
@import "@/assets/css/register/body.css"
</style>
