import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

// 基础页面
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'NoCamera',
    component: () => import('@renderer/views/NoCamera.vue'),
    meta: {
      title: '开启摄像头'
    }
  },
  {
    path: '/offCamera',
    name: 'OffCamera',
    component: () => import('@renderer/views/OffCamera.vue'),
    meta: {
      title: '关闭摄像头'
    }
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('@renderer/views/Settings.vue'),
    meta: {
      title: '设置'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
