<template lang="html">
  <div class="user-center">
    <header-nav></header-nav>
    <left-column></left-column>
    <right-content></right-content>
  </div>
</template>

<script>
import headerNav from '@/components/user-seller-center/public/header-nav'
import leftColumn from '@/components/user-seller-center/user/left-column'
import rightContent from '@/components/user-seller-center/user/right-content'

export default {
  components: {
    headerNav,
    leftColumn,
    rightContent
  }
}
</script>

<style lang="css" scoped>
</style>
