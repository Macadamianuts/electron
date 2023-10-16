import { ref } from 'vue'

type ConfigType = {
  deviceId: string
  page: string
}

const initConfig = ref<ConfigType>({
  deviceId: '请选择摄像头',
  page: 'camera'
})
export default () => {
  const cache = localStorage.getItem('config')
  const data = cache ? (JSON.parse(cache) as ConfigType) : initConfig
  const config = ref(data)

  const updateConfig = () => {
    localStorage.setItem('config', JSON.stringify(config.value))
  }
  return { config, updateConfig }
}
