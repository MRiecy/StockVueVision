<template>
  <div class="strategy-execution">
    <div class="strategy-display-module">
      <div class="title">当前执行策略</div>
      <div class="select-container">
        <el-select v-model="selectedStrategyId" placeholder="璇烽€夋嫨绛栫暐" @change="handleStrategyChange">
          <el-option
            v-for="strategy in strategies"
            :key="strategy.id"
            :label="strategy.name"
            :value="strategy.id"
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
import { ref, onMounted } from 'vue';
// import axios from 'axios';

export default {
  name: 'StrategyExecution',
  setup() {
    const strategies = ref([]);
    const selectedStrategy = ref({
      description: '',
      parameters: []
    });

    const fetchStrategies = async () => {
      try {
        // 娉ㄩ噴鎺変笉瀛樺湪鐨勬帴鍙ｈ姹傦紝閬垮厤404鎶ラ敊
        // const response = await axios.get('/api/strategies/');
        // if (response.data && response.data.strategies && response.data.strategies.length > 0) {
        //   strategies.value = response.data.strategies;
        //   selectedStrategy.value = response.data.strategies[0];
        //   if (!selectedStrategy.value.parameters) {
        //     selectedStrategy.value.parameters = [];
        //   }
        // } else {
        //   console.warn('鑾峰彇鍒扮殑绛栫暐鏁版嵁鏍煎紡涓嶆纭垨涓虹┖锛屼娇鐢ㄩ粯璁ょ瓥鐣ユ暟鎹?);
        //   // 浣跨敤瀹屾暣鐨勯粯璁ょ瓥鐣ユ暟鎹?
        //   strategies.value = defaultStrategies;
        //   selectedStrategy.value = strategies.value[0];
        // }

        // 鐩存帴浣跨敤榛樿绛栫暐鏁版嵁锛岄伩鍏嶆帴鍙ｇ己澶卞鑷寸殑閿欒
        strategies.value = defaultStrategies;
        selectedStrategy.value = strategies.value[0] || { description: '', parameters: [] };
      } catch (error) {
        console.error('鑾峰彇绛栫暐鍒楄〃澶辫触锛?, error);
        console.log('浣跨敤榛樿绛栫暐鏁版嵁');
        strategies.value = defaultStrategies;
        selectedStrategy.value = strategies.value[0] || { description: '', parameters: [] };
      }
    };

    const defaultStrategies = [
      {
        id: 1,
        name: '閲忓寲閫夎偂绛栫暐',
        description: '鍩轰簬PE銆丳B绛夊熀鏈潰鎸囨爣鐨勪环鍊兼姇璧勭瓥鐣ワ紝涓撴敞浜庡鎵捐浣庝及鐨勪紭璐ㄨ偂绁?,
        parameters: [
          { paramKey: '鑲＄エ鏁伴噺', paramValue: '10', description: '鏈€缁堟寔鏈夌殑鑲＄エ鏁伴噺' },
          { paramKey: '閫夎偂鑼冨洿', paramValue: '娌繁A鑲?, description: '鍙€夎偂绁ㄧ殑甯傚満鑼冨洿' },
          { paramKey: '鏈€澶т粨浣?, paramValue: '80%', description: '鍏ㄩ儴鑲＄エ鐨勬€绘寔浠撲笂闄? },
          { paramKey: '涓偂浠撲綅', paramValue: '10%', description: '鍗曞彧鑲＄エ鏈€澶ф寔浠撴瘮渚? }
        ]
      },
      {
        id: 2,
        name: 'ETF绛栫暐',
        description: '鍩轰簬浠锋牸鍜屾垚浜ら噺鐨勬妧鏈垎鏋愮瓥鐣ワ紝鎹曟崏甯傚満鐭湡瓒嬪娍',
        parameters: [
          { paramKey: '鑲＄エ鏁伴噺', paramValue: '10', description: '鏈€缁堟寔鏈夌殑鑲＄エ鏁伴噺' },
          { paramKey: '閫夎偂鑼冨洿', paramValue: '娌繁A鑲?, description: '鍙€夎偂绁ㄧ殑甯傚満鑼冨洿' },
          { paramKey: '鏈€澶т粨浣?, paramValue: '80%', description: '鍏ㄩ儴鑲＄エ鐨勬€绘寔浠撲笂闄? },
          { paramKey: '涓偂浠撲綅', paramValue: '10%', description: '鍗曞彧鑲＄エ鏈€澶ф寔浠撴瘮渚? }
        ]
      },
      {
        id: 3,
        name: '鐏垫椿瀵瑰啿绛栫暐',
        description: '鍩轰簬鑲′环鍋忕鍧囧€肩殑缁熻濂楀埄绛栫暐锛岄€傚悎闇囪崱甯傚満',
        parameters: [
          { paramKey: '鑲＄エ鏁伴噺', paramValue: '10', description: '鏈€缁堟寔鏈夌殑鑲＄エ鏁伴噺' },
          { paramKey: '閫夎偂鑼冨洿', paramValue: '娌繁A鑲?, description: '鍙€夎偂绁ㄧ殑甯傚満鑼冨洿' },
          { paramKey: '鏈€澶т粨浣?, paramValue: '80%', description: '鍏ㄩ儴鑲＄エ鐨勬€绘寔浠撲笂闄? },
          { paramKey: '涓偂浠撲綅', paramValue: '10%', description: '鍗曞彧鑲＄エ鏈€澶ф寔浠撴瘮渚? }
        ]
      }
    ];

    onMounted(fetchStrategies);

    const handleStrategyChange = () => {
      console.log('褰撳墠閫変腑绛栫暐锛?, selectedStrategy.value);
      if (selectedStrategy.value && !selectedStrategy.value.parameters) {
        selectedStrategy.value.parameters = [];
      }
    };

    return {
      strategies,
      selectedStrategy,
      handleStrategyChange,
    };
  },
};
</script>

<style scoped>
.strategy-execution {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 6px;
  box-sizing: border-box;
  /* overflow: hidden; */
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
  backdrop-filter: blur(10px);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(64, 224, 255, 0.1);
  /* overflow: hidden; */
}

.title {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 6px;
  color: #000000;
  text-shadow: 0 0 8px rgba(64, 224, 255, 0.6);
  flex-shrink: 0;
}

.select-container {
  margin-bottom: 6px;
  flex-shrink: 0;
}

.strategy-description {
  margin-top: 6px;
  margin-bottom: 8px;
  padding: 8px;
  background: rgba(64, 224, 255, 0.1);
  border: 1px solid rgba(64, 224, 255, 0.2);
  border-radius: 6px;
  font-size: 10px;
  color: #000000;
  backdrop-filter: blur(5px);
  line-height: 1.3;
}

.strategy-parameters {
  margin-top: 6px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.strategy-parameters .title {
  margin-bottom: 6px;
}

.el-select {
  width: 100%;
}

/* Element UI缁勪欢娣辫壊涓婚閫傞厤 */
:deep(.el-select .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(64, 224, 255, 0.3) !important;
  border-radius: 4px;
}

:deep(.el-select .el-input__wrapper:hover) {
  border-color: rgba(64, 224, 255, 0.5) !important;
}

:deep(.el-select .el-input__wrapper.is-focus) {
  border-color: rgba(64, 224, 255, 0.6) !important;
  box-shadow: 0 0 10px rgba(64, 224, 255, 0.3) !important;
}

:deep(.el-input__inner) {
  color: #000000 !important;
  background: transparent !important;
  font-size: 11px;
  padding: 3px 8px;
  height: 28px !important;
  line-height: 28px !important;
}

:deep(.el-input__inner::placeholder) {
  color: rgba(0, 0, 0, 0.6) !important;
}

:deep(.el-input) {
  height: 28px !important;
}

:deep(.el-input__wrapper) {
  height: 28px !important;
  padding: 0 8px !important;
}

:deep(.el-table) {
  background: transparent !important;
  color: #000000 !important;
  font-size: 10px;
  border: none !important;
}

:deep(.el-table .el-table__header-wrapper) {
  background: transparent !important;
}

:deep(.el-table .el-table__body-wrapper) {
  background: transparent !important;
  max-height: none !important;
}

:deep(.el-table th.el-table__cell) {
  background: rgba(64, 224, 255, 0.2) !important;
  color: #000000 !important;
  border-bottom: 1px solid rgba(64, 224, 255, 0.3) !important;
  padding: 2px 6px !important;
  font-size: 10px;
  font-weight: bold !important;
  height: 28px !important;
}

:deep(.el-table td.el-table__cell) {
  background: transparent !important;
  color: #000000 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding: 2px 6px !important;
  font-size: 10px;
  line-height: 1.2;
  height: 26px !important;
}

:deep(.el-table tr:hover td) {
  background: rgba(64, 224, 255, 0.1) !important;
}

:deep(.el-table .cell) {
  padding: 0 !important;
  line-height: 1.2 !important;
}

/* 涓嬫媺閫夐」鏍峰紡 */
:deep(.el-select-dropdown) {
  background: rgba(26, 31, 58, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(64, 224, 255, 0.3) !important;
}

:deep(.el-select-dropdown .el-option) {
  color: #000000 !important;
  background: transparent !important;
}

:deep(.el-select-dropdown .el-option:hover) {
  background: rgba(64, 224, 255, 0.2) !important;
}

:deep(.el-select-dropdown .el-option.is-selected) {
  background: rgba(64, 224, 255, 0.3) !important;
  color: #000000 !important;
}
</style>
