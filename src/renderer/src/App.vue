<script setup lang="ts">
import useDrag from "./composables/useDrag";
// 拖拽窗口事件
const  { drag }  = useDrag()
drag.run()
</script>

<template>
  <router-view></router-view>
</template>

<style scoped lang="less">

</style>
