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
              v-model="bill.categoryDes"
              :fetch-suggestions="queryCategory"
              placeholder="请选择或输入类别"
              @select="handleSelect"
          >
            <template #default="{ item }">
              <span>{{ item.value }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>

        <div class="category-tags">
          <el-tag
              v-for="tag in recentCategories"
              :key="tag.id"
              size="small"
              closable
              @close="removeTag(tag)"
              @click="selectTag(tag)"
          >
            {{ tag.label }}
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
import { BillService } from '@/api/bill_api'

const router = useRouter()

// 表单数据
const bill = ref({
  amount: null,
  categoryDes: '',
  remark: '',
  location: ''
})

// 模拟数据源（用于模糊匹配）
const categoryOptions = [
  { id: '21', value: '餐饮', parentId: '2', type: '支出', color: 'red' },
  { id: '22', value: '交通', parentId: '2', type: '支出', color: 'orange' },
  { id: '23', value: '购物', parentId: '2', type: '支出', color: 'purple' },
  { id: '24', value: '娱乐', parentId: '2', type: '支出', color: 'pink' },
  { id: '11', value: '工资', parentId: '1', type: '收入', color: 'green' },
  { id: '12', value: '兼职', parentId: '1', type: '收入', color: 'lightgreen' }
]

// 模糊搜索函数
const queryCategory = (queryString, cb) => {
  const results = categoryOptions
      .filter(item => item.value.includes(queryString))
      .map(item => ({ value: item.value, id: item.id }))

  cb(results)
}

const handleSelect = (item) => {
  bill.value.categoryDes = item.value
  bill.value.categoryId = item.id
}

// 最近使用的分类标签（完整对象）
const recentCategories = ref([
  { id: '21', label: '餐饮' },
  { id: '22', label: '交通' },
  { id: '23', label: '购物' },
  { id: '24', label: '娱乐' }
])

// 点击标签触发
const selectTag = (tag) => {
  const matched = categoryOptions.find(opt => opt.id === tag.id)
  if (matched) {
    bill.value.categoryDes = matched.value
    bill.value.categoryId = matched.id
  }
}

const save = async () => {
  try {
    await BillService.save({
      amount: bill.value.amount,
      categoryId: bill.value.categoryId,
      remark: bill.value.remark,
      location: bill.value.location
    })
    router.push({ name: 'Bill' })
  } catch (error) {
    console.error('保存失败:', error)
  }
}

// 返回按钮
const buttons = [
  {
    type: 'warning',
    isPlain: true,
    label: '返回',
    function: () => router.push({ name: 'Bill' })
  },
  {
    type: 'danger',
    isPlain: true,
    label: '删除',
    function: () => {}
  },
  {
    type: 'success',
    isPlain: false,
    label: '保存',
    function: save
  }
]
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

