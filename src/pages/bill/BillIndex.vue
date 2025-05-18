<template>
  <Window>
    <div class="progress-container">
      <!-- STATS -->
      <div class="card stats" >
        <div class="card-content">
          <h2>当月账单～</h2>
          <div class="progress" >
            <div class="chart" ref="chartRef"></div>
          </div>
        </div>
      </div>
      <!-- STATS END -->

      <div class="card manager">
        <div class="card-content">
          <h2>快速入口～</h2>
          <div class="quick-option">
            <button class="quick-button" style="background-color: rgb(135 63 90);" @click="quick('BillEdit')">
              <el-text style="color: #fff;font-weight: bold;"><el-icon ><CirclePlus /></el-icon>记一笔</el-text>
            </button>
            <button class="quick-button" style="background-color: #E0115F;" @click="quick('PointEdit')">
              <el-text style="color: #fff;font-weight: bold;"><el-icon ><CirclePlus /></el-icon>费用标签</el-text>
            </button>
            <button class="quick-button" style="background-color: #4169E1;">
              <el-text style="color: #fff;font-weight: bold;"><el-icon ><CirclePlus /></el-icon>待OTA...</el-text>
            </button>
            <button class="quick-button" style="background-color: #FFD700;" >
              <el-text style="font-weight: bold;"><el-icon ><CirclePlus /></el-icon>待OTA...</el-text>
            </button>
          </div>
        </div>
      </div>

    </div>
  </Window>

</template>

<script setup>
import { onMounted,ref } from 'vue';
import Window from '../../components/Window.vue'
import { useRouter } from 'vue-router';
import {PracticeService,TaskService} from '../../api/api';
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const router = useRouter()
const quick = (component) => {
  router.push({ name: component })
}

const dateRange = ref([new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()])
const chartRef = ref(null)

onMounted(() => {
  const chart = echarts.init(chartRef.value)
  const pieData = [
    { name: '餐饮', value: 1200, itemStyle: { color: '#5470C6' } },
    { name: '交通', value: 800, itemStyle: { color: '#91CC75' } },
    { name: '购物', value: 3000, itemStyle: { color: '#FAC858' } },
    { name: '娱乐', value: 600, itemStyle: { color: '#EE6666' } },
    { name: '其他', value: 400, itemStyle: { color: '#73C0DE' } }
  ]

  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { show:false },
    series: [{
      name: '金额占比',
      type: 'pie',
      // radius: ['40%', '70%'],
      avoidLabelOverlap: true,
      label: { show: true },
      emphasis: {
        label: { show: true, fontSize: '18', fontWeight: 'bold' },
        labelLine: { show: true }
      },
      data: pieData
    }]
  })

  window.addEventListener('resize', () => {
    chart.resize()
  })
})

</script>


<style scoped>
.quick-option {
  display: flex;
  flex-direction: column;
}
.quick-button {
  display: inline-block;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  margin-top: 5px;
  border: none;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.quick-button:hover {
  background-color: #ff9900;
  transform: scale(1.05);
}

.progress {
  height: 30%;
}

.progress-container {
  position: absolute;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;     /* 垂直居中 */
  display: flex;
}
.card {
  border-radius: 20px;
  justify-content: center;
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  margin-right: 2%;
  overflow: hidden;
  width: 40%;
  height: 80%;
}

.card.stats {
  background: url("../../assets/imgs/shopping.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: rgba(255, 255, 255, 0.4); /* 白色半透明层，可改颜色或透明度 */
}

.card.stats::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.2); /* 白色半透明层，可改颜色或透明度 */
  z-index: 1;
  pointer-events: none;
}

.card.manager {
  background: url("../../assets/imgs/Flying.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 20px;
  z-index: 2;
}

.card-content h2 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #00040c;
  mix-blend-mode: difference;
}

.card-content p {
  font-size: 14px;
  color: #555;
}

@media (max-width: 768px) {
  .progress-container {
    flex-direction: column; /* 纵向排列 */
    justify-content: unset;
    height: max-content;
  }
  .card {
    margin-top: 10%;
    width: 80%;
    height: 40%;
  }
  .card.manager {
    margin-bottom: 10%;
  }
}
.grid-content img {
  width: 10%;
  height: 90%;
}


/* 图表样式 */
.chart {
  height: 200px;
  width: 100%;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
