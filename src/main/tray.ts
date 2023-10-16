import { Menu, Tray } from 'electron'
import path from 'path'

// 图标设置
const createTray = () => {
  const tray = new Tray(
    path.resolve(
      __dirname,
      process.platform == 'darwin'
        ? '../../resources/mac_camera.png'
        : '../../resources/win_camera.png'
    )
  )
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      role: 'quit'
    }
  ])
  tray.setToolTip('摄像头')
  tray.setContextMenu(contextMenu)
}

export default createTray
