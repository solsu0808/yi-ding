<template lang="html">
  <div class="suggest-pets">
    <el-row class="suggest-pets-title">
      <el-col :span="24">
        <i class="el-icon-bell"></i>
        <span>宠物频道</span>
      </el-col>
    </el-row>
    <el-row class="suggest-pets-body">
      <el-col :span="8" class="suggest-pets-body-first-list">
        <nuxt-link to="/product/type/宠物/1">
          <el-card :body-style="{ padding: '0px' }">
            <div class="pets-list">
              <div class="pets-list-title">{{ pets[0].title }}</div>
              <img :src="pets[0].src" class="image">
            </div>
          </el-card>
        </nuxt-link>
      </el-col>
      <el-col :span="8" v-for="(o, index) in pets.slice(1)" :key="index" class="suggest-pets-body-list">
          <nuxt-link to="/developing">
          <el-card :body-style="{ padding: '0px' }">
            <div class="pets-list">
              <div class="pets-list-title">{{ o.title }}</div>
              <img :src="o.src" class="image">
            </div>
          </el-card>
        </nuxt-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data(){
    return {
      pets: [
        {title: '宠物', src: require('@/assets/img/pets-suggest1.jpg'), href: ''},
        {title: '阿狗食堂', src: require('@/assets/img/pets-suggest2.jpg'), href: ''},
        {title: '阿狗医院', src: require('@/assets/img/pets-suggest3.jpg'), href: ''},
        {title: '阿猫食堂', src: require('@/assets/img/pets-suggest4.jpg'), href: ''},
        {title: '阿猫医院', src: require('@/assets/img/pets-suggest5.jpg'), href: ''}
      ]
    }
  }
}
</script>

<style lang="css" scoped>
@import "@/assets/css/home-body/suggest-pets.css";
</style>
