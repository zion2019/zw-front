<template>
    <el-dialog v-model="dialogVisible" title="提示" width="60%" draggable>
    <span>确认删除:{{task.title}}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false" type="success">取消</el-button>
        <el-button type="danger" @click="remove" >删除</el-button>
      </span>
    </template>
  </el-dialog>
    <Window :buttons="buttons">
        <Editor ref="EditorRef" @editorValueChange="editorValueChange" />
        <div class="edit-container">
            <div class="edit-form">
                <el-form ref="form" :model="task" :rules="rules">
                    <div class="form-wrapper">
                        <el-form-item  prop="title" label ="任务标题 :">
                            <el-input v-model="task.title" :maxlength="10" show-word-limit placeholder="任务名称"></el-input>
                        </el-form-item>
                        <el-form-item prop="topicId" label ="所属主题 :">
                            <el-tree-select 
                                check-strictly 
                                :props="treeProps"
                                placeholder="请选择所属细分主题"
                                :data="topicTreeDatas" 
                                v-model="task.topicId" />
                        </el-form-item>
                        <el-form-item prop="taskTime" label ="任务时间 :">
                            <el-date-picker v-model="task.taskTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm:ss"  placeholder="点击选择"> </el-date-picker>
                        </el-form-item>
                        <el-form-item label="任务提醒 :" >
                            <el-input-number v-model="task.remindTimeNum" :min="1" :max="60"/>
                            <el-select v-model="task.remindTimeType" placeholder="提前时间类型">
                                <el-option label="时" value="0" />
                                <el-option label="日" value="2" />
                                <el-option label="分" value="1" />
                            </el-select>
                        </el-form-item>
                       
                        <el-form-item label="  日常任务 :">
                            <el-switch  v-model="task.routine" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                        </el-form-item>
                        <el-form-item label="  执行频率 :" v-if="task.routine">
                            <el-input v-model="task.routineCron" placeholder="CRON表达式"></el-input>
                        </el-form-item>
                            
                        <el-form-item label="  内容:" prop="content">
                            <div v-html="task.content" class="preview-content"></div>
                            
                            <el-icon :size="30" @click="showEditor(0,task.content)">
                                <Edit />
                            </el-icon>
                        </el-form-item>
                    </div>
                    
                </el-form>
            </div>
        </div>
    </Window>
</template>

<script lang="ts" setup>
    import Window from '../../components/Window.vue';
    import { ref,onMounted,reactive } from 'vue';
    import {TaskService,TopicService} from '../../api/api';
    import { ElMessage } from 'element-plus';
    import Editor from '../../components/Editor.vue';
    import { useRouter, useRoute } from 'vue-router';
    const router = useRouter();
    import {useStore} from 'vuex'
    const EditorRef = ref();
    const form = ref(null);
    // 确认删除
    const dialogVisible = ref(false)
    const store = useStore();

    // 按钮定义
    const buttons = [
      {
        'type':'warning'
        ,'isPlain':true
        ,'label':'返回'
        ,'function':()=>{router.back()}  
      }
    ]
    /** vuex中获取topicID */
    const taskId = history.state.taskId;                                                                                        
    if(taskId){
        buttons.push({
            'type':'danger'
            ,'isPlain':false
            ,'label':'删除'
            ,'function': ()=>{dialogVisible.value = true}
        });
        buttons.push({
            'type':'success'
            ,'isPlain':false
            ,'label':'编辑'
            ,'function': save
        });
    }else{
        buttons.push({
            'type':'success'
            ,'isPlain':false
            ,'label':'添加'
            ,'function': save
        });
    }
   
    
    // 类别树定义
    const treeProps = {
        children: 'children',
        label: 'label',
        value:'id',
        disabled:false
    }
    const topicTreeDatas = ref([{
        children: [] as any,
        id: '0',
        label:'没有意义的根节点~',
        disabled:false
    }]);

    const task = ref({
        id:"",
        title:"",
        content:"",
        topicId:"",
        taskTime: '',
        remindTimeType: '0',
        remindTimeNum: '30',
        routine: false,
        routineCron:""
    });

    onMounted(async () => {
        // 回显信息加载
        if (taskId) {
            const taskRes = await TaskService.info(taskId) as any;
            if(taskRes.data){
                task.value = taskRes.data;
            }
        }
        // 加载类别树
        TopicService.tree(taskId)
        .then((res:any)=>{
            topicTreeDatas.value[0].children = res.dataList;
        }).catch(err=>{
        })
        return topicTreeDatas;
    });

    /** 保存 */
    function save(){
        let {validate} = form.value as any 
            validate((valid:Boolean) => {
            if(valid) {
                task.value.id = taskId;
                TaskService.save(task.value)
                .then((res: any) => {
                    ElMessage.success('成功');
                    router.back();
                })
                .catch((err: any) => {
                    ElMessage.error(err);
                });
            }
        });
    }

    // 编辑器展示
    const showEditor = (index: number, content: string) => {
        EditorRef.value.showEditor(index, content);
    };
    // 编辑完成回写
    const editorValueChange = (index: number, editorContent: string) => {
        task.value.content = editorContent;
    };

    /** 删除主题 */
    function remove(){
        TaskService.remove(taskId)
        .then((res: any) => {
            ElMessage.success('成功');
            router.back();
        })
        .catch((err: any) => {
            ElMessage.error(err.message)
        });
    }
    // 校验规则定义
    const rules = reactive({
        title: [
            { required: true, message: 'Please enter the title' },
            { pattern: /^.{1,10}$/, message: '10 characters maximum' },
        ],
        topicId: [{ required: true, message: 'Please choose a topic', trigger: 'blur' }],
        taskTime: [{ required: true, message: 'Please pick taskTime', trigger: 'blur' }],
    });


</script>

<style scoped>
    .topic-editor {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10%;
    }

    /* Additional styles for form items */
    .el-form-item__label {
        color: #333;
        font-weight: bold;
    }



</style>