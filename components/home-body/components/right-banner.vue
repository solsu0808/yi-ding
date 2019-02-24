<template lang="html">
  <div class="right-banner">
    <el-row>
      <el-col :span="20">
        <el-carousel height="255px">
          <el-carousel-item v-for="(item,index) in shufImg" :key="index">
            <nuxt-link :to="item.href"><img :src="item.src" width="782px"></nuxt-link>
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="4">
        <a href="#" class="pets1"><img src="http://p0.meituan.net/codeman/e473bb428f070321269b23370ff02ba956209.jpg" width="160px" height="255px"></a>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10">
        <a href="#" class="pets2"><img src="http://p1.meituan.net/codeman/8cce56c467a17e04f3094d1e455462a0132772.png" width="386px" height="137px"></a>
      </el-col>
      <el-col :span="10">
        <a href="#" class="pets3"><img src="http://p1.meituan.net/codeman/8cce56c467a17e04f3094d1e455462a0132772.png" width="386px" height="137px"></a>
      </el-col>
      <el-col :span="4">
        <a href="#" class="pets4"><img src="http://p1.meituan.net/codeman/8cce56c467a17e04f3094d1e455462a0132772.png" width="160px" height="137px"></a>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data(){
    return {
      shufImg: [
        {src: require('@/assets/img/slideshow-1.jpg'), href: '/product/type/酒店/1'},
        {src: require('@/assets/img/slideshow-2.jpg'), href: '/product/type/美食/1'},
        {src: require('@/assets/img/slideshow-3.jpg'), href: '/seller_center'}
      ]
    }
  }
}
</script>

<style lang="css" scoped>
@import "@/assets/css/home-body/right-banner.css"
</style>
