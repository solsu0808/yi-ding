<template lang="html">
  <div class="product-seller">
    <head-nav></head-nav>
    <head-search></head-search>
    <product-detail :profile="profile"></product-detail>
    <product-comments :comments="comments"></product-comments>
    <my-footer></my-footer>
  </div>
</template>

<script>
import headNav from '@/components/public/head-nav'
import headSearch from '@/components/public/head-search'
import productDetail from '@/components/product/seller/product-detail.vue'
import productComments from '@/components/product/seller/product-comments.vue'
import myFooter from "@/components/public/my-footer.vue"

export default {
  components: {
    headNav,
    headSearch,
    productDetail,
    productComments,
    myFooter
  },
  async asyncData({app}){
    let result = await app.$axios.post('/product/get-good-profile',{
      sellerid: app.context.route.params.seller,
    })
    if(result.status === 200){
      return {
        profile: result.data.profile[0],
        comments: result.data.profile[0].comments
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
