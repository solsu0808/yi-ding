<template lang="html">
  <div class="suggest-hotel">
    <el-row class="suggest-hotel-title">
      <el-col :span="24">
        <i class="el-icon-star-off"></i>
        <span>酒店推荐</span>
      </el-col>
    </el-row>
    <!-- 获取推荐酒店时显示 -->
    <transition name="fade">
      <el-row class="suggest-hotel-body" v-if="$store.state.myCity!=='定位中...' && $store.state.myCity!=='自动定位失败' && suggestHotel[0] !== undefined">
        <el-col :span="8" v-for="(o, index) in suggestHotel" :key="index" class="suggest-hotel-body-list">
          <nuxt-link :to="'/product/'+o.sellerid">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="o.img[0]" class="image">
              <div class="suggest-hotel-info-title">{{o.pname}}</div>
              <div class="suggest-hotel-info-body">人均 | ￥{{o.averagepay}}</div>
            </el-card>
          </nuxt-link>
        </el-col>
      </el-row>
  </transition>
  <!-- 还未获取定位时显示 -->
    <el-row class="suggest-hotel-no" v-if="$store.state.myCity==='定位中...' || $store.state.myCity==='自动定位失败'">
      <div class="location-no">{{ $store.state.myCity }} , 您可以<nuxt-link to="/choosecity"> 手动定位 </nuxt-link>以获取推荐列表</div>
    </el-row>
  <!-- 获取定位但未酒店接口还没返回数据时显示 -->
    <el-row class="suggest-hotel-no" v-if="$store.state.myCity!=='定位中...' && $store.state.myCity!=='自动定位失败' && suggestHotel === ''">
      <div class="location-no"> 加载中... </div>
    </el-row>
  <!-- 定位城市没有酒店时显示 -->
    <el-row v-if="$store.state.myCity!=='定位中...' && $store.state.myCity!=='自动定位失败' && JSON.stringify(suggestHotel) === '[]'">
      <div class="nothing-404">
        <span class="iconfont icon-AK-LYhangbanyuding"></span>
        <p class="no-info-404">酒店君搭乘 404 航班去追寻诗和远方了</p>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  data(){
    return {
      suggestHotel: ''
    }
  },
  async mounted(){
    var intervalHotel = setInterval( async () => {
      if(this.$store.state.myCity!=='定位中...' && this.$store.state.myCity!=='自动定位失败'){
        clearInterval(intervalHotel)
        let result = await this.$axios.post('/home/suggest-hotel',{
          city: this.$store.state.myCity
        })
        this.suggestHotel = result.data
      }
    }, 300)
  }
}
</script>

<style lang="css" scoped>
@import "@/assets/css/home-body/suggest-hotel.css";
</style>
