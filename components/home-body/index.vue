<template lang="html">
  <div class="home-body">
    <div class="home-body-container">
      <category-nav></category-nav>
      <right-banner></right-banner>
      <suggest-hotel></suggest-hotel>
      <suggest-pets></suggest-pets>
    </div>
  </div>
</template>

<script>
import categoryNav from "@/components/home-body/components/category-nav"
import rightBanner from "@/components/home-body/components/right-banner"
import suggestHotel from "@/components/home-body/components/suggest-hotel.vue"
import suggestPets from "@/components/home-body/components/suggest-pets.vue"

export default {
  components: {
    categoryNav,
    rightBanner,
    suggestHotel,
    suggestPets
  }
}
</script>

<style lang="css" scoped>
  @import "@/assets/css/home-body/index.css";
</style>
