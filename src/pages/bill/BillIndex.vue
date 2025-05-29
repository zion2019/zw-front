<template>
  <Window>
    <div class="progress-container">
      <!-- STATS -->
      <div class="card stats" >
        <div class="card-content">
          <h2>当月账单～</h2>
          <div class="progress" >
            <BillChart />
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
            <button class="quick-button" style="background-color: #4169E1;" @click="quick('BillStats')">
              <el-text style="color: #fff;font-weight: bold;" >
                <el-icon ><CirclePlus /></el-icon>消费统计
              </el-text>
            </button>

            <button class="quick-button" style="background-color: #E0115F;" @click="quick('BillCategoryList')">
              <el-text style="color: #fff;font-weight: bold;"><el-icon ><CirclePlus /></el-icon>费用类型</el-text>
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
import { ref } from 'vue';
import Window from '../../components/Window.vue'
import { useRouter } from 'vue-router';
import BillChart from '../../components/BillChart.vue'; // 消费统计饼图

const router = useRouter()
const quick = (component) => {
  router.push({ name: component })
}


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
