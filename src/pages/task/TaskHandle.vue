<template>
    <Window>
        <div class="practice-container">
            <!-- 基本信息 -->
            <div class="form-wrapper">
                <div class="from-label">基本信息:</div>
                <el-form-item label="题目内容:">
                    <el-text tag="b">{{task.title}}</el-text>
                </el-form-item>
                <el-form-item label="所属主题:">
                    <el-text tag="i">{{task.topicFulTitle}}</el-text>
                </el-form-item>
                <el-form-item label="开始时间:">
                    <el-tag class="ml-2" type="success">{{task.startTime}}</el-tag>
                </el-form-item>
                <el-form-item label="结束时间:">
                    <el-tag class="ml-2" type="success">{{task.endTime}}</el-tag>
                </el-form-item>
            </div>

            <!-- 文本区域 -->
            <div class="solution-container">
                <div class="solution">
                    <div v-html="task.content" class="preview-content"></div>
                </div>
                
            </div>

            <!-- 操作区域 -->
            <div class="buttons" v-if="showButton">
                <el-button type="info"  @click="goback()">返回</el-button>
                <el-button type="danger" v-if="showSkeleton" @click="delay()">推迟</el-button>
                <el-button type="success" v-if="showSkeleton" @click="finish()">完成</el-button>
                <el-button type="warning" v-if="!showSkeleton" @click="loadNextPoint">Next</el-button>
            </div>
        </div>
    </Window>
</template>

<script lang="ts" setup>
import Window from '../../components/Window.vue';
import { ref, onMounted } from 'vue';
import {TaskService} from '../../api/api'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router';
import {useStore} from 'vuex'
const router = useRouter();
const store = useStore()

// 知识点结构
const task = ref({
    id:"",
    title:"",
    content:"",
    topicId:"",
    startTime: '',
    endTime: '',
    routine: false,
    routineCron:"",
    topicFulTitle:""
});

/** vux获取参数 */
const taskId = history.state.taskId;


// 骨架屏是否展示
const showSkeleton = ref(true);
const showButton = ref(true);

/** 主题下题目加载 */
const loadNextPoint = async () =>{
    try {
        // 回显信息加载
        if (taskId) {
            const taskRes = await TaskService.info(taskId) as any;
            if(taskRes.data){
                task.value = taskRes.data;
            }
        }
      
    } catch (error) {
        console.error(error);
        lazyDirectList();
    } finally {
        showSkeleton.value = true;
    }
}
function lazyDirectList(){
    showButton.value = false;
    ElMessage.success('当前主题下已无复习题目，正在跳转至列表页～');
    setTimeout(() => {
        router.push({name:'PracticeList'});
    }, 2000);
}

onMounted(loadNextPoint);

/** 返回 */
function goback(){
    router.back();
}

function delay(){
    TaskService.delay(taskId).then((res : any)=>{
        ElMessage.success('任务已延期！');
        setTimeout(() => {router.back() }, 2000);
    }).catch(err=>{
        ElMessage.error('延期任务出错');
        setTimeout(() => {router.back() }, 2000);
    })

}

function finish(){
    TaskService.finish(taskId).then((res : any)=>{
        ElMessage.success('完成任务');
        setTimeout(() => {router.back() }, 2000);
    }).catch(err=>{
        ElMessage.error('完成任务出错');
        setTimeout(() => {router.back() }, 2000);
    })
}

</script>

<style scoped>
    .practice-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .form-wrapper {
        margin-bottom: 20px;
        margin: 20px;
        max-height: 400px;
        overflow-y: auto;
        border: 2px solid #ccc;
        border-radius: 10px;
        padding: 20px;
        background-color: #f2f2f2;
    }

    .from-item-label {
        margin-bottom: 20px;
    }

    .from-label {
        font-weight: bold;
        margin-bottom: 10px;
    }
    .buttons {
        padding: 20px;
        display: flex;
        justify-content: center;
    }
    .solution-container{
        overflow-y: auto;
        height: 35vh;
    }
    .solution{
        margin: 20px;
        border: 2px solid #ccc;
        border-radius: 10px;
        padding: 20px;
        background-color: #f2f2f2;
    }
</style>