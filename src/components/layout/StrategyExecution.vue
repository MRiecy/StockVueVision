<template>
  <div class="strategy-execution">
    <div class="strategy-display-module">
      <div class="title">当前执行策略</div>
      <div class="select-container">
        <el-select v-model="selectedStrategyId" placeholder="请选择策略" @change="handleStrategyChange">
          <el-option
            v-for="s in strategies"
            :key="s.id"
            :label="s.name"
            :value="s.id"
          />
        </el-select>
      </div>

      <div class="strategy-description">
        <div class="title">策略简介</div>
        <div>{{ selectedStrategy.description }}</div>
      </div>

      <div class="strategy-parameters">
        <div class="title">策略参数设置</div>
        <el-table :data="selectedStrategy.parameters || []" style="width: 100%">
          <el-table-column prop="paramKey" label="参数名称"></el-table-column>
          <el-table-column prop="paramValue" label="参数值"></el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'StrategyExecution',
  setup() {
    const strategies = ref([])
    const selectedStrategyId = ref(null)

    const selectedStrategy = computed(() => {
      return strategies.value.find(s => s.id === selectedStrategyId.value) || { description: '', parameters: [] }
    })

    const defaultStrategies = [
      {
        id: 1,
        name: '量化选股策略',
        description: '基于基本面指标的价值策略示例',
        parameters: [
          { paramKey: '股票数量', paramValue: '10', description: '最终持有的股票数量' },
          { paramKey: '选股范围', paramValue: '沪深A股', description: '可选股票的市场范围' },
          { paramKey: '最大仓位', paramValue: '80%', description: '全部股票的总持仓上限' },
          { paramKey: '个股仓位', paramValue: '10%', description: '单只股票最大持仓比例' }
        ]
      },
      {
        id: 2,
        name: 'ETF策略',
        description: '基于趋势的ETF策略示例',
        parameters: [
          { paramKey: 'ETF品种', paramValue: '多只', description: '参与的ETF品种' },
          { paramKey: '最大仓位', paramValue: '80%', description: '全部ETF的总持仓上限' }
        ]
      },
      {
        id: 3,
        name: '灵活对冲策略',
        description: '统计套利思路的对冲策略示例',
        parameters: [
          { paramKey: '对冲比例', paramValue: '50%', description: '多空头寸比例' }
        ]
      }
    ]

    const fetchStrategies = async () => {
      strategies.value = defaultStrategies
      selectedStrategyId.value = strategies.value[0]?.id ?? null
    }

    onMounted(fetchStrategies)

    const handleStrategyChange = () => {
      if (!Array.isArray(selectedStrategy.value.parameters)) {
        selectedStrategy.value.parameters = []
      }
    }

    return {
      strategies,
      selectedStrategyId,
      selectedStrategy,
      handleStrategyChange
    }
  }
}
</script>

<style scoped>
.strategy-execution {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 6px;
  box-sizing: border-box;
}

.strategy-display-module {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: 1px solid rgba(64, 224, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
}

.title {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 6px;
  color: #000;
}

.select-container { margin-bottom: 6px; }
.strategy-description { margin: 6px 0 8px; padding: 8px; background: rgba(64,224,255,0.1); border: 1px solid rgba(64,224,255,0.2); border-radius: 6px; font-size: 10px; color: #000; }
.strategy-parameters { margin-top: 6px; flex: 1; display: flex; flex-direction: column; }
</style>
