<template lang="html">
  <div class="right-order">
    <div class="right-order-title main-color">
      <span @click="toOverview"><i class="el-icon-arrow-left"></i> 概览 - </span>
      {{toOrders.message+'订单'}}
    </div>
    <el-row class="right-order-body">
      <el-col :span="24" v-for="(item,index) of toOrders.details" :key="index">
        <el-card class="box-card">
          <el-row>
            <el-col :xs="5" :sm="2" :lg="2"><span class="title">订单号</span></el-col>
            <el-col :xs="9" :sm="17" :lg="17">{{item.orderid}}</el-col>
            <el-col :xs="10" :sm="5" :lg="5"><el-button style="float: right; padding: 3px 0; color: #31BBAC" type="text" v-if="item.status === 2 || item.status === 4" @click="operatorOrder(item)">{{ item.status === 2 ? '取消订单' : '去回复' }}</el-button></el-col>
          </el-row>
          <el-row>
            <el-col :xs="5" :sm="2" :lg="2"><span class="title">谁预订</span></el-col>
            <el-col :xs="19" :sm="22" :lg="22">{{item.rname}}</el-col>
          </el-row>
          <el-row>
            <el-col :xs="5" :sm="2" :lg="2"><span class="title">手机号</span></el-col>
            <el-col :xs="19" :sm="22" :lg="22">{{item.phone}}</el-col>
          </el-row>
          <el-row>
            <el-col :xs="5" :sm="2" :lg="2"><span class="title">订几人</span></el-col>
            <el-col :xs="19" :sm="22" :lg="22">{{item.rnumber}}</el-col>
          </el-row>
          <el-row>
            <el-col :xs="5" :sm="2" :lg="2"><span class="title">订几时</span></el-col>
            <el-col :xs="19" :sm="22" :lg="22">{{getTime(item.rDate, true)}}</el-col>
          </el-row>
          <el-row>
            <el-col :xs="5" :sm="2" :lg="2"><span class="title">下单时</span></el-col>
            <el-col :xs="19" :sm="22" :lg="22">{{getTime(item.oDate)}}</el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <!-- 遮罩层 -->
    <div class="right-order-shade" v-if="loadShade">
      <i class="el-icon-loading main-color"></i>
    </div>
    <!-- 评价界面 -->
    <transition name="fade">
      <div class="right-order-shade" v-if="commentShade">
        <div class="right-order-comment">
          <div class="reply-title">
            <i class="el-icon-edit"></i>
            <span>商家回复</span>
          </div>
          <el-input
            type="textarea"
            :rows="10"
            placeholder="批评若不自由，赞美则无意义"
            v-model="commentInfo.comment">
          </el-input>
          <div class="comment-btn">
            <el-button @click="confirmComment" :disabled="commentBtnStatus">回复</el-button>
            <el-button @click="quitComment">取消</el-button>
          </div>
          <transition name="fade">
            <div class="no-star" v-if="!commentInfo.comment && noComment">
              <span>请填写回复内容</span>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import momentjs from 'moment'
export default {
  props: ["toOrders"],
  data(){
    return {
      loadShade: false,
      commentShade: false,
      commentBtnStatus: false,
      noComment: false,
      commentInfo: {
        comment: '',
        orderId: '',
        sellerId:''
      }
    }
  },
  methods: {
    async operatorOrder(order){
      // 取消订单
      if(order.status === 2){
        let orderId = order.orderid
        // 判断是否过了预订日期
        if(new Date() - new Date(order.rDate) >= 0){
          return alert('订单已到期，无法取消')
        }
        // 显示遮罩层
        this.loadShade = true
        // 发送取消订单请求
        let result = await this.$axios.post('/order/close', {
          orderId: orderId
        })
        // 关闭遮罩层
        this.loadShade = false
        if(result.status === 200 && result.data === 'success'){
          this.closeOrder(orderId)
        }
      }
      // 回复订单
      if(order.status === 4){
        this.commentShade = true
        this.commentInfo.orderId = order.orderid
        this.commentInfo.sellerId = order.sellerid
        this.commentBtnStatus = false
      }
    },
    toOverview(){
      // 子调用父组件方法
      this.$emit('to-order', '')
    },
    closeOrder(orderId){
      this.$emit('closeOrder',orderId)
    },
    // 将 ISO 标准时间转换为本地时间
    getTime(time, onlyDate){
      if(onlyDate){
        return momentjs(time).format('YYYY-MM-DD')
      }
      return momentjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    // 取消评价按钮
    quitComment(){
      this.commentShade = false
      this.commentInfo.commentStars = 0
      this.commentInfo.comment = ''
      this.noComment = false
    },
    // 确定评价
    async confirmComment(){
      // 判断回复内容是否为空 或 回复按钮是否可用
      if(this.commentBtnStatus === true || this.commentInfo.comment === ''){
        this.noComment = true
        return false
      }

      // 点击回复按钮后将按钮变为不可用
      this.commentBtnStatus = true
      let result = await this.$axios.post('/order/reply', {
        orderId: this.commentInfo.orderId,
        info: this.commentInfo.comment,
        rTime: new Date()
      })
      if(result.status === 200 && result.data === 'success'){
        this.quitComment()
        this.$router.push('/product/'+this.commentInfo.sellerId+'#'+this.commentInfo.orderId)
      }
    }
  }
}
</script>

<style lang="css">
@import "@/assets/css/user-seller-center/right-order.css";
</style>
