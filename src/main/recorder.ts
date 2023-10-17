const { ipcMain, desktopCapturer, dialog} = require('electron')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')

ipcMain.handle('rendererInvoke:startRecord', handleStartRecord) // 开始录屏
ipcMain.handle('rendererInvoke:screenshot', () => handlerScreenshot()) // 截图
ipcMain.handle('rendererInvoke:stopRecord', (event, data) => handleStopRecord(data)) // 结束录屏
ipcMain.handle('rendererInvoke:getScreenSize', getScreenSize)
// 开始录屏
async function handleStartRecord() {
  // 捕获屏幕
  const sources = await desktopCapturer.getSources({
    types: ['screen']
  })
  return sources[0].id
}

async function handleStopRecord(data: any) {
  try {
    const dia = await showDialog('保存视频', 'Movies', 'mp4')
    if (!dia.canceled && dia.filePath) {
      await writeFileAsync(dia.filePath, data)
      showSuccessMessage('视频保存成功！')
      return dia.filePath
    } else {
      return null
    }
  } catch (error: any) {
    showErrorMessage('视频保存失败', error.message)
    return null
  }
}

async function showDialog(label: string, name: string, extensions: string) {
  return await dialog.showSaveDialog({
    buttonLabel: label,
    filters: [{ name, extensions: [extensions] }]
  })
}

function writeFileAsync(filePath: string, data: any): Promise<void> {
  return fs.promises.writeFile(filePath, data)
}

function showSuccessMessage(message: string): void {
  dialog.showMessageBox({
    type: 'info',
    title: '成功',
    message: message,
    buttons: ['OK']
  })
}

function showErrorMessage(title: string, message: string): void {
  dialog.showErrorBox(title, message)
}

// 截图
async function handlerScreenshot() {
  // 获取屏幕宽高
  const { width, height } = screen.getPrimaryDisplay().size

  // 捕捉屏幕
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { width, height }
  })

  // 打开文件对话框
  try {
    const dia = await showDialog('保存截图', 'Images', 'png')
    if (!dia.canceled && dia.filePath) {
      await writeFileAsync(dia.filePath, sources[0].thumbnail.toPNG())
      showSuccessMessage('截图保存成功！')
      return dia.filePath
    } else {
      return null
    }
  } catch (error: any) {
    showErrorMessage('截图保存失败', error.message)
    return null
  }
}

function getScreenSize():object {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  let options: Object = {
    width,
    height
  }
  return options
}





