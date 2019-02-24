<template>
  <div class="page-index">
    <head-nav></head-nav>
    <head-search></head-search>
    <home-body></home-body>
    <my-footer></my-footer>
  </div>
</template>

<script>
import headNav from "@/components/public/head-nav"
import headSearch from "@/components/public/head-search"
import homeBody from "@/components/home-body/index"
import myFooter from "@/components/public/my-footer.vue"

export default{
  components: {
    headNav,
    headSearch,
    homeBody,
    myFooter
  },
  async mounted(){
    if(this.$store.state.myCity !== '定位中...'){
      return false
    }
    let cityIp = await this.$axios.get('/getIp')
    if(this.$store.state.myCity !== '定位中...'){
      return false
    }
    this.$store.dispatch('myCityAction',cityIp.data)
  },
  beforeRouteLeave (to, from, next) {
    this.$store.dispatch('beforeLoginAction', from.fullPath)
    next()
  }
}
</script>

<style>

</style>
