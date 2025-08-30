<template>
  <div class="data-mode-toggle">
    <div class="toggle-container">
      <span class="toggle-label">数据模式:</span>
      <div class="toggle-switch" @click="toggleDataMode">
        <div class="toggle-track" :class="{ active: !useMockData }">
          <div class="toggle-thumb" :class="{ active: !useMockData }"></div>
        </div>
        <span class="toggle-text">{{ useMockData ? '模拟数据' : '真实数据' }}</span>
      </div>
      <div class="status-indicator" :class="statusClass">
        <div class="status-dot"></div>
        <span class="status-text">{{ statusText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMockDataSetting } from '@/api/mockData.js'

const useMockData = ref(true)
const statusText = ref('检查中...')
const statusClass = ref('checking')

onMounted(() => {
  // 读取当前数据模式设置
  useMockData.value = getMockDataSetting()
  updateStatus()
})

const toggleDataMode = () => {
  useMockData.value = !useMockData.value
  
  // 保存到localStorage
  localStorage.setItem('useMockData', useMockData.value.toString())
  
  // 更新状态
  updateStatus()
  
  // 刷新页面以应用新的数据模式
  setTimeout(() => {
    window.location.reload()
  }, 500)
}

const updateStatus = () => {
  if (useMockData.value) {
    statusText.value = '虚拟数据'
    statusClass.value = 'mock'
  } else {
    statusText.value = '真实数据'
    statusClass.value = 'real'
  }
}
</script>

<style scoped>
.data-mode-toggle {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: rgba(0, 20, 40, 0.95);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 255, 255, 0.2);
  color: #fff;
  font-size: 14px;
}

.toggle-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle-label {
  font-weight: 500;
  color: #00ffff;
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.toggle-track {
  width: 48px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.toggle-track.active {
  background: rgba(0, 255, 255, 0.3);
  border-color: #00ffff;
}

.toggle-thumb {
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 3px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-thumb.active {
  left: 26px;
  background: #00ffff;
}

.toggle-text {
  font-size: 13px;
  font-weight: 500;
  min-width: 60px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
}

.status-indicator.checking {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.status-indicator.mock {
  background: rgba(255, 152, 0, 0.2);
  color: #ff9800;
}

.status-indicator.real {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s infinite;
}

.status-text {
  font-weight: 500;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .data-mode-toggle {
    top: 10px;
    left: 10px;
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .toggle-container {
    gap: 8px;
  }
  
  .toggle-text {
    font-size: 11px;
    min-width: 50px;
  }
  
  .status-indicator {
    font-size: 10px;
    padding: 2px 6px;
  }
}
</style>
