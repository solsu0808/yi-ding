<template lang="html">
  <div class="center-right-content">
    <transition name="translate" mode="out-in">
      <div class="right-content-card" v-if="!toOrders">
        <div class="card-title">
          <span>您好，<span class="main-color">{{sellerId}}</span></span>
        </div>
        <el-row>
          <el-col :xs="24" :sm="12" class="right-content-col" v-for="(item,index) of orders" :key="index">
            <a href="javascript:" @click="toOrder(item)">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>您有 <span class="main-color">{{item.details.length}}</span> 订单<span class="main-color">{{item.message}}</span></span>
                </div>
                <div class="text item">
                  <p v-if="item.status === 2">已接单的订单</p>
                  <p v-if="item.status === 4">等待您的回复</p>
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
import rightOrder from '@/components/user-seller-center/seller/components/right-order'
export default {
  components: {
    rightOrder
  },
  data(){
    return {
      orders: [
        {status: 2, message:'已接单', details: []},
        {status: 4, message:'待回复', details: []},
        {status: 5, message:'已完成', details: []},
      ],
      toOrders: '',
      sellerId: ''
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
        }
      })
    }
  },
  async created(){
    let sellerId = await this.$axios.get('/sellers/getsession')
    if(sellerId.status === 200 && Boolean(sellerId.data) === true){
      this.sellerId = sellerId.data
      let orders = await this.$axios.post('/order/get_seller_orders',{
        sellerId: sellerId.data
      })
      if(orders.status === 200){
        // console.log(orders.data)
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
@import "@/assets/css/user-seller-center/right-content.css";
</style>
