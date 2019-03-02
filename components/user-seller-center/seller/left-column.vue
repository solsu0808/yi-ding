<template lang="html">
  <div class="center-left-column">
    <el-row>
      <el-col :span="24">
        <div class="left-column-headimg">
          <span class="iconfont icon-touxiang"></span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @select="click"
          background-color="transparent"
          text-color="#000"
          active-text-color="#31BBAC"
          :collapse="true">
          <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <span slot="title">概览</span>
          </el-menu-item>
          <el-menu-item index="2" disabled>
            <i class="el-icon-setting"></i>
            <span slot="title">设置</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  methods: {
      click(key, keyPath){
        console.log(key, keyPath);
      }
    }
}
</script>

<style lang="css">
@import "@/assets/css/user-seller-center/left-column.css";
@import "@/assets/css/icon/iconfont.css";
@import 'element-ui/lib/theme-chalk/display.css';
</style>
