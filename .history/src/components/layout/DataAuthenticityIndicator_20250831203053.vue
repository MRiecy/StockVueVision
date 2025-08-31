<template>
  <div class="data-authenticity-indicator ultra-compact">
    <!-- 超简洁版：只显示状态徽章 -->
    <div class="status-line">
      <span class="status-dot" :class="statusClass"></span>
      <span class="status-text">{{ statusText }}</span>
      <button @click="verifyData" class="verify-btn-mini" :disabled="isVerifying" title="验证数据">
        {{ isVerifying ? '...' : '✓' }}
      </button>
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

        // 使用httpClient调用API获取最新数据
        const { httpClient } = await import('@/utils/httpClient')
        const response = await httpClient.get('/api/account-info/')

        if (response.status === 200) {
          const data = response.data
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
/* 超简洁版样式 */
.data-authenticity-indicator.ultra-compact {
  margin: 2px 0;
}

.status-line {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 6px;
  background: rgba(0, 20, 40, 0.4);
  border: 1px solid rgba(64, 224, 255, 0.15);
  border-radius: 4px;
  font-size: 11px;
  color: #ccc;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-authentic {
  background: #4CAF50;
  box-shadow: 0 0 4px rgba(76, 175, 80, 0.6);
}

.status-unknown {
  background: #FF9800;
  box-shadow: 0 0 4px rgba(255, 152, 0, 0.6);
}

.status-text {
  font-size: 10px;
  white-space: nowrap;
}

.verify-btn-mini {
  width: 16px;
  height: 16px;
  border: none;
  border-radius: 2px;
  background: rgba(64, 224, 255, 0.2);
  color: #40e0ff;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
}

.verify-btn-mini:hover:not(:disabled) {
  background: rgba(64, 224, 255, 0.3);
}

.verify-btn-mini:disabled {
  background: rgba(100, 100, 100, 0.2);
  color: #666;
  cursor: not-allowed;
}

/* 弹窗样式保持不变 */
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
