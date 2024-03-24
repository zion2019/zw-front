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
      setParams(state,params){
        state.params = params;
      },
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
      setTodayTask(state,todayTask){
        state.todayTask = todayTask;
      },
      setLastRoute(state,lastRoute){
        state.lastRoute = lastRoute;
      }
  
    }
})

export default store;