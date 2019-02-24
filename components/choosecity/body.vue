<template lang="html">
  <div class="city-body" @click="alphabetShow=false">
    <div class="city-main">
      <div class="title-tips"><i class="el-icon-caret-right"></i> 点击字母快速选择城市</div>
      <el-row v-for="(list,property) in cities" :key="property" :id="property">
        <div class="alphabet" @click.stop="alphabetShow=true"><a href="javascript:">{{ property }}</a></div>
        <el-col :span="2" v-for="item of list" :key="item" class="city"><a href="javascript:" @click="chooseCity(item)">{{ item }}</a></el-col>
      </el-row>

      <!-- 字母表 -->
      <transition name="fade">
        <div class="mask-layer" v-show="alphabetShow" >
          <div class="alphabet-list" @click.stop>
            <el-row>
              <el-col :span="6" v-for="(list,property) in cities" :key="property"><a href="javascript:" @click="chooseLetter(property)">{{ property }}</a></el-col>
            </el-row>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import pinyin from 'js-pinyin'
pinyin.setOptions({checkPolyphone: false, charCase: 0})

export default {
  data(){
    return {
      cities: {
        'A': [],
        'B': [],
        'C': [],
        'D': [],
        'E': [],
        'F': [],
        'G': [],
        'H': [],
        'J': [],
        'K': [],
        'L': [],
        'M': [],
        'N': [],
        'P': [],
        'Q': [],
        'R': [],
        'S': [],
        'T': [],
        'W': [],
        'X': [],
        'Y': [],
        'Z': []
      },
      alphabetShow: false,
    }
  },
  methods:{
    // 选择城市点击事件
    chooseCity(item){
      this.$store.dispatch('myCityAction', item)
      this.$router.go(-1)
    },
    chooseLetter(property){
      this.alphabetShow=false

      // 取得对应字母的DOM对象
      var anchor = this.$el.querySelector('#' + property)

      // 设置滚动条位置
      window.scroll(0, anchor.offsetTop)
    }
  },
  async created(){
    let cities_cn = await this.$axios.get('/getCities')
    cities_cn.data.forEach((item, index) => {
      let firstLetter = pinyin.getCamelChars(item).slice(0,1)
      this.cities[firstLetter].push(item)
    })
  }
}
</script>

<style lang="css" scoped>
@import "@/assets/css/choosecity/body.css"
</style>
