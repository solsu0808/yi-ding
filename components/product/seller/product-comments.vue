<template lang="html">
  <div v-if="comments.length" class="product-seller-comments">
    <el-row class="comments-row">
      <el-row class="comments-body" v-for="(item,index) of getComments" :key="index" :id="item.orderid">
        <el-col :span="1"><div class="comments-headimg"><span class="iconfont icon-touxiang"></span></i></div></el-col>
        <el-col :span="23">
          <p class="comments-user">{{item.userid.slice(0,3)}}*****{{item.userid.slice(8,item.userid.length)}}</p>
          <p class="comments-star"><i class="el-icon-star-on" v-for="i in item.star"></i></p>
          <p class="comments-info">{{item.info}}</p>
          <p class="comments-time" v-if="item.ctime">{{getTime(item.ctime)}}</p>
          <div class="comments-reply" v-if="item.reply">
            <p class="reply-context">{{item.reply}}</p>
            <p class="reply-time">{{getTime(item.rtime)}}</p>
          </div>
        </el-col>
      </el-row>
    </el-row>
  </div>
  <div v-else class="product-seller-comments">
    <div class="nothing-404">
      <span class="iconfont icon-AK-LYhangbanyuding"></span>
      <p class="no-info-404">评论君搭乘 404 航班去追寻诗和远方了</p>
    </div>
  </div>
</template>

<script>
import momentjs from 'moment'
export default {
  props:['comments'],
  methods:{
    // 将 ISO 标准时间转换为本地时间
    getTime(time){
      return momentjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  computed:{
    getComments(){
      // 将评论按评论时间降序
      return this.comments.sort((front, behind) => {
        return new Date(behind.ctime) - new Date(front.ctime)
      })
    }
  }
}
</script>

<style lang="css" scoped>
@import "@/assets/css/product/seller/product-comments.css";
@import "@/assets/css/icon/iconfont.css";
</style>
