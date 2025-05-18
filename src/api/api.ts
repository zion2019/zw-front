import { request,fileUpload } from './axios'

/**
 * @description -封装User类型的接口方法
 */
export class UserService {       // 模块一

    /**
     * @description 用户登录
     * @param {string} username - 用户名
     * @return {HttpResponse} result
     */
    static async login(params) {   // 接口一
        return request('/res/user/token', params)
    }

    /**
     * @description 用户注册
     * @param {string} username - 用户名
     * @return {HttpResponse} result
     */
    static async register(params) {   // 接口一
        return request('/res/user/register', params)
    }
    

}



/**
 * @description -封装File服务的接口方法
 */
export class FileService {       

    /**
     * @description 上传文件
     * @param {binary} file - 文件名
     * @return {HttpResponse} result
     */
    static async upload(rawFile) {   
        const formData = new FormData();
        formData.append('file', rawFile);
        return request('/res/file/upload', formData, 'POST')
    }

}

/**
 * @description -封装Topic服务的接口方法
 */
export class TopicService {      

    /**
     * @description 主题树
     * @return {HttpResponse} result
     */
    static async tree(excludeId) {
        let params = {excludeId:excludeId};
        return request('/learn/topic/tree',params,'GET')
    }

    /**
     * @description info
     * @return {HttpResponse} result
     */
    static async info(topicId) {
        if(topicId == null){
            return [];
        }
        return request('/learn/topic/info',{id:topicId},'GET')
    }

    /**
     * @description save
     * @return {HttpResponse} result
     */
     static async save(topic) {
        return request('/learn/topic',topic)
    }

    /**
     * @description page 
     * @return {HttpResponse} result
     */
    static async page(params) {
        return request('/learn/topic',params,'GET')
    }

    /**
     * @description remove 
     * @return {HttpResponse} result
     */
    static async remove(topicId) {
        if(topicId == null){
            return [];
        }
        return request('/learn/topic',{topicId},'DELETE');
    }

}

/**
 * @description -封装Point服务的接口方法
 */
export class PointService {      

    /**
     * @description save
     * @return {HttpResponse} result
     */
    static async save(point) {
        return request('/learn/point',point,'POST')
    }

    /**
     * @description info
     * @return {HttpResponse} result
     */
    static async info(pointId) {
        if(!pointId){
            return [];
        }
        return request('/learn/point/info',{pointId},'GET')
    }
    
    /**
     * @description page 
     * @return {HttpResponse} result
     */
    static async page(params) {
        return request('/learn/point',params,'GET')
    }

    /**
     * @description remove 
     * @return {HttpResponse} result
     */
    static async remove(pointId) {
        if(pointId == null){
            return [];
        }
        return request('/learn/point',{pointId},'DELETE');
    }

    static async uploadFiles(formData) {
        return fileUpload('/learn/point/import/excel',formData);
    }
}

/**
 * @description -封装Practise服务的接口方法
 */
export class PracticeService {      
    /**
     * @description page 
     * @return {HttpResponse} result
     */
    static async today(params) {
        return request('/learn/practice/today',params,'GET')
    }

    /**
     * @description page 
     * @return {HttpResponse} result
     */
    static async getpoint(params) {
        return request('/learn/practice/point',params,'GET')
    }

    /**
     * @description practise 
     * @return {HttpResponse} result
     */
    static async practise(params) {
        return request('/learn/practice',params,'POST')
    }
}

/**
 * @description -封装Task服务的接口方法
 */
export class TaskService {  
    /**
     * @description 今日任务分页 
     * @return {HttpResponse} result
     */
    static async pages(params) {
        return request('/learn/task/page',params,'POST')
    }

    /**
     * @description save
     * @return {HttpResponse} result
     */
    static async save(task) {
        return request('/learn/task',task,'POST')
    }

    /**
     * @description info
     * @return {HttpResponse} result
     */
    static async info(taskId) {
        if(!taskId){
            return [];
        }
        return request('/learn/task/info/'+taskId,{},'GET')
    }
    /**
     * @description remove 
     * @return {HttpResponse} result
     */
    static async remove(taskId) {
        if(taskId == null){
            return [];
        }
        return request('/learn/task',{taskId},'DELETE');
    }

    /**
     * @description delay
     * @return {HttpResponse} result
     */
    static async delay(delayQo) {
        if(!delayQo){
            return [];
        }
        return request('/learn/task/delay',delayQo,'PUT')
    }


    /**
     * @description finish
     * @return {HttpResponse} result
     */
    static async finish(finishQo) {
        if(!finishQo){
            return [];
        }
        return request('/learn/task/finish',finishQo,'PUT')
    }
    
}

/**
 * @description -封装Bill服务的接口方法
 */
export class BillService {

    /**
     * @description 获取当月饼图数据
     * @return {HttpResponse} result
     */
    static async chartData() {
        // 模拟数据
        return {
            code: 200,
            data: [
                { name: '餐饮', value: 1200, color: '#5470C6' },
                { name: '交通', value: 800, color: '#91CC75' },
                { name: '购物', value: 3000, color: '#FAC858' },
                { name: '娱乐', value: 600, color: '#EE6666' },
                { name: '其他', value: 400, color: '#73C0DE' }
            ]
        };
    }

    /**
     * @description 获取消费明细列表
     * @return {HttpResponse} result
     */
    static async list(params) {
        // 模拟数据
        return {
            code: 200,
            dataList: [
                { id: '1', label: '麦当劳午餐', amount: 35, date: '2024-03-15', type: '支出', tag: '餐饮' },
                { id: '2', label: '地铁费', amount: 5, date: '2024-03-15', type: '支出', tag: '交通' },
                { id: '3', label: '工资收入', amount: 8000, date: '2024-03-10', type: '收入', tag: '工资' },
                { id: '4', label: '电影票', amount: 70, date: '2024-03-14', type: '支出', tag: '娱乐' },
                { id: '5', label: '衣服购买', amount: 450, date: '2024-03-13', type: '支出', tag: '购物' }
            ],
            total: 5
        };
    }

    /**
     * @description 获取标签树
     * @return {HttpResponse} result
     */
    static async tagTree(excludeId = '') {
        return {
            code: 200,
            dataList: [
                {
                    id: '1',
                    label: '收入',
                    children: [
                        { id: '11', label: '工资', parentId: '1', type: '收入', color: 'green' },
                        { id: '12', label: '兼职', parentId: '1', type: '收入', color: 'lightgreen' }
                    ]
                },
                {
                    id: '2',
                    label: '支出',
                    children: [
                        { id: '21', label: '餐饮', parentId: '2', type: '支出', color: 'red' },
                        { id: '22', label: '交通', parentId: '2', type: '支出', color: 'orange' },
                        { id: '23', label: '购物', parentId: '2', type: '支出', color: 'purple' },
                        { id: '24', label: '娱乐', parentId: '2', type: '支出', color: 'pink' }
                    ]
                }
            ]
        };
    }

    /**
     * @description 标签保存
     * @return {HttpResponse} result
     */
    static async saveTag(tag) {
        console.log('保存标签:', tag);
        return { code: 200, message: '保存成功' };
    }

    /**
     * @description 删除标签
     * @return {HttpResponse} result
     */
    static async removeTag(id) {
        console.log('删除标签:', id);
        return { code: 200, message: '删除成功' };
    }
}
