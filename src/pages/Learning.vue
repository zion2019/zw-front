<template>
  <Window>
    <div class="progress-container">
      <!-- TODO CARD START -->
      <div class="card" :class="{'todo': todoDone, 'fly': !todoDone}">
          <div class="card-content">
              <h2 v-if="!todoDone">今日份待办～</h2>
              <h2 v-if="todoDone">可以躺平啦！</h2>
              <div class="progress" >
                <el-carousel :interval="4000" type="card" height="200px">
                  <el-carousel-item v-for="item in tasks" :key="item"  >
                    <div class="progress-item" :class=item.background>
                      <el-progress
                        v-if="item.id != '-1'"
                        @click="gotoTask(item)"
                        style="display: flex;justify-content: center;" 
                        type="circle" 
                        :percentage="item.completePercent"
                        :status="progressStatus(item.completePercent)" >
                        <el-text tag="b" size="large">{{item.title}}</el-text>
                      </el-progress>
                      <div style="display: flex;justify-content: center;"  v-if="item.id == '-1'">
                        <el-button  type="success" @click="toMoreTask" round>MORE</el-button>
                      </div>
                      
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </div>
          </div>
        </div>
        <!-- TODO CARD END -->

        <!-- Practice CARD START -->
        <div class="card" :class="{'release': practiceDone, 'practise': !practiceDone}">
          <div class="card-content">
              <h2 v-if="!practiceDone">今日份练习～</h2>
              <h2 v-if="practiceDone">今日复习完成！</h2>
              <div class="progress" >
                <el-carousel :interval="4000" type="card" height="200px">
                  <el-carousel-item v-for="item in topics" :key="item"  >
                    <div class="progress-item" :class=item.background>
                      <el-progress
                        v-if="item.id != '-1'"
                        @click="practise(item)"
                        style="display: flex;justify-content: center;" 
                        type="circle" 
                        :percentage="item.completePercent"
                        :status="progressStatus(item.completePercent)" >
                        <el-text tag="b" size="large">{{item.title}}</el-text>
                      </el-progress>
                      <div style="display: flex;justify-content: center;"  v-if="item.id == '-1'">
                        <el-button  type="success" @click="toMorePractice" round>MORE</el-button>
                      </div>
                      
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </div>
          </div>
        </div>
        <!-- Practice CARD START -->
        
        <div class="card manager">
          <div class="card-content">
              <h2>快速入口～</h2>
              <div class="quick-option">
                <button class="quick-button" style="background-color: #E0115F;">
                  <el-text style="color: #fff;font-weight: bold;"><el-icon ><CirclePlus /></el-icon>记个待办</el-text>
                </button>
                <button class="quick-button" style="background-color: #E0115F;" @click="quick('PointEdit')">
                  <el-text style="color: #fff;font-weight: bold;"><el-icon ><CirclePlus /></el-icon>记录知识</el-text>
                </button>
                <button class="quick-button" style="background-color: #4169E1;" @click="quick('TopicEdit')">
                  <el-text style="color: #fff;font-weight: bold;"><el-icon ><CirclePlus /></el-icon>创建主题</el-text>
                </button>
                <button class="quick-button" style="background-color: #FFD700;" @click="quick('TopicList')">
                  <el-text style="font-weight: bold;"><el-icon ><CirclePlus /></el-icon>主题管理</el-text>
                </button>
              </div>
          </div>
        </div>
        
    </div>
  </Window>
  
</template>

<script setup>
  import { onMounted,ref } from 'vue';
  import Window from '../components/Window.vue'
  import { useRouter } from 'vue-router';
  import {PracticeService,TaskService} from '../api/api';
  import '../assets/carousel.css'
  import { ElMessage } from 'element-plus'
  import {useStore} from 'vuex'
  const store = useStore();

  const practiceDone = ref(true);
  const todoDone = ref(true);
  const topics = ref([]);
  const tasks = ref([]);
  const router = useRouter();
  onMounted(async () => {
    try{
      PracticeService.today({pageNo:0,pageSize:2})
      .then((res)=>{
        topics.value = res.dataList || [];
        if(topics.value.length > 0){
          
          topics.value = practiceTemplates.value.map((template, index) => {
            return topics.value[index] || template;
          })
          topics.value.push(dataMore.value);
          todoDone.value = false;
        }
        
      }).catch(err=>{
      })
    }catch(err){
      console.log(err);
    }finally{      
    }

    // 获取今日待办
    try{
      TaskService.todoPage({pageNo:1,pageSize:2})
      .then((res)=>{
        tasks.value = res.dataList || [];
        if(tasks.value.length > 0){
          tasks.value = taskTemplates.value.map((template, index) => {
            return tasks.value[index] || template;
          })
          tasks.value.push(dataMore.value);
          todoDone.value = false;
        }
        
      }).catch(err=>{
      })
    }catch(err){
      console.log(err);
    }finally{      
    }
    
  })

  /** practise(item.completePercent) */
  function gotoTask(task){
    if(task.toDayCompletePercent >= 100 || task.toDayCompletePercent < 0){
      ElMessage.success("完成啦");
      return;
    }

    // router.push({name:'Practice'});
  }

    /** 练习列表 */
  function toMoreTask(){
    // router.push({name:'PracticeList'});
  }

  /** practise(item.completePercent) */
  function practise(topic){
    if(topic.toDayCompletePercent >= 100 || topic.toDayCompletePercent < 0){
      ElMessage.success("已经复习完啦");
      return;
    }

    store.commit('setFullTitle',topic.fullTitle);
    store.commit('setTopicId',topic.topicId);
    router.push({name:'Practice'});
  }

  /** 练习列表 */
  function toMorePractice(){
    router.push({name:'PracticeList'});
  }

  // 轮播图进度条样式
  const progressStatus = (completePercent) =>{
    if(completePercent < 30){
        return '';
    }
    if(completePercent > 30 && completePercent <= 80  ){
        return 'warning';
    }
    if(completePercent > 80){
        return 'success';
    }

    return 'exception';
  }

  /** 快捷创建列表 */
  const quick = (component) =>{
    store.commit('setTopicId',null);
    store.commit('setPointId',null);
    router.push({name:component});
  }

  /**模版数据 */
  const practiceTemplates = ref([
    {
        id:'1'
        ,title:'模版主题'
        ,background: 'gloomy'
        ,completePercent: 25.03

    },{
      id:'2'
      ,title:'模版主题'
      ,background: 'shine'
      ,completePercent: 50.05
    }
  ])

  /**模版数据 */
  const taskTemplates = ref([
    {
        id:'1'
        ,title:'模版主题'
        ,background: 'gloomy'
        ,completePercent: 25.03

    },{
      id:'2'
      ,title:'模版主题'
      ,background: 'shine'
      ,completePercent: 50.05
    }
  ])

  /** 更多项 */
  const dataMore = ref(
    {
      id:'-1'
      ,title:'更多'
      ,background: 'frog'
      ,percentOfMastery: 99
    }
  )

</script>


<style scoped>
.quick_text {
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
}
.quick-option {
  display: flex;
  flex-direction: column;
}
.quick-button {
  display: inline-block;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  margin-top: 5px;
  border: none;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.quick-button:hover {
  background-color: #ff9900;
  transform: scale(1.05);
}

.progress {
  height: 30%;
}

.el-carousel__item {
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.progress-container {
    position: absolute;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;     /* 垂直居中 */
    display: flex;
}
.card {
  border-radius: 20px;
  justify-content: center;
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  margin-right: 2%;
  overflow: hidden;
  width: 40%;
  height: 80%;
}
.card.practise {
  background: url("../assets/imgs/Strive.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.card.release {
  background: url("../assets/imgs/release.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.card.todo {
  background: url("../assets/imgs/Tasks.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.card.fly {
  background: url("../assets/imgs/Tasks.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.card.manager {
  background: url("../assets/imgs/Flying.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.card-image {
  height: 50%;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 20px;
}

.card-content h2 {
  font-size: 20px;
  margin-bottom: 10px;
  /* color: #fff;
  mix-blend-mode: difference; */
}

.card-content p {
  font-size: 14px;
  color: #555;
}

@media (max-width: 768px) {
  .progress-container {
    flex-direction: column; /* 纵向排列 */
    justify-content: unset;
    height: max-content;
  }
  .card {
    margin-top: 10%;
    width: 80%;
    height: 40%;
  }
  .card.manager {
    margin-bottom: 10%;
  }
}
.el-row {
    margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-new {
  background-color: #e24487;
}
.bg-purple-blue {
  background: #02448f;
}
.bg-purple-black {
  background: #00040c;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.grid-content img {
  width: 10%;
  height: 90%;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

/* 轮播图背景样式 start */
.progress-item {
  display: flex;
  flex-direction: column;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
}
/* 轮播图背景样式 end */
.progress .el-carousel .el-carousel__indicators--horizontal{
  display: none;
}
</style>
