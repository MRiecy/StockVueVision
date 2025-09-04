<template>
  <div v-if="showIndicator" class="mock-data-indicator">
    <div class="indicator-content">
      <div class="indicator-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
        </svg>
      </div>
      <div class="indicator-text">
        <span class="status-text">模拟数据模式</span>
        <span class="status-desc">当前展示的是模拟数据效果</span>
      </div>
      <button @click="hideIndicator" class="close-btn" title="关闭提示">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { USE_MOCK_DATA } from '@/api/mockData.js'

const showIndicator = ref(false)

onMounted(() => {
  // 只有在启用模拟数据模式时才显示指示器
  if (USE_MOCK_DATA) {
    showIndicator.value = true
  }
})

const hideIndicator = () => {
  showIndicator.value = false
}
</script>

<style scoped>
.mock-data-indicator {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  animation: slideIn 0.5s ease-out;
}

.indicator-content {
  background: linear-gradient(135deg, 
    rgba(255, 193, 7, 0.95) 0%, 
    rgba(255, 152, 0, 0.95) 100%);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 8px 32px rgba(255, 193, 7, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.1);
  color: #fff;
  font-size: 14px;
  max-width: 300px;
}

.indicator-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  flex-shrink: 0;
  animation: pulse 2s infinite;
}

.indicator-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.status-text {
  font-weight: 600;
  font-size: 14px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.status-desc {
  font-size: 12px;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 6px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mock-data-indicator {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .indicator-content {
    max-width: none;
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .status-text {
    font-size: 13px;
  }
  
  .status-desc {
    font-size: 11px;
  }
}
</style> 