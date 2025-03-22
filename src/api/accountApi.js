// src/api/accountApi.js
import axios from 'axios'

/**
 * 从后端获取账户资产及持仓数据
 * @returns {Promise<Object>} 返回后端的 JSON 数据，例如 { accounts: [...] }
 */
export async function fetchAccountInfo() {
  const response = await axios.get('/api/account-info/')

  return response.data
}
