<template>
  <Window :buttons="buttons">
    <div class="edit-container">
      <div class="edit-form">
        <el-form ref="form" :model="bill" :rules="rules">
          <div class="form-wrapper">
            <el-form-item prop="label">
              <el-input v-model="bill.label" placeholder="备注（如：麦当劳午餐）" />
            </el-form-item>
            <el-form-item prop="amount">
              <el-input-number v-model="bill.amount" :precision="2" placeholder="金额" />
            </el-form-item>
            <el-form-item prop="tagId">
              <el-tree-select check-strictly :props="treeProps" placeholder="选择标签" :data="tagTreeData"
                v-model="bill.tagId" />
            </el-form-item>
            <el-form-item prop="type">
              <el-select v-model="bill.type" placeholder="类型">
                <el-option label="收入" value="收入" />
                <el-option label="支出" value="支出" />
              </el-select>
            </el-form-item>
            <el-form-item prop="location">
              <el-input v-model="bill.location" placeholder="地理位置（可选）" disabled />
              <el-button @click="getLocation">获取位置</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </Window>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Window from '../../components/Window.vue';
import { useRouter } from 'vue-router';
import { BillService } from '../../api/api';

const router = useRouter();
const form = ref(null);
const buttons = [
  {
    type: 'warning',
    isPlain: true,
    label: '返回',
    function: () => router.push({ name: 'Bill' })
  },
  {
    type: 'success',
    isPlain: false,
    label: '保存',
    function: save
  }
];

function save() {
  let { validate } = form.value;
  validate((valid) => {
    if (valid) {
      console.log('保存账单:', bill.value);
      BillService.saveTag(bill.value).then(() => {
        router.push({ name: 'Bill' });
      });
    }
  });
}

const getLocation = () => {
  // TODO 地图逻辑留空
  ElMessage.info('地图功能暂未实现');
};

const bill = ref({
  label: '',
  amount: 0,
  tagId: '',
  type: '',
  location: ''
});

const treeProps = {
  children: 'children',
  label: 'label',
  value: 'id'
};

const tagTreeData = ref([]);
onMounted(async () => {
  const res = await BillService.tagTree();
  tagTreeData.value = res.dataList;
});

const rules = {
  label: [{ required: true, message: '请输入备注' }],
  amount: [{ required: true, message: '请输入金额' }],
  tagId: [{ required: true, message: '请选择标签' }],
  type: [{ required: true, message: '请选择类型' }]
};
</script>
