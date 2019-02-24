<template lang="html">
  <div class="category-nav">
    <dl>
      <dt>全部分类</dt>
      <nuxt-link v-for="(item,index) of categoryList" :key="index" :to="'/product/type/'+item.type+'/1'"><dd>{{ item.type }}</dd></nuxt-link>
    </dl>
  </div>
</template>

<script>
export default {
  data(){
    return {
      categoryList: this.$store.state.menus
    }
  }
}
</script>

<style lang="css" scoped>
@import "@/assets/css/home-body/category-nav.css"
</style>
