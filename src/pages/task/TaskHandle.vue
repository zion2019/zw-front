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
                <el-form-item label="任务时间:">
                    <el-tag class="ml-2" type="success">{{task.taskTime}}</el-tag>
                </el-form-item>
            </div>

            <!-- 文本区域 -->
            <div class="solution-container">
                <div class="solution" v-if="!delayFormShow">
                    <el-form-item label="完成情况:">
                        <el-input v-model="finishRemark" type = "textarea" :maxlength="100" show-word-limit placeholder="又自律了兄弟～"></el-input>
                    </el-form-item>
                    <div v-html="task.content" class="preview-content"></div> 
                </div>
                <div class="solution" v-if="delayFormShow">
                    <el-form-item label="推迟 :" >
                        <el-input-number v-model="delayForm.delayTimeNum" :min="1" :max="60"/>
                        <el-select v-model="delayForm.delayTimeType" placeholder="提前时间类型">
                            <el-option label="小时" value="0" />
                            <el-option label="天" value="2" />
                            <el-option label="分钟" value="1" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="推迟原因:">
                            <el-input v-model="delayForm.delayReason" type = "textarea" :maxlength="100" show-word-limit placeholder="忙啥呢？"></el-input>
                    </el-form-item>
                </div>
            </div>

            <!-- 操作区域 -->
            <div class="buttons" v-if="showButton">
                <el-button type="info" v-if="!delayFormShow"  @click="goback()">返回</el-button>
                <el-button type="danger" v-if="!delayFormShow" @click="showDelay()">推迟</el-button>
                <el-button type="success" v-if="!delayFormShow" @click="finish()">完成</el-button>
                <el-button type="danger" v-if="delayFormShow" @click="delay()">确认推迟</el-button>
                <el-button type="success" v-if="delayFormShow" @click="disableDelayForm()">取消</el-button>

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
    taskTime: '',
    routine: false,
    routineCron:"",
    topicFulTitle:""
});
const finishRemark = ref();
const delayFormShow = ref(false);
const delayForm = ref({
    delayTimeNum : 1
    ,delayTimeType: "0"
    ,delayReason:""
    ,taskId:task.value.id
});


/** vux获取参数 */
const taskId = history.state.taskId;

const showButton = ref(true);

/** 主题下题目加载 */
const loadTaskInfo = async () =>{
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
    } 
}

onMounted(loadTaskInfo);

function showDelay(){
    delayFormShow.value = true;
}
function disableDelayForm(){
    delayFormShow.value = false;
}

/** 返回 */
function goback(){
    router.back();
}

function delay(){
    if(!delayForm.value.delayReason){
        ElMessage.error('给个交待!(推迟原因)');
        return;
    }
    delayForm.value.taskId = taskId;
    TaskService.delay(delayForm.value).then((res : any)=>{
        ElMessage.success('推迟成功！');
        setTimeout(() => {router.back() }, 2000);
    }).catch(err=>{
        ElMessage.error('推迟任务出现问题');
        setTimeout(() => {router.back() }, 2000);
    })

}

function finish(){
    if(!finishRemark.value){
        ElMessage.error('完成了吗？备注一下???');
        return;
    }
    TaskService.finish({
        taskId:taskId
        ,finishRemark:finishRemark.value
    }).then((res : any)=>{
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