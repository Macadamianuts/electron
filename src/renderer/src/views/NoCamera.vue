<script setup lang="ts">

import router from "@renderer/router/index";
import {
  Setting as SettingIcon,
  InnerShadowTopLeft,
  RoundDistortion,
  RightOne,
  CameraThree,
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
const videoDom = ref<any>()
const flag = ref<boolean>(false)

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
  config.page = 'setting'
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
const recording = ref<boolean>(false) // 是否录制
let recorder: MediaRecorder | null = null // 媒体录制容器


// 屏幕流
const handleVideoStream = async () =>{
  const sourceId: string = await window.api.startRecord()
  const stream: MediaStream = await getStream(sourceId)

  videoDom.value = stream
}
handleVideoStream()

// 截屏
// const screenShot = () => {
//   window.api.screenshot()
// }

// 开始/暂停/继续
const onRecord = async () => {
  if (recording.value) {
    // 正在录制
    recording.value = false
  } else {
    if (!recorder) {
      // 未开始录制
      const sourceId: string = await window.api.startRecord()
      // 录屏流
      const stream: MediaStream = await getStream(sourceId)
      recorder = createRecorder(stream)
    } else {
      // 已暂停，点击继续
      recorder.resume()
    }
    recording.value = false
  }
}

// 停止
const onStop = () => {
  if (recorder) {
    recorder.stop()
    recorder = null
  }
  recording.value = false
}

// 获取音频流
const getStream = async (sourceId: string): Promise<MediaStream> => {
  const stream = await navigator.mediaDevices.getUserMedia(<MediaStreamConstraints>{
    audio: {
      mandatory: {
        chromeMediaSource: 'desktop'
      }
    },
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: sourceId
      }
    }
  })
  return stream
}

// 创建媒体录制器
const createRecorder = (stream: MediaStream): MediaRecorder => {
  const recorder = new MediaRecorder(stream)
  recorder.start()
  recorder.ondataavailable = e => {
    const blob = new Blob([e.data], {
      type: 'video/mp4'
    })
    const reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    reader.onload = () => {
      const arrayBuffer = reader.result
      const data = new DataView(<ArrayBuffer>arrayBuffer)
      // @ts-ignore
      window.api.stopRecord(data)
    }
  }
  return recorder
}

</script>

<template>
      <Suspense>
        <main class="relative group" @contextmenu="quit">
          <section class="">
            <SettingIcon
              theme="outline"
              size="22"
              class="absolute left-1/2 -translate-x-1/2 hidden group-hover:block mt-3 text-white opacity-80 cursor-pointer z-10 "
              v-if="config.page == 'camera'"
              @click="goSetting"
              />
          </section>
          <section class="absolute bottom-1 right-1  hidden group-hover:block z-20 text-[#f5a623]">
              <!-- 开始全屏录制 -->
              <RightOne
              theme="outline"
              class=" inline-block ml-2 mt-2"
              size="28"
              v-if="flag === false"
              @click="onRecord"
              />
              <!-- 暂停录制 -->
              <Pause
              theme="outline"
              size="24"
              class=" inline-block ml-2"
              v-if="flag === true"
              @click="onStop"
              />
              <!-- 关闭摄像头 -->
              <MonitorOff
              theme="outline"
              class=" inline-block ml-2"
              size="22"
              v-if="config.page == 'camera'"
              @click="stopCamera"
              />
              <!-- 拍照 -->
              <CameraThree
              theme="outline"
              size="26"
              class=" inline-block ml-2"
              v-if="config.page == 'camera'"
              @click="startDown"
              />
              <!-- 圆形 -->
              <InnerShadowTopLeft
              theme="outline"
              size="24"
              class=" inline-block ml-2"
              v-if="config.page  == 'camera' && config.rounded == false"
              @click="changRound"
              />
              <!-- 切换 -->
              <RoundDistortion
              theme="outline"
              size="22"
              class=" inline-block ml-2"
              v-if="config.page  == 'camera' && config.rounded == true"
              @click="config.rounded = !config.rounded"
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
