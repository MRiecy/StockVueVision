/**
 * 用户认证相关API接口
 * 包含登录、注册、验证码、token管理等功能
 */

import { httpClient } from '@/utils/httpClient'
import { USE_MOCK_DATA } from './mockData'

// 模拟数据
const mockAuthData = {
  // 模拟验证码发送响应
  sendCodeResponse: {
    success: true,
    message: '验证码已发送',
    data: {
      expire_time: 300,
      can_resend_time: 60
    }
  },

  // 模拟登录响应
  loginResponse: {
    success: true,
    message: '登录成功',
    data: {
      user: {
        user_id: 'user_demo_001',
        phone: '13888888888',
        nickname: '演示用户',
        avatar: '',
        is_new_user: false,
        created_at: '2024-01-01T00:00:00Z',
        last_login: new Date().toISOString()
      },
      token: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo_access_token',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo_refresh_token',
        token_type: 'Bearer',
        expires_in: 3600
      }
    }
  },

  // 模拟用户信息
  userProfile: {
    success: true,
    data: {
      user_id: 'user_demo_001',
      phone: '13888888888',
      nickname: '演示用户',
      avatar: '',
      created_at: '2024-01-01T00:00:00Z',
      last_login: new Date().toISOString(),
      account_status: 'active',
      permissions: ['read', 'write', 'admin']
    }
  },

  // 模拟token刷新响应
  refreshTokenResponse: {
    success: true,
    message: 'Token刷新成功',
    data: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new_access_token',
      expires_in: 3600
    }
  }
}

/**
 * 发送手机验证码
 * @param {string} phone - 手机号码
 * @returns {Promise<Object>} 发送结果
 */
export const sendVerificationCode = async (phone) => {
  if (USE_MOCK_DATA) {
    console.log('🔄 [Mock] 发送验证码:', phone)
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    return mockAuthData.sendCodeResponse
  }

  try {
    const response = await httpClient.post('/api/auth/send-code/', {
      phone: phone
    })
    return response.data
  } catch (error) {
    console.error('发送验证码失败:', error)
    throw error
  }
}

/**
 * 手机号验证码登录/注册
 * @param {Object} loginData - 登录数据
 * @param {string} loginData.phone - 手机号码
 * @param {string} loginData.code - 验证码
 * @returns {Promise<Object>} 登录结果
 */
export const loginWithPhone = async (loginData) => {
  if (USE_MOCK_DATA) {
    console.log('🔄 [Mock] 手机号登录:', loginData)
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1200))

    // 模拟登录成功，保存token
    const response = mockAuthData.loginResponse
    if (response.success) {
      const { access_token, refresh_token } = response.data.token
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('user_info', JSON.stringify(response.data.user))
    }

    return response
  }

  try {
    const response = await httpClient.post('/api/auth/login/', {
      phone: loginData.phone,
      code: loginData.code
    })

    // 保存认证信息
    if (response.data.success) {
      const { access_token, refresh_token } = response.data.data.token
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('user_info', JSON.stringify(response.data.data.user))
    }

    return response.data
  } catch (error) {
    console.error('登录失败:', error)
    throw error
  }
}

/**
 * 刷新访问令牌
 * @returns {Promise<Object>} 刷新结果
 */
export const refreshAccessToken = async () => {
  if (USE_MOCK_DATA) {
    console.log('🔄 [Mock] 刷新Token')
    await new Promise(resolve => setTimeout(resolve, 500))

    const response = mockAuthData.refreshTokenResponse
    if (response.success) {
      localStorage.setItem('access_token', response.data.access_token)
    }

    return response
  }

  try {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      throw new Error('没有refresh token')
    }

    const response = await httpClient.post('/api/auth/refresh/', {}, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    })

    // 更新access token
    if (response.data.success) {
      localStorage.setItem('access_token', response.data.data.access_token)
    }

    return response.data
  } catch (error) {
    console.error('刷新Token失败:', error)
    // 刷新失败，清除所有认证信息
    clearAuthData()
    throw error
  }
}

/**
 * 退出登录
 * @returns {Promise<Object>} 退出结果
 */
export const logout = async () => {
  if (USE_MOCK_DATA) {
    console.log('🔄 [Mock] 用户退出登录')
    await new Promise(resolve => setTimeout(resolve, 300))
    clearAuthData()
    return { success: true, message: '退出登录成功' }
  }

  try {
    const response = await httpClient.post('/api/auth/logout/')
    clearAuthData()
    return response.data
  } catch (error) {
    console.error('退出登录失败:', error)
    // 即使API调用失败，也要清除本地认证信息
    clearAuthData()
    throw error
  }
}

/**
 * 获取当前用户信息
 * @returns {Promise<Object>} 用户信息
 */
export const getCurrentUser = async () => {
  if (USE_MOCK_DATA) {
    console.log('🔄 [Mock] 获取用户信息')
    await new Promise(resolve => setTimeout(resolve, 400))
    return mockAuthData.userProfile
  }

  try {
    const response = await httpClient.get('/api/auth/profile/')

    // 更新本地用户信息
    if (response.data.success) {
      localStorage.setItem('user_info', JSON.stringify(response.data.data))
    }

    return response.data
  } catch (error) {
    console.error('获取用户信息失败:', error)
    throw error
  }
}

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token')
  const userInfo = localStorage.getItem('user_info')
  return !!(token && userInfo)
}

/**
 * 获取本地存储的用户信息
 * @returns {Object|null} 用户信息
 */
export const getLocalUserInfo = () => {
  try {
    const userInfo = localStorage.getItem('user_info')
    return userInfo ? JSON.parse(userInfo) : null
  } catch (error) {
    console.error('解析用户信息失败:', error)
    return null
  }
}

/**
 * 获取访问令牌
 * @returns {string|null} 访问令牌
 */
export const getAccessToken = () => {
  return localStorage.getItem('access_token')
}

/**
 * 获取刷新令牌
 * @returns {string|null} 刷新令牌
 */
export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token')
}

/**
 * 清除所有认证数据
 */
export const clearAuthData = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_info')
}

/**
 * 验证手机号格式
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证验证码格式
 * @param {string} code - 验证码
 * @returns {boolean} 是否有效
 */
export const validateCode = (code) => {
  const codeRegex = /^\d{6}$/
  return codeRegex.test(code)
}

// 导出所有API函数
export default {
  sendVerificationCode,
  loginWithPhone,
  refreshAccessToken,
  logout,
  getCurrentUser,
  isAuthenticated,
  getLocalUserInfo,
  getAccessToken,
  getRefreshToken,
  clearAuthData,
  validatePhone,
  validateCode
}
