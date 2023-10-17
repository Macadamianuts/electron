# 桌面录屏软件开发
基于Electron V25.*版本 和 Vue3.js + TypeScript实现该项目录屏软件，使用electron-vue 的框架进行项目架构的构建。下列是**该程序的功能以及完成的状态**：

| 功能实现           | 完成状态 | 备注                       |
| ------------------ | -------- | -------------------------- |
| 打开摄像头         | ✅        | 可以实现切换不同摄像头设备 |
| 实现全屏录屏功能   | ✅        | 可以进行全屏录屏           |
| 桌面截图           | ✅        | 正处于开发...              |
| 实现拍照           | ✅        | 已经实现完毕               |
| 计时小球           | ❌        | 暂未开发                   |
| 生成不同格式视频   | ❌        | 暂时可录制 mp4             |
| 区域录制和区域截图 | ❌        | 暂未实现开发               |
| 快捷键 | ❌        | 暂未实现开发               |

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

## Project Setup

### Install

```bash
$ pnpm install
```

### Development

```bash
$ pnpm dev
```

### Build

```bash
# For windows
$ pnpm build:win

# For macOS
$ pnpm build:mac

# For Linux
$ pnpm build:linux
```
