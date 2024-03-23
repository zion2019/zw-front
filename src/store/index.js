import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
    state () {
      return {
        topicId:''
        ,pointId:''
        ,fullTitle:''
        ,isLoading: false
        ,todayTask:false
        ,taskId:''
      }
    },
    mutations: {
      setTopicId(state,topicId){
        state.topicId = topicId;
      },
      setPointId(state,pointId){
        state.pointId = pointId;
      },
      setFullTitle(state,fullTitle){
        state.fullTitle = fullTitle;
      },
      setTaskId(state,taskId){
        state.taskId = taskId;
      },
      startLoading(state) {
        state.isLoading = true;
      },
      stopLoading(state) {
        state.isLoading = false;
      },
      setTodayTask(todayTask){
        state.todayTask = todayTask;
      }
  
    }
})

export default store;