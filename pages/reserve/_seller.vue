<template lang="html">
  <div class="page-reserve">
    <head-search></head-search>
    <reserve-body></reserve-body>
  </div>
</template>

<script>
import headSearch from "@/components/public/head-search"
import reserveBody from "@/components/reserve/reserve-body"

export default {
  components:{
    headSearch,
    reserveBody
  },
  beforeRouteEnter(to, from, next){
    if(typeof(window) !=='undefined'){
      next()
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
