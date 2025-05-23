<template>
    <el-dialog v-model="dialogVisible" title="提示" width="60%" draggable>
        <span>确认删除:{{category.title}}</span>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false" type="success">取消</el-button>
            <el-button type="danger" @click="remove" >删除</el-button>
        </span>
        </template>
    </el-dialog>
    <Window :buttons="buttons">
        <div class="edit-container">
            <div class="edit-form">
                <el-form ref="form" :model="category" :rules="rules">
                    <div class="form-wrapper">
                        <el-form-item  prop="title">
                            <el-input v-model="category.title" :maxlength="10" show-word-limit placeholder="类型名称"></el-input>
                        </el-form-item>
                        <el-form-item  prop="code">
                            <el-input v-model="category.code" :maxlength="20" show-word-limit placeholder="类型编码"></el-input>
                        </el-form-item>
                        <el-form-item prop="parentId">
                            <el-tree-select 
                                check-strictly 
                                :props="treeProps"
                                placeholder="所属类别"
                                :data="categoryTreeDataList"
                                v-model="category.parentId" />
                        </el-form-item>

                        <el-form-item prop="color">
                            <el-select v-model="category.color" placeholder="背景颜色">
                                <el-option v-for="item in BillCategoryBackColor"  :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>

                </el-form>
            </div>
        </div>
    </Window>
</template>

<script lang="ts" setup>
    import Window from '../../components/Window.vue'
    import { ref,onMounted,reactive } from 'vue';
    import {BillCategoryService} from '@/api/bill_api';
    import {BillCategoryBackColor} from '@/api/bill_api_back_color';


    /**  路由导入 */
    import { useRouter } from 'vue-router';
    import {useStore} from 'vuex'
    import { ElMessage } from 'element-plus'
    const store = useStore()
    const router = useRouter();

    const form = ref(null);
    // 确认删除
    const dialogVisible = ref(false)

    // 按钮定义
    const buttons = [
      {
        'type':'warning'
        ,'isPlain':true
        ,'label':'返回'
        ,'function':()=>{router.push({name:'BillCategoryList'})}
      }
    ]
    /** vuex中获取 categoryId */
    const categoryId = history.state.categoryId;
    if(categoryId){
        buttons.push({
            'type':'danger'
            ,'isPlain':false
            ,'label':'删除'
            ,'function': ()=>{dialogVisible.value = true}
        });
        buttons.push({
            'type':'success'
            ,'isPlain':false
            ,'label':'更新'
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

    

    //  选中的父主题
    const selectedParentId = ref("");

    // 类别树定义
    const treeProps = {
        children: 'children',
        label: 'label',
        value:'id',
        disabled:false
    }
    const categoryTreeDataList = ref([{
        children: [] as any,
        id: '0',
        label:'总类别',
        disabled:false
    }]);

    const category = ref({
        title:"",
        color:"",
        parentId:"",
        code:""
    });

    onMounted(async () => {
        // 回显信息加载
        if (categoryId) {
            BillCategoryService.info(categoryId).then((res:any)=>{
                category.value = res.data;
                selectedParentId.value = category.value.parentId
            }).catch(err=>{
                ElMessage.error(err);
            })
        }
        // 加载类别树
        BillCategoryService.categoryTree()
        .then((res:any)=>{
          categoryTreeDataList.value[0].children = res.dataList;
        }).catch(err=>{
          ElMessage.error(err);
        })
        return categoryTreeDataList;
    });

    /** 保存 */
    function save(){
        let {validate} = form.value as any 
            validate((valid:Boolean) => {
            if(valid) {
              BillCategoryService
                  .saveCategory(category.value)
                  .then((res:any)=>{
                    router.push({name:"BillCategoryList"});
                  }).catch(err=>{
                      ElMessage.error(err);
                  })
            }
        });
    }

    const toList = () => {router.push({name:"BillCategoryList"});}


    /** 删除主题 */
    function remove(){
      BillCategoryService.removeCategory(categoryId)
        .then((res: any) => {
            toList();
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
        parentId: [{ required: true, message: 'Please choose a topic', trigger: 'blur' }],
        color: [{ required: true, message: 'Please choose a topic', trigger: 'blur' }],
        code: [{ required: true, message: 'Please enter the code', trigger: 'blur' }],
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