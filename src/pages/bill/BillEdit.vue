<template>
  <Window :buttons="buttons">
    <div class="edit-container">
      <div class="card-wrapper">
        <el-form-item label="多钱儿？" >
          <el-input-number v-model="bill.amount" :precision="2" :min="0" :max="999999999.99" />
        </el-form-item>
      </div>


      <div class="card-wrapper">
        <el-form-item label="啥项目？">
          <el-autocomplete
              v-model="bill.categoryDesc"
              :fetch-suggestions="queryCategory"
              placeholder="请选择或输入类别"
              @select="handleSelect"
          >
            <template #default="{ item }">
              <span>{{ item.title }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>

        <div class="category-tags">
          <el-tag
              v-for="category in recentCategories"
              :key="category.id"
              size="small"
              @click="selectCategory(category)"
          >
            {{ category.title }}
          </el-tag>
        </div>
      </div>

      <div class="card-wrapper">
        <el-input v-model="bill.remark" type="textarea" :rows="4" placeholder="怎么造的这么老些钱?" />
      </div>

      <div class="card-wrapper">
        <el-input v-model="bill.location" placeholder="请输入地理位置" />
      </div>

    </div>
  </Window>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Window from '../../components/Window.vue'
import { useRouter } from 'vue-router'
import { BillService,BillCategoryService } from '@/api/bill_api'
import {ElMessage} from "element-plus";

  const router = useRouter()

  /** vuex中获取 billId */
  const billId = history.state.billId;
  const buttons = [
    {
      type: 'warning',
      isPlain: true,
      label: '返回',
      function: () => router.push({ name: 'Bill' })
    }
  ]
  if(billId){
    buttons.push({
      type: 'danger',
      isPlain: true,
      label: '删除',
      function: () => {}
    });
    buttons.push({
      type: 'success',
      isPlain: false,
      label: '更新',
      function: save
    });

  }else{
    buttons.push({
      type: 'success',
      isPlain: false,
      label: '保存',
      function: save
    });
  }


  // 表单数据
  const bill = ref({
    id:'',
    amount: null,
    categoryId: '',
    categoryDesc: '',
    remark: '',
    location: ''
  })


  onMounted(async () => {
    // 回显信息加载
    if (billId) {
      BillService.billInfo(billId).then((res)=>{
        bill.id  = res.data.id;
        bill.value.amount = res.data.amount;
        bill.value.categoryId = res.data.categoryId;
        bill.value.categoryDesc = res.data.categoryDesc;
        bill.value.remark = res.data.billRemark;
        bill.value.location = res.data.location;

      }).catch(err=>{
        console.log(err);
        ElMessage.error(err);
      })
    }

    // 查询最近使用最多的分类标签
    BillService.recentlyCategories().then((res)=>{
      recentCategories.value = res.dataList;
    }).catch(err=>{
      ElMessage.error(err);
    })

  });

  // 模糊搜索函数
  const queryCategory = (queryString, cb) => {
    BillCategoryService.list({"title":queryString}).then((res)=>{
      cb(res.dataList)
    }).catch(err=>{
      ElMessage.error(err);
    })
  }

  const handleSelect = (item) => {
    bill.value.categoryDesc = item.title
    bill.value.categoryId = item.id
  }

  // 初始化最近使用的分类标签（完整对象）
  const recentCategories = ref([]);

  // 选择一个最近使用的标签
  const selectCategory = (category) => {
    const matched = recentCategories.find(opt => opt.id === category.id)
    if (matched) {
      bill.value.categoryDesc = matched.title
      bill.value.categoryId = matched.id
    }
  }



  /**
   * 保存分类
   */
  function save() {
    try {
      BillService.saveBill({
        id:billId,
        amount: bill.value.amount,
        categoryId: bill.value.categoryId,
        remark: bill.value.remark,
        location: bill.value.location
      }).then((res) => {
        if(res.status === 200){
          ElMessage.success('下次少花点');
          router.push({ name: 'Bill' })
        }else{
          ElMessage.error(res.message);
        }
      })

    } catch (error) {
      console.error('保存失败:', error)
    }
  }

</script>

<style scoped>
.edit-container {
  padding: 20px;
}

.card-wrapper {
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


.category-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}
</style>

