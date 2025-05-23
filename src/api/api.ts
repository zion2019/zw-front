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
     * @param {Object} params - 查询参数
     * @param {string} params.startDate - 开始日期
     * @param {string} params.endDate - 结束日期
     * @param {Array} params.tags - 标签数组
     * @return {HttpResponse} result
     */
    static async chartData(params = {}) {
        // 模拟处理参数
        const { startDate, endDate, tags } = params;

        // 模拟数据
        return {
            code: 200,
            data: [
                { name: '餐饮', value: 1200, color: '#5470C6',categoryId:"1" },
                { name: '交通', value: 800, color: '#91CC75' ,categoryId:"2"},
                { name: '购物', value: 3000, color: '#FAC858' ,categoryId:"3"},
                { name: '娱乐', value: 600, color: '#EE6666' ,categoryId:"4"},
                { name: '其他', value: 400, color: '#73C0DE' ,categoryId:"5"}
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
                { id: '1', categoryDes: '工作餐', amount: -35, date: '2024-03-15 12:54', remark:'重庆小面',categoryColor:'#5470C6' },
                { id: '2', categoryDes: '消费', amount: -8.8, date: '2024-03-15 07:32', remark:'全家美式',categoryColor:'#91CC75' },
                { id: '3', categoryDes: '房租', amount: -1030, date: '2024-03-15 12:54', remark:'房租',categoryColor:'#FAC858'},
                { id: '4', categoryDes: '聚餐', amount: -88, date: '2024-03-15 20:54', remark:'重庆火锅',categoryColor:'#73C0DE' },
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

    /**
     * @description 获取账单详情
     * @param {Object} params - 请求参数
     * @param {string} params.id - 账单ID
     * @return {HttpResponse} result
     */
    static async billDetail(params = {}) {
        const { id } = params;

        // 模拟数据
        return {
            code: 200,
            data: {
                id: id,
                categoryDes: '房租',
                amount: -1030,
                date: '2024-03-15 12:54',
                remark: '房租',
                categoryColor: '#FAC858',
                paymentMethod: '支付宝',
                location: '上海'
            }
        };
    }
}
