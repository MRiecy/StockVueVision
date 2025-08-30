// 简单的账户状态管理
import { ref } from 'vue'

// 全局账户状态
export const currentAccountId = ref('40000326')
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
}

// 获取当前账户ID
export function getCurrentAccountId() {
  return currentAccountId.value
}

// 获取可用账户列表
export function getAvailableAccounts() {
  return availableAccounts.value
}
