<template lang="html">
  <div class="right-order">
    <div class="right-order-title main-color">
      <span @click="toOverview"><i class="el-icon-arrow-left"></i> 概览 - </span>
      {{toOrders.message+'订单'}}
    </div>
    <el-row>
      <el-col :span="24" v-for="(item,index) of toOrders.details" :key="index">
        <el-card class="box-card">
          <el-row>
            <el-col :xs="4" :sm="2" :lg="1"><span class="title">单号</span></el-col>
            <el-col :xs="10" :sm="17" :lg="18">{{item.orderid}}</el-col>
            <el-col :xs="10" :sm="5" :lg="5"><el-button style="float: right; padding: 3px 0; color: #31BBAC" type="text" v-if="item.status === 1 || item.status === 2" @click="operatorOrder(item)">{{ item.status === 1 ? '去付款' : '去评价' }}</el-button></el-col>
          </el-row>
          <el-row>
            <el-col :xs="4" :sm="2" :lg="1"><span class="title">商家</span></el-col>
            <el-col :xs="20" :sm="22" :lg="23">{{item.product[0].pname}}</el-col>
          </el-row>
          <el-row>
            <el-col :xs="4" :sm="2" :lg="1"><span class="title">地址</span></el-col>
            <el-col :xs="20" :sm="22" :lg="23">{{item.product[0].location}}</el-col>
          </el-row>
          <el-row>
            <el-col :xs="4" :sm="2" :lg="1"><span class="title">谁订</span></el-col>
            <el-col :xs="20" :sm="22" :lg="23">{{item.rname}}</el-col>
          </el-row>
          <el-row>
            <el-col :xs="4" :sm="2" :lg="1"><span class="title">几时</span></el-col>
            <el-col :xs="20" :sm="22" :lg="23">{{getTime(item.rDate, true)}}</el-col>
          </el-row>
          <el-row>
            <el-col :xs="4" :sm="2" :lg="1"><span class="title">建单</span></el-col>
            <el-col :xs="20" :sm="22" :lg="23">{{getTime(item.oDate)}}</el-col>
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
          <div class="star">
            <span>请选择：</span>
            <i :class="'el-icon-star-on'+(commentInfo.commentStars>=o?' main-color':'')" v-for="o in 5" :key="o" @click="selectStar(o)"></i>
          </div>
          <el-input
            type="textarea"
            :rows="10"
            placeholder="批评若不自由，则赞美无意义"
            v-model="commentInfo.comment">
          </el-input>
          <div class="comment-btn">
            <el-button @click="confirmComment" :disabled="commentBtnStatus">评价</el-button>
            <el-button @click="quitComment">取消</el-button>
          </div>
          <transition name="fade">
            <div class="no-star" v-if="!commentInfo.commentStars && noStar">
              <span>至少选择 1 星</span>
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
      noStar: false,
      commentInfo: {
        commentStars: 0,
        comment: '',
        orderId: '',
        userId: '',
        sellerId: ''
      }
    }
  },
  methods: {
    async operatorOrder(order){
      // 去付款
      if(order.status === 1){
        this.loadShade = true
        let pay = await this.$axios.post('/pay',{
          timeExpire: momentjs(new Date(order.oDate).getTime() + 30 * 60 * 1000).format('YYYY-MM-DD HH:mm'),
          money: order.rPrice,
          orderId: order.orderid
        })
        return window.location.href = pay.data
      }
      // 去评价
      if(order.status === 2){
        this.commentShade = true
        this.commentInfo.orderId = order.orderid
        this.commentInfo.userId = order.userid
        this.commentInfo.sellerId = order.sellerid
      }
    },
    toOverview(){
      // 子调用父组件方法
      this.$emit('to-order', '')
    },
    // 将 ISO 标准时间转换为本地时间
    getTime(time, onlyDate){
      if(onlyDate){
        return momentjs(time).format('YYYY-MM-DD')
      }
      return momentjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    // 选择评价星数
    selectStar(o){
      this.commentInfo.commentStars = o
    },
    // 取消评价按钮
    quitComment(){
      this.commentShade = false
      this.commentInfo.commentStars = 0
      this.commentInfo.comment = ''
      this.noStar = false
    },
    // 确定评价
    async confirmComment(){
      // 点击评论按钮后将按钮变为不可用
      if(this.commentBtnStatus === true || this.commentInfo.commentStars === 0){
        this.noStar = true
        return false
      }
      this.commentBtnStatus = true

      let result = await this.$axios.post('/order/comment', {
        orderId: this.commentInfo.orderId,
        info: this.commentInfo.comment || '该用户无文字评价',
        star: this.commentInfo.commentStars,
        userId: this.commentInfo.userId,
        sellerId: this.commentInfo.sellerId,
        cTime: new Date()
      })
      if(result.status === 200 && result.data === 'success'){
        // 评价成功代码
      }
      this.quitComment()
      this.$router.push('/product/'+this.commentInfo.sellerId+'#'+this.commentInfo.orderId)
    }
  }
}
</script>

<style lang="css">
@import "@/assets/css/user-seller-center/right-order.css"
</style>
