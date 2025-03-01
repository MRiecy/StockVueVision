<template>
    <div class="strategy-execution-result">
      <el-card class="result-card">
        <template #header>
          <div class="result-header">
            <span>策略执行结果</span>
          </div>
        </template>
        <div class="result-content">
          <el-card class="transaction-curve">
            <template #header>
              <span>交易曲线</span>
            </template>
            <div ref="transactionChart" style="width: 100%; height: 400px;"></div>
          </el-card>
  
          <el-card class="key-metrics">
            <template #header>
              <span>关键指标</span>
            </template>
            <div class="metrics-table">
              <el-table :data="keyMetrics" border style="width: 100%">
                <el-table-column prop="metricName" label="指标名称" />
                <el-table-column prop="metricValue" label="指标值" />
                <el-table-column prop="description" label="描述" />
              </el-table>
            </div>
          </el-card>
  
          <el-button type="primary" @click="downloadReport">查看并下载执行报告</el-button>
        </div>
      </el-card>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import * as echarts from 'echarts';
  import axios from 'axios';
  
  export default {
    name: 'StrategyExecutionResult',
    setup() {
      const transactionChart = ref(null);
      const keyMetrics = ref([]);
  
      const initTransactionChart = () => {
        const chart = echarts.init(transactionChart.value);
        chart.setOption({
          xAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五'],
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: [120, 200, 150, 80, 70],
              type: 'line',
              smooth: true,
            },
          ],
        });
      };
  
      const fetchExecutionResult = async () => {
        try {
          const response = await axios.get('/api/execution-result');
          keyMetrics.value = response.data.keyMetrics;
        } catch (error) {
          console.error('获取策略执行结果失败：', error);
        }
      };
  
      onMounted(() => {
        fetchExecutionResult();
        initTransactionChart();
      });
  
      const downloadReport = () => {
        console.log('下载策略执行报告');
      };
  
      return {
        transactionChart,
        keyMetrics,
        downloadReport,
      };
    },
  };
  </script>
  
  <style scoped>
  .strategy-execution-result {
    padding: 20px;
  }
  
  .result-card {
    margin-bottom: 20px;
  }
  
  .result-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .transaction-curve,
  .key-metrics {
    margin-bottom: 20px;
  }
  
  .el-button {
    align-self: flex-end;
  }
  </style>