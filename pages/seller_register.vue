<template lang="html">
  <div class="sellers-register">
    <register-header></register-header>
    <register-body></register-body>
  </div>
</template>

<script>
import registerHeader from "@/components/register/seller-register/header"
import registerBody from "@/components/register/seller-register/body"

export default {
  components: {
    registerHeader,
    registerBody
  }
}
</script>

<style lang="css" scoped>
</style>
