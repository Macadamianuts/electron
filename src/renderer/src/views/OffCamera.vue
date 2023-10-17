<template>
  <main class="text-white">
    <video id="video-box" href="videoDom"></video>
    <div class="flex pt-3">
      <el-button
        :bg="bgFlag"
        class="mb-3"
        type="primary"
        @click="openCamera"
      >
        开启摄像头
      </el-button>
      <el-button
        class="mb-3"
        :bg="bgFlag"
        type="success"
        @click="onRecord"
      >
       {{ recordingText }}
      </el-button>
      <el-button
        class="mb-3"
        :bg="bgFlag"
        type="warning"
        @click="onStop"
      >
        结束
      </el-button>
      <el-button
        class="mb-3"
        :bg="bgFlag"
        type="danger"
        @click="screenShot"
      >
        截屏
      </el-button>
      <el-button :bg="bgFlag" class="mb-3" type="warning" @click="goSetting">
        设置
      </el-button>
      <el-button :bg="bgFlag" type="default" @click="close" class="mb-3">
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

onMounted(() => {
  config.respitePlayer = false
  config.recording = false
})

const openCamera = () => {
  if (config.deviceId !== '') {
    ElMessage({
      message: '已开启摄像头',
      type: 'success',
      duration: config.setTimeOut,
    });
    router.push('/');
  }
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
}
handleVideoStream()

// 截屏
const screenShot = () => {
  window.api.screenshot()
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
  height: 120px;
  margin-top: 6px;
  border: 1px solid #fff;
}
</style>
