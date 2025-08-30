<template>
  <div class="data-authenticity-indicator">
    <div class="indicator-content">
      <span class="status-text">数据状态: {{ statusText }}</span>
      <span class="account-info">账户: {{ accountId }}</span>
      <span class="last-update">更新: {{ lastUpdate }}</span>
    </div>
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
    const lastUpdate = ref('')

    const statusText = computed(() => {
      if (props.chartData && Object.keys(props.chartData).length > 0) {
        return '✅ 真实数据'
      }
      return '⚠️ 无数据'
    })

    const accountId = computed(() => currentAccountId.value)

    onMounted(() => {
      lastUpdate.value = new Date().toLocaleString('zh-CN')
    })

    return {
      lastUpdate,
      statusText,
      accountId
    }
  }
}
</script>

<style scoped>
.data-authenticity-indicator {
  background: rgba(0, 20, 40, 0.8);
  border: 1px solid rgba(64, 224, 255, 0.3);
  border-radius: 6px;
  padding: 8px 12px;
  margin: 8px 0;
  color: #fff;
  font-size: 12px;
}

.indicator-content {
  display: flex;
  gap: 15px;
  align-items: center;
}

.status-text {
  font-weight: bold;
  color: #40e0ff;
}

.account-info, .last-update {
  color: #ccc;
}
</style>
