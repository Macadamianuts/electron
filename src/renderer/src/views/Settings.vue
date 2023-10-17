<template>
  <main class="bg-[#2c3e50] w-screen h-screen p-5 flex flex-col gap-5  overflow-x-hidden">
    <h2 class="text-gray-50 text-center text-sm opacity-70">参数设置</h2>
      <el-select v-model="config.deviceId" placeholder="选择摄像头" clearable filterable>
        <el-option
          v-for="item in cameras"
          :key="item.deviceId"
          :label="item.label"
          :value="item.deviceId"
        >
        </el-option>
      </el-select>
      <el-input type="text" placeholder="荧光大小" v-model="config.borderWidth" />
      <el-input type="text" placeholder="描边颜色" v-model="config.borderColor" />
      <div class="flex justify-end">
        <el-button type="success" @click="updateConfig" size="lager">保存</el-button>
        <el-button type="danger" @click="goBack" size="lager">退出</el-button>
      </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import router from '../router/index'
import { useConfigStore } from '@renderer/stores/useConfigStore';
const { config, updateConfig } = useConfigStore()

const cameras = ref([])
onMounted(async () => {
  // 获取用户硬件装备
  const devices = await navigator.mediaDevices.enumerateDevices()
  cameras.value = devices.filter((d) => d.kind.includes('video'))
})

const goBack = () => {
  config.page = 'camera'
  return router.push('/')
}
</script>

<style lang="sass"></style>
