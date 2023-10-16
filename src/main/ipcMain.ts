import { Menu, MenuItemConstructorOptions, ipcMain, app, dialog } from 'electron'
const fs = require('fs').promises

ipcMain.on('quit', () => {
  const template = [
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ] as MenuItemConstructorOptions[]
  const menu = Menu.buildFromTemplate(template)
  menu.popup()
})
// 监听渲染进程发送的保存照片消息
ipcMain.on('savePhoto', async (event, imgData: String) => {
  try {
    let base64 = imgData.replace(/^data:image\/\w+;base64,/, '')
    let dataBuffer = Buffer.from(base64, 'base64')

    let dia = await dialog.showSaveDialog({
      buttonLabel: '保存照片',
      filters: [{ name: 'Custom File Type', extensions: ['png', 'jpg', 'jpeg'] }]
    })

    if (!dia.canceled && dia.filePath) {
      await fs.writeFile(dia.filePath, dataBuffer)
      dialog.showMessageBox({
        type: 'info',
        title: '成功',
        message: '照片保存成功！',
        buttons: ['OK']
      })
      return dia.filePath
    } else {
      return null
    }
  } catch (error: any) {
    dialog.showErrorBox('错误', '保存照片失败：' + error.message)
    return null
  }
})
