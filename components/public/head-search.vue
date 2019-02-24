<template lang="html">
  <div class="head-search">
    <el-row class="head-search-row">
      <el-col :span="5">
        <nuxt-link to="/"><img src="@/assets/img/logo.png" alt="" class="logo"></nuxt-link>
      </el-col>
      <el-col :span="14">
        <el-input v-model="searchContext" placeholder="搜索商家" @input="searchSug" class="search-in"></el-input>
        <dl v-if="searchList.length" class="search-sug" @click.stop>
          <dd v-for="(item,index) of searchList" :key="index"><nuxt-link :to="'/product/search/'+item+'/1'">{{ item }}</nuxt-link></dd>
        </dl>
      </el-col>
      <el-col :span="5">
        <nuxt-link :to="searchBtn()"><el-button class="search-btn el-button" icon="el-icon-search"></el-button></nuxt-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>

// 防抖
import lodash from 'lodash'
export default {
  props:['searchInput'],
  data() {
    return {
      searchList:[],
      // 将父组件传过来的 searchInput 存于 searchContext 中,防止在 v-model 中直接使用 searchInput 导致警告
      searchContext: typeof(this.searchInput) === 'undefined' ? '' : this.searchInput
    }
  },
  methods:{
    searchSug: lodash.debounce(async function(){
      this.searchList = []
      if(this.searchContext){
        let result = await this.$axios.post('/product/get-search-sug',{
          searchInput: this.searchContext,
          city: this.$store.state.myCity
        })
        result.data.forEach((item) => {
          this.searchList.push(item.pname)
        })
      }
    }, 500),
    searchBtn(){
      // 判断搜索框是否为空
      if(!this.searchContext){
        return ''
      }
      return '/product/search/'+this.searchContext+'/1'
    }
  },
  mounted(){
    document.body.onclick = () => {
      this.searchList = []
    }
  }
}
</script>

<style lang="css">
  @import "@/assets/css/public/head-search.css";
</style>
