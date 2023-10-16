import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore(
  'counter',
  () => {
    const config = ref({
      page: 'camera',
      deviceId: '',
      borderWidth: '0px',
      borderColor: 'red',
      rounded: false,
      recording: false,
      player: false,
      endPlayer: false,
      cameraModel: true,
      respitePlayer: false,
      setTimeOut: 600
    })

    const updateConfig = () => {}

    return { config, updateConfig }
  },
  {
    persist: true
  }
)
