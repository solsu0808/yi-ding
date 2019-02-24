<template lang="html">
  <div class="choose-city">
    <head-nav></head-nav>
    <head-search></head-search>
    <city-body></city-body>
  </div>
</template>

<script>
import headNav from '@/components/public/head-nav'
import headSearch from '@/components/public/head-search'
import cityBody from '@/components/choosecity/body'

export default {
  components: {
    headNav,
    headSearch,
    cityBody
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
