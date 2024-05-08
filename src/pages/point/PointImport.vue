<template>
    <Window>
        <el-upload
            class="upload-demo"
            drag
            action=""
            :http-request="uploadFile"
            multiple
        >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
             <em>点此上传</em>
            </div>
            
            <template #tip>
            <div class="el-upload__tip">
                xls/xlsx files with a size less than 10MB <em><el-button @Click="exportTemplate()" type="primary">下载模板</el-button></em>
            </div>
            </template>
        </el-upload>
    </Window>
</template>
<script lang="ts" setup>
    import Window from '../../components/Window.vue';
    import { UploadFilled } from '@element-plus/icons-vue'
    import { PointService } from '../../api/api';
    import { ElMessage } from 'element-plus'
    import { useRouter } from 'vue-router';  
    const router = useRouter();

    function uploadFile(param){
        const file = param.file;
        const form = new FormData();
        form.append("file", file);
        PointService.uploadFiles(form).then(res => {
            ElMessage.success('导入完成');
            setTimeout(() => {router.back() }, 2000);
        }).catch(error => {
            // clear file
            this.$message.error(error)
        })
    }

    function exportTemplate(){
        window.location.href = import.meta.env.VITE_BASE_API+'/learn/point/export/template';
    }
</script>