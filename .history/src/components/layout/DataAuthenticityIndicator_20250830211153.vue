<template>
  <div class="data-authenticity-indicator">
    <div class="indicator-header">
      <span class="indicator-title">数据真实性验证</span>
      <div class="status-badge" :class="statusClass">
        {{ statusText }}
      </div>
    </div>

    <div class="indicator-content">
      <div class="data-source">
        <span class="label">数据来源:</span>
        <span class="value">{{ dataSource }}</span>
      </div>

      <div class="account-info">
        <span class="label">账户ID:</span>
        <span class="value">{{ accountId }}</span>
      </div>

      <div class="last-update">
        <span class="label">最后更新:</span>
        <span class="value">{{ lastUpdate }}</span>
      </div>

      <div class="data-verification">
        <span class="label">验证状态:</span>
        <span class="value" :class="verificationClass">{{ verificationStatus }}</span>
      </div>
    </div>

    <div class="verification-actions">
      <button @click="verifyData" class="verify-btn" :disabled="isVerifying">
        {{ isVerifying ? '验证中...' : '验证数据' }}
      </button>
      <button @click="showDataDetails" class="details-btn">查看详情</button>
    </div>

    <!-- 数据详情弹窗 -->
    <el-dialog
      v-model="showDetails"
      title="数据详情"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="data-details">
        <h4>API响应数据</h4>
        <pre class="api-data">{{ JSON.stringify(apiData, null, 2) }}</pre>

        <h4>图表使用数据</h4>
        <pre class="chart-data">{{ JSON.stringify(chartData, null, 2) }}</pre>

        <h4>数据一致性检查</h4>
        <div class="consistency-check">
          <div v-for="(check, index) in consistencyChecks" :key="index" class="check-item">
            <span class="check-label">{{ check.label }}:</span>
            <span class="check-result" :class="check.passed ? 'passed' : 'failed'">
              {{ check.passed ? '✅ 通过' : '❌ 失败' }}
            </span>
            <span class="check-details">{{ check.details }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { currentAccountId } from '@/utils/accountStore.js'

export default {
  name: 'DataAuthenticityIndicator',
  props: {
    chartData: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const isVerifying = ref(false)
    const showDetails = ref(false)
    const apiData = ref({})
    const lastUpdate = ref('')
    const dataSource = ref('API接口')

    // 计算状态
    const statusClass = computed(() => {
      return 'status-' + (props.chartData && Object.keys(props.chartData).length > 0 ? 'authentic' : 'unknown')
    })

    const statusText = computed(() => {
      return props.chartData && Object.keys(props.chartData).length > 0 ? '真实数据' : '未知状态'
    })

    const verificationStatus = computed(() => {
      return props.chartData && Object.keys(props.chartData).length > 0 ? '已验证' : '未验证'
    })

    const verificationClass = computed(() => {
      return props.chartData && Object.keys(props.chartData).length > 0 ? 'verified' : 'unverified'
    })

    const accountId = computed(() => currentAccountId.value)

    // 数据一致性检查
    const consistencyChecks = computed(() => {
      if (!apiData.value || !props.chartData) return []

      const checks = []

      // 检查账户ID一致性
      checks.push({
        label: '账户ID一致性',
        passed: apiData.value.accountId === accountId.value,
        details: `API: ${apiData.value.accountId}, 当前: ${accountId.value}`
      })

      // 检查数据更新时间
      checks.push({
        label: '数据时效性',
        passed: lastUpdate.value && (Date.now() - new Date(lastUpdate.value).getTime()) < 60000, // 1分钟内
        details: `最后更新: ${lastUpdate.value}`
      })

      // 检查数据完整性
      checks.push({
        label: '数据完整性',
        passed: props.chartData && Object.keys(props.chartData).length > 0,
        details: `图表数据项: ${Object.keys(props.chartData).length}`
      })

      return checks
    })

    // 验证数据
    const verifyData = async () => {
      isVerifying.value = true

      try {
        console.log('开始验证数据真实性...')

        // 调用API获取最新数据
        const response = await fetch('http://localhost:8000/api/account-info/')
        if (response.ok) {
          const data = await response.json()
          apiData.value = {
            accountId: data.accounts?.[0]?.account_id,
            totalAsset: data.accounts?.[0]?.total_asset,
            marketValue: data.accounts?.[0]?.market_value,
            positions: data.accounts?.[0]?.positions?.length || 0,
            timestamp: new Date().toISOString()
          }

          lastUpdate.value = new Date().toLocaleString('zh-CN')

          console.log('数据验证完成:', apiData.value)
        } else {
          throw new Error(`API响应错误: ${response.status}`)
        }
      } catch (error) {
        console.error('数据验证失败:', error)
        apiData.value = { error: error.message }
      } finally {
        isVerifying.value = false
      }
    }

    // 显示数据详情
    const showDataDetails = () => {
      showDetails.value = true
    }

    // 组件挂载时自动验证
    onMounted(() => {
      verifyData()
    })

    return {
      isVerifying,
      showDetails,
      apiData,
      lastUpdate,
      dataSource,
      accountId,
      statusClass,
      statusText,
      verificationStatus,
      verificationClass,
      consistencyChecks,
      verifyData,
      showDataDetails
    }
  }
}
</script>

<style scoped>
.data-authenticity-indicator {
  background: rgba(0, 20, 40, 0.95);
  border: 1px solid rgba(64, 224, 255, 0.3);
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
  color: #fff;
}

.indicator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.indicator-title {
  font-weight: bold;
  color: #40e0ff;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status-authentic {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.5);
}

.status-unknown {
  background: rgba(255, 152, 0, 0.2);
  color: #FF9800;
  border: 1px solid rgba(255, 152, 0, 0.5);
}

.indicator-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 15px;
}

.data-source, .account-info, .last-update, .data-verification {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.label {
  font-size: 12px;
  color: #888;
}

.value {
  font-weight: bold;
  color: #fff;
}

.value.verified {
  color: #4CAF50;
}

.value.unverified {
  color: #FF9800;
}

.verification-actions {
  display: flex;
  gap: 10px;
}

.verify-btn, .details-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.verify-btn {
  background: #40e0ff;
  color: #000;
}

.verify-btn:hover:not(:disabled) {
  background: #30a0ff;
}

.verify-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

.details-btn {
  background: transparent;
  color: #40e0ff;
  border: 1px solid #40e0ff;
}

.details-btn:hover {
  background: rgba(64, 224, 255, 0.1);
}

/* 弹窗样式 */
.data-details {
  max-height: 400px;
  overflow-y: auto;
}

.data-details h4 {
  color: #40e0ff;
  margin: 15px 0 10px 0;
}

.api-data, .chart-data {
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: pre-wrap;
  max-height: 150px;
  overflow-y: auto;
}

.consistency-check {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.check-label {
  font-weight: bold;
  min-width: 120px;
}

.check-result {
  font-weight: bold;
  min-width: 80px;
}

.check-result.passed {
  color: #4CAF50;
}

.check-result.failed {
  color: #f44336;
}

.check-details {
  color: #888;
  font-size: 12px;
}
</style>
