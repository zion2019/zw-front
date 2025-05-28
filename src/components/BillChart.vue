<template>
  <div class="chart-container">
    <div class="chart" ref="chartRef"></div>
    <div v-if="billCategoryPId !== '0'" class="back-button" @click="goBack">
      <el-button  type="warning" :icon="Back" circle />
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue';
  import * as echarts from 'echarts';
  import { BillCategoryService } from '@/api/bill_api';
  import { Back } from '@element-plus/icons-vue';

  const props = defineProps({
    startDay: {
      type: String,
      required: true
    },
    endDay: {
      type: String,
      required: true
    }
  });
  const  emit  = defineEmits(["intoCategory"]);

  const goBack = () => {
    if (billCategoryPId.value !== '0') {
      billCategoryPId.value = '0';
      disposeChart();
      initChart();
      emit('intoCategory', '0');
    }
  };

  const chartRef = ref(null);
  let chart = null;
  const billCategoryPId = ref("0");

  const getChartData = async () => {
    try {
      // 调用接口获取统计数据（这里使用mock数据）
      const response = await BillCategoryService.list({
        statsBillSTime: props.startDay,
        statsBillETime: props.endDay,
        parentId: billCategoryPId.value,
        stats:true
      });

      // 检查接口返回的数据是否有效
      if (!response || !response.dataList || !Array.isArray(response.dataList)) {
        console.warn("接口返回数据无效或为空");
        return [];
      }

      // 将接口返回的数据转换为图表所需的格式
      const chartData = response.dataList.map((item) => ({
        name: item.title, // 分类名称
        value: parseFloat(item.billAmount), // 账单金额，确保转换为数字
        color: item.color,
        categoryId: item.id.toString(), // 分类ID，确保为字符串
        categoryType: item.categoryType // 分类ID，确保为字符串
      }));

      return chartData;
    } catch (error) {
      console.error("获取图表数据失败:", error);
      return [];
    }
  };

  // 初始化图表
  const initChart = async () => {
    if (!chartRef.value) return;

    // 获取数据
    const pieData = await getChartData();
    const totalAmount = pieData.reduce((sum, item) => {
      const amount = parseFloat(item.value);
      if (item.categoryType === 1) {
        return sum + amount;
      } else {
        return sum - amount;
      }
    }, 0);

    // 创建图表
    chart = echarts.init(chartRef.value);

    // 设置图表选项
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { show: false },
      graphic: { // 添加自定义文本
        elements: [{
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: totalAmount > 0?`+${totalAmount.toFixed(2)}`:`${totalAmount.toFixed(2)}`,
            textAlign: 'center',
            fontSize: 16,
            fontFamily: '"Luckiest Guy", cursive',
            fill: totalAmount > 0 ? '#EE2222' : '#22AA22'
          }
        }]
      },
      series: [{
        name: '占比',
        type: 'pie',
        radius: ['40%', '70%'], // 内外半径，留出中心空间
        avoidLabelOverlap: true,
        label: { show: true },
        emphasis: {
          label: { show: true, fontSize: '18', fontWeight: 'bold' },
          labelLine: { show: true }
        },
        data: pieData,
        color: pieData.map((item) => item.color),
      }]
    });

    chart.on('click', (params) => {
      // 重新初始化图标
      billCategoryPId.value = params.data.categoryId;
      disposeChart();
      initChart();
      // 通知父组件
      emit('intoCategory',billCategoryPId.value);
    });

    // 自适应窗口大小
    window.addEventListener('resize', () => {
      chart.resize();
    });
  };

  // 清除图表
  const disposeChart = () => {
    if (chart) {
      chart.dispose();
      chart = null;
    }
  };

  // 监听属性变化并重新加载数据
  watch(() => [props.startDay, props.endDay], async () => {
    disposeChart();
    await initChart();
  }, { deep: true });

  // 组件挂载时初始化图表
  onMounted(() => {
    initChart();
  });
</script>

<style scoped>@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap');
.chart-container {
  height: 200px;
  width: 100%;
  position: relative;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 9;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.9);
}
</style>
