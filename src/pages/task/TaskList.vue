<template>
    <window :buttons="buttons" >
        <div class="topic-tree" >
            <el-tree-select
                check-strictly
                :props="treeProps"
                placeholder="根据主题筛选"
                :data="topicTreeDatas"
                v-model="topicId"
              />
              <el-button :icon="Search" @click="search" type="success" />
        </div>
        <List editRoutor="TaskEdit" :showSearch=false>
            <div class="infinite-list-wrapper" style="overflow: auto">
                <ul
                v-infinite-scroll="load"
                class="list"
                :infinite-scroll-disabled="disabled">
                <li 
                    v-for="task in taskList" :key="task.taskId" 
                    @click="handleTask(task)" class="list-item" :class=task.background>
                        <el-text size="large" tag="i">{{task.title}}</el-text>
                        <el-tag v-if="task.expireTag" :type="task.expireTag.tagType" >{{task.expireTag.tagName}}</el-tag>
                </li>
                </ul>
                <p v-if="loading">Loading...</p>
                <p v-if="noMore">No more</p>
            </div>
        </List>
    </window>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue';
import { ref, computed, onMounted } from 'vue';
import Window from '../../components/Window.vue';
import List from '../../components/List.vue';
import {TaskService,TopicService} from '../../api/api'
import '../../assets/carousel.css'
import { ElMessage } from 'element-plus'

// 路由相关导入
import { useRouter } from 'vue-router';
import {useStore} from 'vuex'
const store = useStore()
const router = useRouter();

// 临时变量
const topicId= ref('');
const todayTask = history.state.todayTask;

// 树组件引用
const treeProps = {
  children: 'children',
  label: 'label',
  value: 'id',
  disabled: false,
};
// 主题树结构
const topicTreeDatas = ref([]);

interface Task {
  title: string;
  taskId: string;
  topicId:string;
  expireTag: {
    tagType:String
    ,tagName:String
  };
  background:string;
}

// 按钮定义
const buttons = [
    {
        'type':'warning'
        ,'isPlain':true
        ,'label':'返回'
        ,'function':()=>{
            router.back();
        }
    },
    {
        'type':'success'
        ,'isPlain':true
        ,'label':'新增'
        ,'function':()=>{
            router.push({name:'TaskEdit'});
        }
    }
]

const taskList = ref<Task[]>([]);
const pageNo = ref(0);
const pageSize = ref(10);
const total = ref<number | null>(1);
const loading = ref(false);
const noMore = ref(false);
const disabled = ref(false);

function init(){
  taskList.value = [];
  pageNo.value = 0;
  pageSize.value = 10;
  total.value = 0;
  loading.value = false;
  noMore.value  = false;
  disabled.value = false;
}

const load = async () => {
  if (loading.value || noMore.value) return;
  loading.value = true;

  try {
    const res = await TaskService.pages({
      pageNo: pageNo.value,
      pageSize:pageSize.value,
      today: todayTask,
      topicId:topicId.value
    }) as any;
    if(res.dataList != null && res.dataList.length > 0){
        taskList.value.push(...res.dataList);
    }
    total.value = res.total;
    pageNo.value++;
    noMore.value = total.value == null || taskList.value.length >= total.value;
    disabled.value = loading.value || noMore.value;
  } catch (error) {
    total.value = 0;
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () =>{
    //  获取主题树供选择
    try {
        const topicRes = await TopicService.tree('') as any;
        topicTreeDatas.value = topicRes.dataList;
    } catch (error) {
        console.error(error);
    } 
    // 加载列表页
    // init();
    load();
})

/** 处理任务 */
function handleTask(task : Task){
  if(todayTask){
    router.push({name:'TaskHandle', state: { taskId: task.taskId }});
  }else{
    router.push({name:'TaskEdit', state: { taskId: task.taskId }});
  }
}

/** 执行搜索 */
function search (){
  init();
  load();
}


</script>

<style scoped>
.topic-tree {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ddd; /* Add a border */
  padding: 10px; /* Add padding for spacing */
  border-radius: 10px;
}
.topic-tree el-input {
  flex-grow: 1;
  margin-right: 10px;
}
.infinite-list-wrapper {
  max-height: 60vh;
  text-align: center;
  border: 1px solid #ddd; /* Add a border */
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
  height: 50px;
  padding-left: 5px;
  padding-right: 5px; 
  color: var(--el-color-danger);
  border: 1px solid #ddd; /* Add a border */
  border-radius: 10px;
}
.infinite-list-wrapper .list-item + .list-item {
  margin-top: 10px;
}
.un-parctise-bubble {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: red;
    color: white;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
}
</style>