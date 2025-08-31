import { ref, computed } from 'vue'
import {
  isAuthenticated,
  getLocalUserInfo,
  clearAuthData,
  logout as logoutApi
} from '@/api/authApi'

// 全局认证状态
export const useAuthStore = () => {
  // 响应式状态
  const isLoggedIn = ref(false)
  const userInfo = ref(null)
  const isLoading = ref(false)

  // 计算属性
  const isAuthenticatedComputed = computed(() => isLoggedIn.value)
  const userName = computed(() => userInfo.value?.nickname || userInfo.value?.username || userInfo.value?.phone || '用户')
  const userAvatar = computed(() => userInfo.value?.avatar || '')

  // 初始化认证状态
  const initAuth = () => {
    const authenticated = isAuthenticated()
    isLoggedIn.value = authenticated

    if (authenticated) {
      const localUserInfo = getLocalUserInfo()
      if (localUserInfo) {
        userInfo.value = localUserInfo
      }
    }
  }

  // 设置用户信息
  const setUserInfo = (info) => {
    userInfo.value = info
    isLoggedIn.value = true
  }

  // 清除用户信息
  const clearUserInfo = () => {
    userInfo.value = null
    isLoggedIn.value = false
  }

  // 退出登录
  const logout = async () => {
    try {
      isLoading.value = true
      await logoutApi()
      clearUserInfo()
      clearAuthData()
      return { success: true, message: '退出登录成功' }
    } catch (error) {
      console.error('退出登录失败:', error)
      // 即使API调用失败，也要清除本地数据
      clearUserInfo()
      clearAuthData()
      return { success: false, message: '退出登录失败，已清除本地数据' }
    } finally {
      isLoading.value = false
    }
  }

  // 刷新用户信息
  const refreshUserInfo = () => {
    initAuth()
  }

  return {
    // 状态
    isLoggedIn,
    userInfo,
    isLoading,

    // 计算属性
    isAuthenticatedComputed,
    userName,
    userAvatar,

    // 方法
    initAuth,
    setUserInfo,
    clearUserInfo,
    logout,
    refreshUserInfo
  }
}

// 创建全局实例
export const authStore = useAuthStore()

// 默认导出
export default authStore
