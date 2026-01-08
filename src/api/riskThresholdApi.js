/**
 * 风险阈值 API
 * 用于获取风险指标数据
 */

import axios from 'axios';

// 创建一个axios实例配置后端地址
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * 获取综合风险评估（所有指标）
 * API: /api/risk-threshold/assessment/?account_id=DEMO000001
 * 
 * 后端返回格式（根据文档）:
 * {
 *   account_id: "DEMO000001",
 *   max_principal_loss: { max_loss_rate: 1.22, status: "正常", ... },
 *   volatility: { annual_volatility: 23.02, status: "正常", ... },
 *   max_drawdown: { max_drawdown: 5.25, status: "正常", ... },
 *   var: { var_rate: 1.50, status: "正常", ... }
 * }
 * 
 * 转换为前端需要的格式:
 * {
 *   risk_indicators: [
 *     { metric: "最大本金损失", value: "1.22%", status: "normal" },
 *     ...
 *   ]
 * }
 */
export async function fetchRiskAssessment(accountId = 'DEMO000001', days = 30) {
  try {
    const response = await api.get('/api/risk-threshold/assessment/', {
      params: { account_id: accountId, days }
    });
    console.log('✅ 风险评估 - 后端原始数据:', response.data);
    
    // 转换后端数据格式为前端需要的格式
    const transformed = transformRiskData(response.data);
    console.log('✅ 风险评估 - 转换后数据:', transformed);
    
    return transformed;
  } catch (error) {
    console.error('❌ 获取风险评估数据失败:', error);
    throw error;
  }
}

/**
 * 将后端完整格式转换为前端组件需要的简化格式
 */
function transformRiskData(backendData) {
  const risk_indicators = [];
  
  // 转换最大本金损失
  if (backendData.max_principal_loss) {
    risk_indicators.push({
      metric: '最大本金损失',
      value: `${backendData.max_principal_loss.max_loss_rate}%`,
      status: mapStatus(backendData.max_principal_loss.status)
    });
  }
  
  // 转换波动率
  if (backendData.volatility) {
    risk_indicators.push({
      metric: '波动率',
      value: `${backendData.volatility.annual_volatility}%`,
      status: mapStatus(backendData.volatility.status)
    });
  }
  
  // 转换最大回撤
  if (backendData.max_drawdown) {
    risk_indicators.push({
      metric: '最大回测幅度',
      value: `${backendData.max_drawdown.max_drawdown}%`,
      status: mapStatus(backendData.max_drawdown.status)
    });
  }
  
  // 转换VaR值
  if (backendData.var) {
    risk_indicators.push({
      metric: 'VaR值',
      value: `${backendData.var.var_rate}%`,
      status: mapStatus(backendData.var.status)
    });
  }
  
  return { risk_indicators };
}

/**
 * 映射后端状态到前端状态
 * 后端: "正常", "警告", "危险"
 * 前端: "normal", "warning", "danger"
 */
function mapStatus(backendStatus) {
  const statusMap = {
    '正常': 'normal',
    '警告': 'warning',
    '危险': 'danger',
    '低': 'normal',
    '中': 'warning',
    '高': 'danger'
  };
  return statusMap[backendStatus] || 'normal';
}

/**
 * 获取最大本金损失指标
 * API: /api/risk-threshold/max-principal-loss/
 */
export async function fetchMaxPrincipalLoss() {
  try {
    const response = await api.get('/api/risk-threshold/max-principal-loss/');
    console.log('✅ 最大本金损失 - 后端数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 获取最大本金损失数据失败:', error);
    throw error;
  }
}

/**
 * 获取波动率指标
 * API: /api/risk-threshold/volatility/
 */
export async function fetchVolatility() {
  try {
    const response = await api.get('/api/risk-threshold/volatility/');
    console.log('✅ 波动率 - 后端数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 获取波动率数据失败:', error);
    throw error;
  }
}

/**
 * 获取最大回撤指标
 * API: /api/risk-threshold/max-drawdown/
 */
export async function fetchMaxDrawdown() {
  try {
    const response = await api.get('/api/risk-threshold/max-drawdown/');
    console.log('✅ 最大回撤 - 后端数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 获取最大回撤数据失败:', error);
    throw error;
  }
}

/**
 * 获取VaR值指标
 * API: /api/risk-threshold/var/
 */
export async function fetchVaR() {
  try {
    const response = await api.get('/api/risk-threshold/var/');
    console.log('✅ VaR值 - 后端数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 获取VaR值数据失败:', error);
    throw error;
  }
}

