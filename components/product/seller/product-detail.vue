<template lang="html">
  <div class="product-seller-detail">
    <el-row>
      <el-col :span="7" class="images-col">
        <div>
          <el-carousel indicator-position="none" class="images">
            <el-carousel-item v-for="(item,index) in profile.img" :key="index">
              <a target="_blank" :href="item"><img :src="item"></a>
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-col>
      <el-col :span="17" class="right-col">
        <el-row>
          <el-col :span="24">
            <div class="right-detail-top">
              <p class="right-detail-title">{{ profile.pname }}</p>
              <p class="right-detail-info">{{ profile.info }}</p>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="right-detail-middle">
              <p class="right-detail-add"><span>地址：</span><span>{{ profile.location }}</span></p>
              <p class="right-detail-phone"><span>电话：</span><span>{{ profile.phone }}</span></p>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="right-detail-bottom">
              <p class="right-detail-pay">
                <span>人均 | </span>
                <span>￥{{ profile.averagepay }}</span>
                <el-button round @click="reserve">预订</el-button>
              </p>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props:['profile'],
  methods:{
    reserve(){
      let url = '/reserve/' + this.$route.params.seller
      this.$router.push(url)
    }
  }
}
</script>

<style lang="css" scoped>
@import "@/assets/css/product/seller/product-detail.css"
</style>
