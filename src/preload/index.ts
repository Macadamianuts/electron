import { contextBridge, ipcRenderer,dialog } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
// Custom APIs for renderer
const api = {
  // 退出程序
  quit: () => {
    ipcRenderer.send('quit')
  },
  // 拽动窗口
  drag: (options: { x: number; y: number }) => {
    ipcRenderer.send('drag', options)
  },
  // 设置窗口大小
  setWindowSize: (opt: any) => {
    ipcRenderer.send('setWindowSize', opt)
  },
  // 关闭相机
  closeCamera: () => {
    ipcRenderer.send('closeCamera')
  },
  //保存照片截图
  savePhoto: (opt: any) => {
    ipcRenderer.send('savePhoto', opt)
  },
  // 照片保存到本地
  photoSaved: () => {
    ipcRenderer.on('photo-saved', (_ , filePath) => {
      if (filePath) {
        console.log('照片已保存至：', filePath)
        // 在这里可以处理照片保存成功的逻辑，例如显示成功消息、展示保存的照片路径等
        dialog.showMessageBox({
          type: 'info',
          title: '成功',
          message: '照片保存成功！',
          buttons: ['OK']
        })
      } else {
        console.log('照片保存失败或用户取消保存操作。')
        // 在这里可以处理照片保存失败或用户取消保存的逻辑，例如显示失败消息、提供重试选项等
        dialog.showErrorBox('错误', '保存照片失败')
      }
    })
  },
  getRecordedVideoData: () => {
    console.log('preload')

    return ipcRenderer.invoke('getRecordedVideoData')
  },
  // 录屏
  startRecord: () => ipcRenderer.invoke('rendererInvoke:startRecord'), // 开始录屏
  stopRecord: (data:any) => ipcRenderer.invoke('rendererInvoke:stopRecord', data), // 结束录屏
  screenshot: () => ipcRenderer.invoke('rendererInvoke:screenshot'), // 截屏
  getScreenSize: () => ipcRenderer.invoke('rendererInvoke:getScreenSize')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
