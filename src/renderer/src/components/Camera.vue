<template>
  <main
    class="w-screen h-screen overflow-hidden"
    :class="{ 'rounded-full': config.rounded }"
    :style="`border:solid ${config.borderWidth} ${config.borderColor}`"
  >
    <video id="video" class="object-cover h-full" :class="{ 'rounded-full': config.rounded }"></video>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useConfigStore }  from '@renderer/stores/useConfigStore';
const { config } = useConfigStore()
onMounted(() => {
  const constraints = {
    audio: false,
    video: { deviceId: config.deviceId, width: 1920, height: 1080 }
  } as MediaStreamConstraints
  const video = document.querySelector('video')!

  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream
    video.play()
  })
})

const emit = defineEmits(['takePhoto'])
const takePhoto = () => {
  console.log("wwww");
      const video = document.getElementById('video')

      let canvas = document.createElement("canvas");
      // let ctx = canvas.getContext("2d");
      // // canvas.width = video!.videoWidth;
      // console.log("video!.videoWidth",video!.videoWidthh);

      // canvas.height = video!.videoHeight;
      // ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      // 将图片数据保存
  let imageData = canvas.toDataURL("@renderer/assets/image/png");
     console.log('imageData',imageData);

      emit('takePhoto', imageData)
}
takePhoto()
</script>

<style lang="scss" scoped>

</style>
