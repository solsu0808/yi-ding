<template lang="html">
  <div class="choose-city">
    <head-nav></head-nav>
    <head-search></head-search>
    <product-body :plist="plist" :totalProduct="totalProduct"></product-body>
    <my-footer></my-footer>
  </div>
</template>

<script>
import headNav from '@/components/public/head-nav'
import headSearch from '@/components/public/head-search'
import productBody from '@/components/product/search/product-body.vue'
import myFooter from "@/components/public/my-footer.vue"

export default {
  components: {
    headNav,
    headSearch,
    productBody,
    myFooter
  },
  async asyncData({app}){

    let result = await app.$axios.post('/product/get-good-profile',{
      city: app.store.state.myCity,
      type: app.context.route.params.type,
      page: app.context.route.params.page
    })

    if(result.status === 200){
      // 将 plist return为组件实例属性，类似 data
      return {
        plist: result.data.profile,
        totalProduct: result.data.totalProduct
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if(to.fullPath === '/login'){
      this.$store.dispatch('beforeLoginAction', from.fullPath)
    }
    next()
  }
}
</script>

<style lang="css" scoped>
</style>
