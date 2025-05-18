<template>
  <Window :buttons="buttons">
    <List editRoutor="BillTagEdit" @keywordChange="keywordChange">
      <div class="tree-container">
        <el-tree
          ref="treeRef"
          class="filter-tree"
          default-expand-all
          :data="listData"
          :props="defaultProps"
          :filter-node-method="filterNode"
          empty-text="快创建一个账单标签吧"
        >
          <template #default="{ node, data }">
            <span class="z-tree-node">
              <span>{{ node.label }}</span>
              <span v-if="!data.readOnly">
                <a @click="edit(node)">
                  <el-icon><Edit /></el-icon>
                </a>
              </span>
            </span>
          </template>
        </el-tree>
      </div>
    </List>
  </Window>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Window from '../../components/Window.vue';
import List from '../../components/List.vue';
import { ElTree } from 'element-plus';
import { useRouter } from 'vue-router';
import { BillService } from '../../api/api';

const router = useRouter();

const buttons = [
  {
    type: 'warning',
    isPlain: true,
    label: '返回',
    function: () => router.push({ name: 'Bill' })
  },
  {
    type: 'success',
    label: '添加',
    function: toNew
  }
];

function toNew() {
  router.push({ name: 'BillTagEdit', state: { tagId: null } });
}

const treeRef = ref();
const defaultProps = {
  children: 'children',
  label: 'label'
};

const keywordChange = (val) => {
  treeRef.value.filter(val);
};

const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.includes(value);
};

const listData = ref([]);
onMounted(async () => {
  const res = await BillService.tagTree();
  listData.value = res.dataList;
});

const edit = (node) => {
  router.push({ name: 'BillTagEdit', state: { tagId: node.data.id } });
};
</script>
