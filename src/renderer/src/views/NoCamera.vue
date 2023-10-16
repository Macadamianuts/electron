<script setup lang="ts">

import router from "@renderer/router/index";
import {
  Setting as SettingIcon,
  CameraFive,
  InnerShadowTopLeft,
  RoundDistortion,
  RightOne,
  CameraThree,
  Monitor,
  Pause,
  MonitorOff
} from '@icon-park/vue-next'
import useDrag from "../composables/useDrag";
import { useConfigStore } from "../stores/useConfigStore";
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus'

const videoElement = ref();
const capturedPhoto = ref('');

// 初始化音频
onMounted(() => {
  // 设置使用摄像头
  config.useCamera = true

  // 获取video元素
  videoElement.value = document.getElementById('video') as HTMLVideoElement;

  const constraints = {
    audio: false,
    video: { deviceId: config.deviceId, width: 1920, height: 1080 }
  } as MediaStreamConstraints
  const video = document.querySelector('video')!
  // 获取视频流
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream
    video.play()
  })

  // 保存照片
  window.api.photoSaved(capturedPhoto.value)
})

const { config } = useConfigStore()
// 拖拽窗口事件
const  { drag }  = useDrag()
drag.run()

// 退出
const quit = () => {
  window.api.quit()
}

// 关闭摄像头跳转页面
const stopCamera = () => {
  config.useCamera = false
  ElMessage({
    type: 'success',
    message: '已关闭摄像头',
    duration: config.setTimeOut
  })

  return router.push('/offCamera')
}

// 倒计时设置
const count = ref(3)
const countFlag = ref(false)

// 开启倒计时
const startDown = () => {
  countFlag.value = true
  const interval = setInterval(() => {
    count.value--;
    if (count.value <= 0) {
      clearInterval(interval)
      countFlag.value = false
      // 拍照
      takePhoto()
    }
  },1000)
}


const changRound = () => {
  config.rounded = !config.rounded
  if (config.rounded) window.api.setWindowSize({ aspectRatio: 1, width: 300, height: 300 })
  else window.api.setWindowSize({ aspectRatio: 16 / 9, width: 500, height: 280 })
}

// 去设置
const goSetting = () => {
  router.push('/setting')
  return
}

// 拍照
const takePhoto = () => {
  if (!videoElement.value) {
    console.error('Video element not initialized.');
    return;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = videoElement.value.videoWidth;
  canvas.height = videoElement.value.videoHeight;
  ctx!.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height);

  // 获取拍摄的照片数据
  capturedPhoto.value = canvas.toDataURL('image/png');
  savePhoto();
};

// 保存照片
const savePhoto = () => {
  if (capturedPhoto.value) {
    window.api.savePhoto(capturedPhoto.value)
  }
};

// 全屏录屏功能


// 开始录屏

// 暂停录屏

// 继续录屏

// 结束录屏


</script>

<template>
      <Suspense>
        <main class="relative group" @contextmenu="quit">
          <section>
            <SettingIcon
              theme="outline"
              size="22"
              class="absolute left-1/2 -translate-x-1/2 mt-3 text-white opacity-80 cursor-pointer z-10 hidden group-hover:block"
              v-if="config.page == 'camera'"
              @click="goSetting"
              />
              <!-- 相机 -->
              <CameraFive
              theme="outline"
              size="22"
              class="absolute left-1/2 -translate-x-1/2 mt-3 text-white opacity-80 cursor-pointer z-10 hidden group-hover:block"
              v-if="config.page  == 'setting'"
              @click="config.page  = 'camera'"
              />
              <!-- 圆形 -->
              <InnerShadowTopLeft
              theme="outline"
              size="24"
              class="absolute right-1/4 -translate-x-1/2 mt-3 bottom-3 text-[#f5a623]  cursor-pointer z-10 hidden group-hover:block"
              v-if="config.page  == 'camera' && config.rounded == false"
              @click="changRound"
              />
              <!-- 切换 -->
              <RoundDistortion
              theme="outline"
              size="22"
              class="absolute right-1/4 -translate-x-1/2 mt-3 bottom-3  text-[#f5a623] cursor-pointer z-10 hidden group-hover:block"
              v-if="config.page  == 'camera' && config.rounded == true"
              @click="config.rounded = !config.rounded"
              />
              <!-- 开始全屏录制 -->
              <RightOne
              theme="outline"
              size="28"
              class="absolute left-1/3 -translate-x-1/2  mt-3 bottom-3 text-[#f5a623]  cursor-pointer z-10 hidden group-hover:block"
              v-if="config.page == 'camera' && config.begin == false"
              @click="config.begin = !config.begin"
              />
              <!-- 暂停录制 -->
              <Pause
              theme="outline"
              size="24"
              class="absolute left-1/3 -translate-x-1/2  mt-3 bottom-3 text-[#f5a623]  cursor-pointer z-10 hidden group-hover:block"
              v-if="config.page == 'camera' && config.begin == true"
              @click="config.begin =!config.begin"
              />
              <!-- 拍照 -->
              <CameraThree
              theme="outline"
              size="26"
              class="absolute right-1/4 -translate-x-1/2  mt-3 bottom-12 text-[#f5a623] cursor-pointer z-10 hidden group-hover:block"
              v-if="config.page == 'camera'"
              @click="startDown"
              />
              <!-- 开启摄像头 -->
              <Monitor
              theme="outline"
              size="22"
              class="absolute left-1/3 -translate-x-1/2  mt-3 bottom-12 text-[#f5a623]  cursor-pointer z-10 hidden group-hover:block"
              v-if="config.page == 'camera' && config.useCamera == false"
              @click="openCamera"
              />
              <!-- 关闭摄像头 -->
              <MonitorOff
              theme="outline"
              class="absolute left-1/3 -translate-x-1/2  mt-3 bottom-12 text-[#f5a623]  cursor-pointer z-10 hidden group-hover:block"
              size="22"
              v-if="config.page == 'camera' && config.useCamera == true"
              @click="stopCamera"
              />
            </section>
            <section>
              <main
              class="w-screen h-screen overflow-hidden"
              :class="{ 'rounded-full': config.rounded }"
              :style="`border:solid ${config.borderWidth} ${config.borderColor}`"
              >
              <video id="video" class="object-cover h-full" :class="{ 'rounded-full': config.rounded }"></video>
              <div class="centered-text" v-if="countFlag"> {{  count  }}</div>
            </main>
            </section>
        </main>
      </Suspense>
</template>

<style scoped lang="less">
.centered-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 8rem;
  color: white;
  opacity: 0.5;
  z-index: 20;
}
</style>
