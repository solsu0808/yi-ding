<template lang="html">
  <div class="reserve-body">
      <div class="reserve-seller">
        <nuxt-link :to="'/product/'+seller.sellerid">
          <el-row>
            <el-col :span="6">
              <img :src="seller.img ? seller.img[0] : ''" alt="">
            </el-col>
            <el-col :span="18">
              <div class="reserve-seller-pname">
                {{seller.pname}}
              </div>
              <div class="reserve-seller-location">
                {{seller.location}}
              </div>
              <div class="reserve-seller-pay">
                人均 | {{seller.averagepay}}
              </div>
            </el-col>
          </el-row>
        </nuxt-link>
      </div>
    <div class="reserve-form">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
        <el-form-item label="预订人" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model.number="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="订几人" prop="numberPeople">
          <el-select class="form-number-people" v-model="ruleForm.numberPeople" placeholder="请选择预订人数">
            <el-option v-for="item in 20" :label="item" :value="item" :key="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订几时" prop="date">
          <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="ruleForm.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="reserve-money">
            预订金 | <span>￥{{ reserveMoney }}</span>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即预订</el-button>
        </el-form-item>
      </el-form>
    </div>
    <transition name="scale">
      <div class="reserve-confirm-shade" v-if="reserveConfirm">
        <div class="reserve-confirm">
          <div class="nothing-404">
            <span class="iconfont icon-AK-LYhangbanyuding"></span>
            <p class="no-info-404">支付君正搭乘 200 航班火速赶来</p>
            <p class="info"># 交易成功后请点击右上角<span>完成</span>按钮返回一订 ( 或等待自动跳转 )</p>
            <p class="info"># 请在 30 分钟内付款，超时自动取消订单</p>
            <p class="reserve-confirm-btn"><el-button @click="payNow=true">立即付款({{ Number.parseInt(timeout) }})</el-button></p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import momentjs from 'moment'

export default {
  data() {
    return {
      ruleForm: {
        name: '',
        phone: '',
        date: '',
        numberPeople:'',
        remark: ''
      },
      rules: {
        name: [
          {required: true, message: '请填写预定人'},
          {max: 6, message: '预定人名称必须小于 6 个字符'}
        ],
        phone: [
          {required: true, message: '请填写手机号码'}
        ],
        numberPeople: [
          {required: true, message: '请选择人数'}
        ],
        date: [
          {required: true, message: '请选择日期'}
        ]
      },
      seller: '',
      reserveMoney: '0.20',
      timeout: 6,
      reserveConfirm: false,
      payNow: false
    }
  },
  methods: {
    submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            // 生成唯一不重复的订单号
            let orderId = (Math.random()*10000000).toString(16).substr(0,4)+'-'+(new Date()).getTime()+'-'+Math.random().toString().substr(2,5)
            // 下单时间
            let oDate = new Date()

            // 获取 用户id
            let userId = await this.$axios.get('/users/getsession')
            let result = await this.$axios.post('/order/submit',{
              userId: userId.data,
              sellerId: this.seller.sellerid,
              name: this.ruleForm.name,
              phone: this.ruleForm.phone,
              date: this.ruleForm.date,
              numberPeople: this.ruleForm.numberPeople,
              remark: this.ruleForm.remark,
              rPrice: this.reserveMoney,
              orderId,
              oDate
            })

            if(result.status === 200 && result.data === '订单创建成功'){
              this.reserveConfirm = true
              let payPromise = this.$axios.post('/pay',{
                money: this.reserveMoney,
                orderId,
                oDate
              })
              let reserveInterval = setInterval(async () => {
                this.timeout -= 0.1
                if(this.timeout <= 1 || this.payNow){
                  clearInterval(reserveInterval)
                  let pay = await payPromise
                  window.location.href = pay.data
                }
              }, 100)
            }

          } else {
            return false;
          }
        })
      }
  },
  async created(){
    let result = await this.$axios.post('/product/get-good-profile',{
      sellerid: this.$route.params.seller
    })
    this.seller = result.data.profile[0]
  }
}
</script>

<style lang="css">
@import "@/assets/css/reserve/reserve-body.css"
</style>
