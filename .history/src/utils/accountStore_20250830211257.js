// 简单的账户状态管理
import { ref } from 'vue'

// 全局账户状态 - 不预设固定值，让系统动态获取
export const currentAccountId = ref('')
export const availableAccounts = ref([])

// 设置当前账户ID
export function setCurrentAccountId(accountId) {
  currentAccountId.value = accountId
  console.log('账户ID已更新:', accountId)
}

// 设置可用账户列表
export function setAvailableAccounts(accounts) {
  availableAccounts.value = accounts
  console.log('可用账户列表已更新:', accounts)

  // 如果当前没有选中账户，且账户列表不为空，自动选择第一个
  if (!currentAccountId.value && accounts.length > 0) {
    setCurrentAccountId(accounts[0].account_id)
  }
}

// 获取当前账户ID
export function getCurrentAccountId() {
  return currentAccountId.value
}

// 获取可用账户列表
export function getAvailableAccounts() {
  return availableAccounts.value
}

// 重置账户状态（用于重新连接后端时）
export function resetAccountState() {
  currentAccountId.value = ''
  availableAccounts.value = []
  console.log('账户状态已重置')
}
