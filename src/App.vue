<template>
  <div class="app">
    <MenuBar />
    <router-view />
    <!-- 模拟数据状态指示器 -->
    <MockDataIndicator />
    <!-- 动态背景粒子效果 -->
    <div class="background-particles">
      <div v-for="n in 50" :key="n" class="particle" :style="getParticleStyle(n)"></div>
    </div>
  </div>
</template>

<script setup>
import MenuBar from '@/components/layout/MenuBar.vue';
import MockDataIndicator from '@/components/layout/MockDataIndicator.vue';

// 生成随机粒子样式
const getParticleStyle = () => {
  const size = Math.random() * 3 + 1;
  const animationDuration = Math.random() * 20 + 10;
  const left = Math.random() * 100;
  const animationDelay = Math.random() * 20;
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDuration: `${animationDuration}s`,
    animationDelay: `${animationDelay}s`
  };
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Microsoft YaHei', 'Arial', sans-serif;
  overflow: hidden;
}

.app {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, 
    #0c1426 0%, 
    #1a1f3a 25%, 
    #16213e 50%, 
    #0f1419 75%, 
    #000814 100%);
  overflow: hidden;
}

/* 动态背景粒子效果 */
.background-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  background: rgba(64, 224, 255, 0.6);
  border-radius: 50%;
  animation: float linear infinite;
  box-shadow: 0 0 10px rgba(64, 224, 255, 0.8);
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

/* 全局滚动条美化 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #40e0ff, #1e90ff);
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(64, 224, 255, 0.5);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #1e90ff, #40e0ff);
}

/* 全局文字阴影效果 */
.text-glow {
  text-shadow: 0 0 10px rgba(64, 224, 255, 0.8);
}

/* 全局发光边框效果 */
.border-glow {
  border: 1px solid rgba(64, 224, 255, 0.3);
  box-shadow: 
    0 0 10px rgba(64, 224, 255, 0.2),
    inset 0 0 10px rgba(64, 224, 255, 0.1);
}

/* 全局玻璃态效果 */
.glass-effect {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 全局过渡动画 */
* {
  transition: all 0.3s ease;
}
</style>
