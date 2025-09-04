# 后端API接口需求文档

## 问题描述
前端图表组件已移除模拟数据，现在需要后端提供真实的API接口来获取图表数据。

## 缺失的API接口

### 1. 策略图表数据接口
**接口地址**: \GET /api/strategy-chart/\
**用途**: 为策略执行结果图表提供数据
**返回数据格式**:
\\\json
{
  "legend": ["基准收益", "策略收益", "超额收益"],
  "xAxis": ["01-01", "01-02", "01-03", "01-04", "01-05"],
  "yAxisName": "收益走势(%)",
  "series": [
    {
      "name": "基准收益",
      "type": "line",
      "data": [10, 15, 20, 18, 25],
      "smooth": true,
      "itemStyle": { "color": "#00a2ae" }
    },
    {
      "name": "策略收益", 
      "type": "line",
      "data": [12, 18, 25, 22, 30],
      "smooth": true,
      "itemStyle": { "color": "#ff7c57" }
    },
    {
      "name": "超额收益",
      "type": "line", 
      "data": [2, 3, 5, 4, 5],
      "smooth": true,
      "itemStyle": { "color": "#00e191" }
    }
  ]
}
\\\

### 2. 策略执行结果接口
**接口地址**: \GET /api/execution-result/\
**用途**: 为策略执行结果页面提供关键指标数据
**返回数据格式**:
\\\json
{
  "keyMetrics": [
    {
      "metricName": "总收益率",
      "metricValue": "+8.2%",
      "description": "当前策略累计收益率"
    },
    {
      "metricName": "年化收益率", 
      "metricValue": "+12.5%",
      "description": "年化投资回报率"
    },
    {
      "metricName": "最大回撤",
      "metricValue": "-3.8%", 
      "description": "历史最大回撤幅度"
    },
    {
      "metricName": "夏普比率",
      "metricValue": "1.85",
      "description": "风险调整后收益指标"
    },
    {
      "metricName": "胜率",
      "metricValue": "68.5%",
      "description": "盈利交易占比"
    },
    {
      "metricName": "交易次数",
      "metricValue": "127",
      "description": "累计执行交易次数"
    }
  ]
}
\\\

### 3. 系统健康检查接口
**接口地址**: \GET /api/health/\
**用途**: 检查后端服务状态
**返回数据格式**:
\\\json
{
  "status": "ok",
  "timestamp": "2025-01-04T12:00:00Z",
  "version": "1.0.0"
}
\\\

## 其他可选接口

### 4. 资产分布图表接口
**接口地址**: \GET /api/asset-distribution/\
**用途**: 资产分布饼图数据

### 5. 收益走势图表接口  
**接口地址**: \GET /api/return-trend/\
**用途**: 收益走势线图数据

### 6. 风险分析图表接口
**接口地址**: \GET /api/risk-analysis/\
**用途**: 风险分析图表数据

### 7. 交易记录图表接口
**接口地址**: \GET /api/transaction-chart/\
**用途**: 交易记录图表数据

## 实现建议

### 优先级
1. **高优先级**: \/api/strategy-chart/\ 和 \/api/execution-result/\ - 这两个接口是必需的
2. **中优先级**: \/api/health/\ - 用于系统状态检查
3. **低优先级**: 其他可选接口

### 数据来源
- 从国金平台获取真实数据
- 确保数据格式符合前端图表组件的要求
- 添加适当的错误处理和异常情况处理

### 注意事项
- 确保API响应时间在合理范围内（建议<3秒）
- 添加适当的缓存机制
- 考虑数据更新频率
- 确保数据安全性和权限控制

## 测试方法
1. 启动后端服务
2. 访问前端页面
3. 检查浏览器控制台是否还有404错误
4. 验证图表是否正确显示真实数据
