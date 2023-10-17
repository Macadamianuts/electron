<template>
  <main class="text-white relative overflow-hidden group">
    <video id="video-box" href="videoDom" ref="video" autoplay></video>
    <div class="absolute bottom-1 hidden group-hover:block z-10">
      <el-button
        :bg="bgFlag"
        size="small"
        type="primary"
        @click="openCamera"
      >
        开启摄像头
      </el-button>
      <el-button
        size="small"
        :bg="bgFlag"
        type="success"
        @click="screenDown"
      >
       {{ recordingText }}
      </el-button>
      <el-button
        size="small"
        :bg="bgFlag"
        type="warning"
        @click="onStop"
      >
        结束
      </el-button>
      <el-button
        size="small"
        :bg="bgFlag"
        type="danger"
        @click="screenShot"
      >
        截屏
      </el-button>
      <el-button :bg="bgFlag" size="small" type="warning" @click="goSetting">
        设置
      </el-button>
      <el-button :bg="bgFlag" type="default" @click="close" size="small">
        关闭
      </el-button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import router from '../router/index'
import { ElMessage } from 'element-plus'
import { useConfigStore }  from '@renderer/stores/useConfigStore';
const { config } = useConfigStore()
const bgFlag = ref<boolean>(true)
const recording = ref<boolean>(false) // 是否录制
const recordingText = computed<string>(() => recording.value ? '暂停': '开始/继续')
let recorder: MediaRecorder | null = null // 媒体录制容器
const videoDom = ref<any>()
const video = ref<any>()

onMounted(async () => {
  config.respitePlayer = false
  config.recording = false

})


// 打开相机
const openCamera = () => {
  if (config.deviceId !== '') {
    ElMessage({
      message: '已开启摄像头',
      type: 'success',
      duration: config.setTimeOut,
    });
  }
  router.push('/');
  return
};

const close = () => {
  window.api.closeCamera();
  setTimeout(() => {
    window.api.quit();
  }, 200);
};

// 屏幕流
const handleVideoStream = async () =>{
  const sourceId: string = await window.api.startRecord()
  const stream: MediaStream = await getStream(sourceId)

  videoDom.value = stream
  video.value.srcObject = stream
}
handleVideoStream()

// 截屏
const screenShot = () => {
  window.api.screenshot()
}

// 录屏倒计时
const count = ref<number>(3)
const countFlag = ref<boolean>(false)

const screenDown = async () => {
  let opt = await window.api.getScreenSize()
  const countDiv = window.document.createElement('div')
  countDiv.className = 'overplay'
  let x: string = opt.width / 2 - 100 + 'px'
  let y: string = opt.height / 2 - 100 + 'px'
  countDiv.style.left = x
  countDiv.style.top = y

  countFlag.value = true
  const interval = setInterval(() => {
    count.value--
    if (count.value <= 0) {
      clearInterval(interval)
      countFlag.value = false
      countDiv.style.display = 'none'
      onRecord()
    }
  })
}

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

// 结束录屏
// const stopRecording = () => {
//   window.api.stopRecord(recorder)
// }


const goSetting = () => {
  router.push('/setting');
};
</script>

<style lang="scss">
#video-box {
  width: 100%;
  height: 80%;
}
</style>
