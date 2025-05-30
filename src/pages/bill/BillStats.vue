<template>
  <Window :buttons="buttons">
    <div class="stats-container">
      <!-- 基本信息 -->
      <div class="stats-wrapper">
        <el-form-item label="开始:">
          <LCalendar :defaultValue="startDate"  @changeDate="startDateChange"/>
        </el-form-item>
        <el-form-item label="结束:">
          <LCalendar :defaultValue="endDate"  @changeDate="endDateChange"/>
        </el-form-item>
      </div>

      <!-- 饼图 -->
      <div class="pie-container">
        <BillChart
            :start-day="startDate"
            :end-day="endDate"
            @intoCategory="intoCategory"
        />
      </div>

      <!-- 消费明细列表 -->
      <div class="list-container">
        <div class="infinite-list-wrapper" style="overflow: auto">
          <ul v-infinite-scroll="load" class="list" :infinite-scroll-disabled="disabled">
            <li v-for="item in list" :key="item.id">

              <el-popover
                  :width="300"
                  popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
              >
                <template #reference>
                  <div class="list-item" >
                    <div class="card-left">
                      <div class="billTag"><el-tag  :color="item.categoryColor" effect="dark">{{ item.categoryDesc }}</el-tag></div>
                      <div class="billTime" style="color: black">{{ item.billDate }}</div>
                      <div class="categoryDesc">{{ item.billRemark }}</div>
                    </div>
                    <div class="card-right" :style="{ color: item.categoryColor }">
                      ¥{{ item.categoryType === 1 ? '+' : '-' }}{{ item.amount }}
                    </div>
                  </div>
                </template>
                <template #default>

                  <div style="display: flex; gap: 16px; flex-direction: column;">
                    <div style="text-align: center;">
                      <div style="font-size: 16px; font-weight: bold;">{{ item.billDate }}</div>
                      <div style="font-size: 16px; font-weight: bold;">{{ item.categoryDesc }}</div>
                      <div style="color: var(--el-color-info); margin-top: 4px;">{{ item.billRemark }}</div>
                      <div style="color: var(--el-color-info); margin-top: 4px;">{{ item.location }}</div>
                      <div style="font-size: 20px; font-weight: bold; margin-top: 8px;" :style="{ color: item.categoryColor }">
                        ¥{{ item.categoryType === 1 ? '+' : '-' }}{{ item.amount }}
                      </div>
                      <div style="margin-top: 16px;">
                        <el-button type="primary" size="small" @click="toEditBill(item)">编辑账单</el-button>
                      </div>
                    </div>
                  </div>

                </template>
              </el-popover>


            </li>
          </ul>
          <p class="no-more-text" v-if="loading">加载中...</p>
          <p class="no-more-text" v-if="noMore">到底啦~</p>
        </div>
      </div>

    </div>
  </Window>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import Window from '../../components/Window.vue';
  import BillChart from '../../components/BillChart.vue';
  import { BillCategoryService } from '@/api/bill_api';
  import LCalendar from '../../components/LCalendar.vue';

  /**  路由导入 */
  import { useRouter } from 'vue-router';
  import {useStore} from 'vuex'
  import { ElMessage } from 'element-plus'
  const store = useStore()
  const router = useRouter();

  /**
   * 监听输入日期变化
   */
  function startDateChange(inputStartDate) {
    startDate.value = inputStartDate;
    reloadBillDetails();
  }
  function endDateChange(inputEndDate) {
    endDate.value = inputEndDate;
    reloadBillDetails();
  }


  /**
   * 当前查询的分类ID默认全量
   */
  const queryCategoryId = ref(0);
  /**
   * 监听饼图变化
   */
  function intoCategory(categoryId){
    queryCategoryId.value = categoryId;
    reloadBillDetails();
  }

  /**
   * 跳转账单编辑
   * @param bill
   */
  function toEditBill(bill){
    router.push({name:'BillEdit', state: { billId : bill.id}});
  }

  /**
   * 重新加载账单明细
   */
  function reloadBillDetails(){
    list.value = [];
    loading.value = false;
    noMore.value = false;
    load();
  }

  /**
   * 初始化查询日期
   * @param date
   */
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const today = new Date();
  const startDate = ref(formatDate(new Date(today.getFullYear(), today.getMonth(), 1)));
  const endDate = ref(formatDate(new Date(today)));


  /**
   * 列表交互
   */
  const list = ref([]);
  const pageNo = ref(1);
  const pageSize = ref(10);
  const total = ref(0);
  const loading = ref(false);
  const noMore = ref(false);
  const disabled = ref(false);

  const load = async () => {
    if (loading.value || noMore.value) return;
    loading.value = true;

    try {
      const res = await BillCategoryService.billsPage({
        pageNo: pageNo.value,
        pageSize: pageSize.value,
        statsBillSTime: startDate.value,
        statsBillETime: endDate.value,
        parentId: queryCategoryId.value,
      });

      if (res.dataList && res.dataList.length > 0) {
        list.value.push(...res.dataList);
      }

      total.value = res.total;
      pageNo.value++;
      noMore.value = list.value.length >= total.value;
    } catch (e) {
      console.error(e);
      noMore.value = true;
    } finally {
      loading.value = false;
      disabled.value = loading.value || noMore.value;
    }
  };

  /**
   * 导出
   */
  function exportBills(){
    console.log('导出...');
  }

  /**
   * 按钮定义
   */
  const buttons = [
    {
      'type':'success'
      ,'label':'导出'
      ,'function':exportBills
    },
    {
      'type':'warning'
      ,'isPlain':true
      ,'label':'返回'
      ,'function':()=>{router.push({name:'Bill'})}
    },
  ]

</script>

<style scoped>
  .stats-container {
    flex-direction: column;
    justify-content: center;
  }

  .stats-wrapper {
    margin-top: 20px;
    margin-bottom: 10px;
    margin-left: 20px;
    margin-right: 20px;
    max-height: 400px;
    overflow-y: auto;
    border: 2px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    background-color: #f2f2f2;
  }

  .pie-container{
    position: relative; /* 关键点 */
    margin-bottom: 10px;
    margin-left: 20px;
    margin-right: 20px;
    max-height: 400px;
    border: 2px solid #ccc;
    border-radius: 10px;
    background-color: #f2f2f2;
  }

  .list-container{
    position: relative; /* 关键点 */
    margin-left: 20px;
    margin-right: 20px;
    max-height: 500px;
    border: 2px solid #ccc;
    border-radius: 10px;
    background-color: #f2f2f2;
    overflow-y: auto;
  }

  .infinite-list-wrapper {
    max-height: 60vh;
    text-align: center;
    padding: 10px; /* Add padding for spacing */
    border-radius: 10px;
    margin-bottom: 10px;
  }

  .infinite-list-wrapper .list {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .infinite-list-wrapper .list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .infinite-list-wrapper .list-item + .list-item {
    margin-top: 10px;
  }

  .no-more-text {
    font-size: 18px;
    font-weight: bold;
    color: #999;
    margin-top: 10px;
  }

  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    margin: 10px 0;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
  }

  .list-item:hover {
    transform: translateY(-3px);
  }

  .card-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .billTag {
    text-align: left;
  }

  .billTime {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }

  .categoryDesc {
    font-size: 15px;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    text-align: left;
  }

  .card-right {
    font-size: 24px;
    font-weight: bold;
    text-align: right;
    min-width: 100px;
  }

</style>