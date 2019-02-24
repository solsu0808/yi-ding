<template lang="html">
  <div class="search-product-body" v-if="plist.length">
      <dl class="product-sort-dl">
        <dd class="product-sort active" @click="comSort">默认排序</dd>
        <dd class="product-sort" @click="priceSort">价格排序</dd>
        <dd class="product-sort" @click="gradeSort">评分排序</dd>
      </dl>
      <el-row class="product-list">
        <el-col :span="6" v-for="(o, index) of plist" :key="index" class="product-list-body">
          <nuxt-link :to="'/product/'+o.sellerid">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="o.img[0]" class="image">
              <p class="product-list-info-title">{{o.pname}}</p>
              <div class="product-list-info-body">
                <p><span>{{ o.comments.length }} 评价: </span><i class="el-icon-star-on" v-for="i in starNum(o.comments).star"></i><i class="el-icon-star-off" v-if="starNum(o.comments).halfStar"></i></p>
                <p><i class="el-icon-location-outline"> {{ o.location }}</i></p>
                <p>人均 | ￥{{o.averagepay}}</p>
              </div>
            </el-card>
          </nuxt-link>
        </el-col>
      </el-row>
      <div class="load-more">
        <el-pagination
          layout="prev, pager, next"
          :total.async="totalProduct"
          :current-page="currentPage"
          @current-change="pageChange">
        </el-pagination>
      </div>
  </div>
  <div v-else class="search-product-body">
    <div class="nothing-404">
      <span class="iconfont icon-AK-LYhangbanyuding"></span>
      <p class="no-info-404">商品君搭乘 404 航班去追寻诗和远方了</p>
    </div>
  </div>
</template>

<script>
export default {
  props:['plist', 'totalProduct'],
  data(){
    return{
      // 初始页数值
      currentPage:1
    }
  },
  created(){
    // 获取实际页数值
    this.currentPage = Number(this.$route.params.page)
  },
  methods:{
    pageChange(currentPage){
      let url = '/'
      // 判断是关键词搜索 还是 类型搜索
      if(this.$route.params.pname){
        url = '/product/search/'+this.$route.params.pname+'/'+currentPage
      }else if(this.$route.params.type){
        url = '/product/type/'+this.$route.params.type+'/'+currentPage
      }
      this.$router.push(url)
    },

    // 判断评价星星个数
    starNum(comments){
      // 判断评价长度是否为 0, 防止后面 除数 comments.length 为0
      if(!comments.length){
        return {
          averStar: 0,
          star: 0,
          halfStar: false
        }
      }
      let totalStar = 0
      comments.forEach((item, index) => {
        totalStar += item.star
      })
      let averStar = totalStar / comments.length
      return {
        averStar,
        star: Math.floor(averStar),

        //判断是否评价星星平均个数是否为整数
        halfStar: Math.floor(averStar) !== averStar
      }
    },

    // 商品排序方式
    comSort(){

    },
    priceSort(){

    },
    gradeSort(){
      this.plist = this.plist.sort((front, behind) => {
        return this.starNum(behind.comments).averStar - this.starNum(front.comments).averStar
      })
    }

  }
}
</script>

<style lang="css">
@import "@/assets/css/product/search/product-body.css";
@import "@/assets/css/icon/iconfont.css";
</style>
