<template lang="html">
  <div class="sellers-login">
    <login-header></login-header>
    <login-body></login-body>
    <my-footer></my-footer>
  </div>
</template>

<script>
import loginHeader from "@/components/login/seller-login/header"
import loginBody from "@/components/login/seller-login/body"
import myFooter from "@/components/public/my-footer.vue"

export default {
  components: {
    loginHeader,
    loginBody,
    myFooter
  }
}
</script>

<style lang="css" scoped>
</style>
