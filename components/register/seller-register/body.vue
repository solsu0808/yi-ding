<template lang="html">
  <div class="register-body">
    <el-form :model="ruleForm" :inline="true" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="商家 ID" prop="sellerId">
            <el-input type="text" v-model="ruleForm.sellerId" autocomplete="off" placeholder="商家 ID 作为唯一登录名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="店名" prop="pName">
            <el-input type="text" v-model="ruleForm.pName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="简介" prop="desc">
            <el-input type="textarea" :rows="7" v-model="ruleForm.desc" placeholder="简介字符个数 30 ~ 100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型" prop="productType">
            <el-select v-model="ruleForm.productType" placeholder="请选择类型">
              <el-option v-for="(item,index) of categoryList" :key="index" :label="item.type" :value="item.typeid"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="人均消费" prop="consume">
            <el-select v-model="ruleForm.consume" placeholder="请选择类型">
              <el-option label="< 50" value="< 50"></el-option>
              <el-option label="50 ~ 100" value="50 ~ 100"></el-option>
              <el-option label="100 ~ 200" value="100 ~ 200"></el-option>
              <el-option label="200 ~ 500" value="200 ~ 500"></el-option>
              <el-option label="500 ~ 1000" value="500 ~ 1000"></el-option>
              <el-option label="1000 ~ 2000" value="1000 ~ 2000"></el-option>
              <el-option label="> 2000" value="> 2000"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="城市" prop="city">
            <el-autocomplete
              class="inline-input"
              v-model="ruleForm.city"
              :fetch-suggestions="querySearch"
              placeholder="请输入城市名"
              :trigger-on-focus="false">
            </el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="详细地址" prop="location">
            <el-input type="text" v-model="ruleForm.location" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input type="text" v-model="ruleForm.phone" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商家图片">
            <el-upload
              action="/sellers/upload"
              list-type="picture-card"
              :on-remove="handleRemove"
              :on-success="uploadSuccess">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="register-btn">
          <el-form-item>
            <transition name="fade" mode="out-in">
              <div v-if="signupBtn">
                <el-button type="primary" @click="signup('ruleForm')">同意一订协议并入驻</el-button>
                <a href="" class="agreement-user">《一订商家协议》</a>
              </div>
              <span class="signup-err" v-if='signupErr'> {{ signupErr }} </span>
              <span class="signup-ok" v-if='signupOk'> {{ signupOk }} </span>
            </transition>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    // 密码再次确认验证
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次确认密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入的密码不一致!'))
      } else {
        callback()
      }
    }
    // 选择城市验证
    let validateCity = (rule, value, callback) => {
      // 判断 城市输入框的值 是否是 cityList 中有的
      let hasCity = this.cityList.some((item) => {
        return item.value === value
      })
      if (value === '') {
        callback(new Error('所在城市必填'))
      } else if (!hasCity) {
        callback(new Error('请填写正确的城市'))
      } else {
        callback()
      }
    }

    // 商家 ID 验证
    let validateSellerId = async (rule, value, callback) => {
      if (value.length < 6 || value.length > 18) {
        callback(new Error('商家 ID 必须 6 ~ 18 个字符'))
      } else {
        // 判断 商户 ID 是否已经存在
        let result = await this.$axios.post('/sellers/id-existed',{
          sellerId: value
        })
        if(result.status === 200 && result.data === true){
          return callback(new Error('商家 ID 已存在'))
        }
        callback()
      }
    }

    return {
      categoryList: this.$store.state.menus,
      ruleForm: {
        sellerId:'',
        pass: '',
        checkPass: '',
        pName: '',
        desc: '',
        productType: '',
        consume: '',
        city: '',
        location: '',
        phone: '',
        img: []
      },
      cityList: [],
      rules: {
        sellerId: [{
          required: true,
          validator: validateSellerId,
          trigger: 'blur'
        }],
        pass: [{
          required: true,
          min: 8,
          max: 16,
          message: '密码长度必须 8 ~ 16 个字符'
        }],
        checkPass: [{
          required: true,
          validator: validatePass
        }],
        pName: [{
          required: true,
          message: '店名必填'
        }],
        desc: [{
          required: true,
          min: 30,
          max: 100,
          message: '简介必须 30 ~ 100 个字符'
        }],
        productType: [{
          required: true,
          message: '请选择类型'
        }],
        consume: [{
          required: true,
          message: '人均消费必选'
        }],
        city: [{
          required: true,
          validator: validateCity
        }],
        location: [{
          required: true,
          message: '详细地址必填'
        }],
        phone: [{
          required: true,
          message: '联系电话必填'
        }]
      },
      signupErr: false,
      signupOk: false,
      signupBtn: true,
      // 文件上传
      dialogImageUrl: '',
      dialogVisible: false
    };
  },
  methods: {
    // element带输入建议的文本框： 用于匹配城市
    querySearch(queryString, cb) {
        var cityList = this.cityList
        var results = queryString ? cityList.filter(this.createFilter(queryString)) : cityList;
        // 调用 callback 返回建议列表的数据(cb参数必须是一个带value属性的对象)
        cb(results)
    },
    createFilter(queryString) {
      return (cityList) => {
        return (cityList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },

    // 注册按钮事件
    async signup(formName) {
      let self = this
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          self.signupBtn = false
          self.signupErr = false
          self.signupOk = false
          let result = await self.$axios.post('/sellers/signup', {
            sellerId: self.ruleForm.sellerId,
            pass: self.ruleForm.pass,
            pName: self.ruleForm.pName,
            desc: self.ruleForm.desc,
            productType: self.ruleForm.productType,
            consume: self.ruleForm.consume,
            city: self.ruleForm.city,
            location: self.ruleForm.location,
            phone: self.ruleForm.phone,
            img: self.ruleForm.img
          })
          if(result.status === 200 && result.data === '商户注册成功'){
            self.signupOk = '注册成功，正在跳转'
            setTimeout(() => {
              this.$router.push('/seller_login')
            }, 1500)
          }
        } else{
          console.log('err form')
          return false
        }
      })
    },
    // 文件上传 删除按钮钩子函数
    handleRemove(file) {
      // 删除服务器图片
      this.$axios.post('/sellers/del-upload',{
        file: file.response
      })
      // 将注册表单图片删除
      let index = this.ruleForm.img.indexOf(file.response)
      if(index > -1){
        this.ruleForm.img.splice(index, 1)
      }
    },
    // 上传成功
    uploadSuccess(response, file, fileList){
      this.ruleForm.img.push(response)
    }
  },
  async mounted(){
    // 获取城市列表
    let cities_cn = await this.$axios.get('/getCities')
    // 将获取到的城市数组中每个元素 以 {value: city} 形式赋值 给 cityList 数组
    cities_cn.data.forEach((item) => {
      this.cityList.push({value: item})
    })
  }
}
</script>

<style lang="css">
@import "@/assets/css/register/body.css";
@import "@/assets/css/register/seller_register/body.css";
</style>
