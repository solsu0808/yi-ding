<template lang="html">
  <div class="center-right-content">
    <transition name="translate" mode="out-in">
      <div class="right-content-card" v-if="!toOrders">
        <div class="card-title">
          <span>您好，<span class="main-color">{{userId}}</span></span>
        </div>
        <el-row>
          <el-col :xs="24" :sm="12" class="right-content-col" v-for="(item,index) of orders" :key="index">
            <a href="javascript:" @click="toOrder(item)">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>您有<span class="main-color">{{item.details.length}}</span> 订单<span class="main-color">{{item.message}}</span></span>
                </div>
                <div class="text item">
                  <p v-if="item.status === 0">超时未付款或被取消的订单</p>
                  <p v-if="item.status === 1">请在下单后 30 分钟内付款，超时未付款将自动关闭</p>
                  <p v-if="item.status === 2">待使用的订单</p>
                  <p v-if="item.status === 3">期待您的评价</p>
                  <p v-if="item.status === 4">评价完成，等待商家回复</p>
                  <p v-if="item.status === 5">已完成的订单</p>
                </div>
              </el-card>
            </a>
          </el-col>
        </el-row>
      </div>
      <right-order v-else :toOrders="toOrders" @to-order="toOrder" @closeOrder="closeOrder"></right-order>
    </transition>
  </div>
</template>

<script>
import rightOrder from '@/components/user-seller-center/user/components/right-order'
export default {
  components: {
    rightOrder
  },
  data(){
    return {
      orders: [
        {status: 0, message:'已关闭', details: []},
        {status: 1, message:'待付款', details: []},
        {status: 2, message:'待使用', details: []},
        {status: 3, message:'待评价', details: []},
        {status: 4, message:'待商家回复', details: []},
        {status: 5, message:'已完成', details: []},
      ],
      toOrders: '',
      userId: ''
    }
  },
  methods: {
    toOrder(item){
      this.toOrders = item
    },
    // 关闭订单
    closeOrder(orderId){
      this.toOrders.details.forEach((item, index) => {
        if(item.orderid === orderId){
          let colsed = this.toOrders.details.splice(index, 1)
          this.orders.forEach((item, index) => {
            if(item.status === 0){
              item.details.push(colsed)
            }
          })
        }
      })
    }
  },
  async created(){
    let userId = await this.$axios.get('/users/getsession')
    if(userId.status === 200 && Boolean(userId.data) === true){
      this.userId = userId.data
      let orders = await this.$axios.post('/order/get_user_orders',{
        userId: userId.data
      })
      if(orders.status === 200){
        orders.data.forEach((resourceItem) => {
          this.orders.forEach((item) => {
            // 将取回的订单，订单状态与 this.orders 状态相同的订单 push 到 this.orders 中
            if(resourceItem.status === item.status){
              item.details.push(resourceItem)
            }
          })
        })
      }
    }
  }
}
</script>

<style lang="css" scoped>
@import "@/assets/css/user-seller-center/right-content.css"
</style>
