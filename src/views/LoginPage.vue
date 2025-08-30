<template>
  <div class="login-container">
    <!-- 背景粒子效果 -->
    <div class="background-particles">
      <div v-for="n in 30" :key="n" class="particle" :style="getParticleStyle()"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card glass-effect">
      <!-- 顶部装饰 -->
      <div class="card-decoration">
        <div class="decoration-line"></div>
        <div class="corner-accent left"></div>
        <div class="corner-accent right"></div>
      </div>

      <!-- Logo区域 -->
      <div class="logo-section">
        <div class="logo-icon">
          <div class="icon-circle">
            <i class="icon-stock"></i>
          </div>
        </div>
        <h1 class="system-title">股票决策可视化系统</h1>
        <p class="system-subtitle">Stock Vision Analytics</p>
      </div>

      <!-- 登录表单 -->
      <div class="form-section">
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
        >
          <!-- 手机号输入 -->
          <el-form-item prop="phone">
            <el-input
              v-model="loginForm.phone"
              placeholder="请输入手机号"
              prefix-icon="Phone"
              class="custom-input"
              size="large"
            />
          </el-form-item>

          <!-- 验证码输入 -->
          <el-form-item prop="code">
            <div class="code-input-group">
              <el-input
                v-model="loginForm.code"
                placeholder="请输入验证码"
                prefix-icon="Key"
                class="custom-input code-input"
                size="large"
              />
              <el-button
                type="primary"
                class="send-code-btn"
                :disabled="countdown > 0"
                @click="sendCode"
              >
                {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
              </el-button>
            </div>
          </el-form-item>

          <!-- 登录按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              class="login-btn"
              size="large"
              :loading="loading"
              @click="handleLogin"
            >
              登录 / 注册
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 底部说明 -->
        <div class="login-footer">
          <p class="footer-text">
            首次使用手机号登录将自动注册账号
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginFormRef = ref()
const loading = ref(false)
const countdown = ref(0)

// 登录表单数据
const loginForm = reactive({
  phone: '',
  code: ''
})

// 表单验证规则
const loginRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ]
}

// 生成粒子样式
const getParticleStyle = () => {
  const size = Math.random() * 3 + 1
  const animationDuration = Math.random() * 20 + 10
  const left = Math.random() * 100
  const animationDelay = Math.random() * 20

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDuration: `${animationDuration}s`,
    animationDelay: `${animationDelay}s`
  }
}

// 发送验证码
const sendCode = async () => {
  try {
    // 验证手机号
    await loginFormRef.value.validateField('phone')

    // TODO: 调用后端API发送验证码
    // await sendVerificationCode(loginForm.phone)

    ElMessage.success('验证码已发送')
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    console.error('发送验证码失败:', error)
  }
}

// 处理登录
const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    loading.value = true

    // TODO: 调用后端API进行登录/注册
    // const result = await login(loginForm)

    // 模拟登录成功
    setTimeout(() => {
      ElMessage.success('登录成功')
      router.push('/display')
    }, 1000)

  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请检查输入信息')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg,
    #0c1426 0%,
    #1a1f3a 25%,
    #16213e 50%,
    #0f1419 75%,
    #000814 100%);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

/* 背景粒子 */
.background-particles {
  position: absolute;
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
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

/* 登录卡片 */
.login-card {
  position: relative;
  width: 420px;
  padding: 40px;
  border-radius: 20px;
  z-index: 10;
  overflow: hidden;
  transform: translateY(-20px);

  /* 增强立体感和发光效果 */
  box-shadow:
    0 0 0 1px rgba(64, 224, 255, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 16px 64px rgba(64, 224, 255, 0.1),
    0 32px 128px rgba(64, 224, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  /* 动态发光边框 */
  border: 1px solid transparent;
  background:
    linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)),
    linear-gradient(45deg, rgba(64, 224, 255, 0.1), rgba(30, 144, 255, 0.1));
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;

  /* 添加动态光晕效果 */
  animation: cardGlow 4s ease-in-out infinite;
}

/* 卡片发光动画 */
@keyframes cardGlow {
  0%, 100% {
    box-shadow:
      0 0 0 1px rgba(64, 224, 255, 0.1),
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 16px 64px rgba(64, 224, 255, 0.1),
      0 32px 128px rgba(64, 224, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  50% {
    box-shadow:
      0 0 0 1px rgba(64, 224, 255, 0.2),
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 16px 64px rgba(64, 224, 255, 0.2),
      0 32px 128px rgba(64, 224, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
}

/* 卡片装饰 */
.card-decoration {
  position: relative;
  height: 3px;
  margin-bottom: 30px;
}

.decoration-line {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(64, 224, 255, 0.6) 20%,
    rgba(64, 224, 255, 1) 50%,
    rgba(64, 224, 255, 0.6) 80%,
    transparent 100%);
  animation: pulse 3s ease-in-out infinite;
}

.corner-accent {
  position: absolute;
  top: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(45deg, #40e0ff, #1e90ff);
  box-shadow: 0 0 10px rgba(64, 224, 255, 0.8);
}

.corner-accent.left { left: 0; }
.corner-accent.right { right: 0; }

/* Logo区域 */
.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo-icon {
  display: inline-block;
  margin-bottom: 20px;
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #40e0ff, #1e90ff);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 0 30px rgba(64, 224, 255, 0.6),
    inset 0 0 20px rgba(255, 255, 255, 0.2);

  /* 优化Logo动画效果 */
  animation: logoAnimation 6s ease-in-out infinite;
  transition: all 0.3s ease;
}

.icon-circle:hover {
  transform: scale(1.1);
  box-shadow:
    0 0 40px rgba(64, 224, 255, 0.8),
    0 0 60px rgba(64, 224, 255, 0.4),
    inset 0 0 20px rgba(255, 255, 255, 0.3);
}

.icon-stock {
  width: 40px;
  height: 40px;
  background: white;
  clip-path: polygon(0% 100%, 25% 0%, 50% 50%, 75% 0%, 100% 100%);
}

/* Logo复合动画 */
@keyframes logoAnimation {
  0%, 100% {
    transform: rotate(0deg) scale(1);
    box-shadow:
      0 0 30px rgba(64, 224, 255, 0.6),
      inset 0 0 20px rgba(255, 255, 255, 0.2);
  }
  25% {
    transform: rotate(90deg) scale(1.05);
    box-shadow:
      0 0 35px rgba(64, 224, 255, 0.7),
      inset 0 0 20px rgba(255, 255, 255, 0.25);
  }
  50% {
    transform: rotate(180deg) scale(1);
    box-shadow:
      0 0 30px rgba(64, 224, 255, 0.6),
      inset 0 0 20px rgba(255, 255, 255, 0.2);
  }
  75% {
    transform: rotate(270deg) scale(1.05);
    box-shadow:
      0 0 35px rgba(64, 224, 255, 0.7),
      inset 0 0 20px rgba(255, 255, 255, 0.25);
  }
}

.system-title {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #40e0ff, #ffffff, #1e90ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(64, 224, 255, 0.5);
}

.system-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  letter-spacing: 2px;
}

/* 表单区域 */
.form-section {
  margin-top: 30px;
}

.login-form {
  margin-bottom: 20px;
}

.custom-input {
  --el-input-bg-color: rgba(255, 255, 255, 0.05);
  --el-input-border-color: rgba(64, 224, 255, 0.3);
  --el-input-hover-border-color: rgba(64, 224, 255, 0.6);
  --el-input-focus-border-color: rgba(64, 224, 255, 0.8);
  --el-input-text-color: white;
  --el-input-placeholder-color: rgba(255, 255, 255, 0.5);
}

/* 美化输入框聚焦状态 */
.custom-input :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(64, 224, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(64, 224, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.custom-input :deep(.el-input__wrapper:hover) {
  border-color: rgba(64, 224, 255, 0.6);
  box-shadow: 0 0 20px rgba(64, 224, 255, 0.2);
  transform: translateY(-1px);
}

.custom-input :deep(.el-input__wrapper.is-focus) {
  border-color: rgba(64, 224, 255, 0.9);
  box-shadow:
    0 0 30px rgba(64, 224, 255, 0.4),
    0 0 60px rgba(64, 224, 255, 0.2),
    inset 0 0 20px rgba(64, 224, 255, 0.1);
  transform: translateY(-2px);

  /* 聚焦时的波纹扩散效果 */
  animation: inputFocus 0.6s ease-out;
}

/* 输入框聚焦动画 */
@keyframes inputFocus {
  0% {
    box-shadow:
      0 0 0 0 rgba(64, 224, 255, 0.7),
      0 0 30px rgba(64, 224, 255, 0.4),
      0 0 60px rgba(64, 224, 255, 0.2),
      inset 0 0 20px rgba(64, 224, 255, 0.1);
  }
  100% {
    box-shadow:
      0 0 0 20px rgba(64, 224, 255, 0),
      0 0 30px rgba(64, 224, 255, 0.4),
      0 0 60px rgba(64, 224, 255, 0.2),
      inset 0 0 20px rgba(64, 224, 255, 0.1);
  }
}

/* 输入框内部文字和图标优化 */
.custom-input :deep(.el-input__inner) {
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
}

.custom-input :deep(.el-input__inner:focus) {
  color: #40e0ff;
  text-shadow: 0 0 10px rgba(64, 224, 255, 0.5);
}

.custom-input :deep(.el-input__prefix) {
  color: rgba(64, 224, 255, 0.8);
  transition: all 0.3s ease;
}

.custom-input :deep(.el-input__wrapper.is-focus .el-input__prefix) {
  color: #40e0ff;
  text-shadow: 0 0 10px rgba(64, 224, 255, 0.8);
}

/* 验证码输入组 */
.code-input-group {
  display: flex;
  gap: 12px;
}

.code-input {
  flex: 1;
}

.send-code-btn {
  background: linear-gradient(135deg, #40e0ff, #1e90ff);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  padding: 0 20px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.send-code-btn:hover {
  background: linear-gradient(135deg, #1e90ff, #40e0ff);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(64, 224, 255, 0.4);
}

.send-code-btn:disabled {
  background: rgba(255, 255, 255, 0.2);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #40e0ff, #1e90ff);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  padding: 15px;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: linear-gradient(135deg, #1e90ff, #40e0ff);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(64, 224, 255, 0.4);
}

.login-btn:active {
  transform: translateY(-1px);
}

/* 底部说明 */
.login-footer {
  text-align: center;
}

.footer-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin: 0;
}

/* 动画 */
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Element Plus 样式覆盖 */
:deep(.el-form-item) {
  margin-bottom: 25px;
}

:deep(.el-form-item__error) {
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 5px;
}
</style>
