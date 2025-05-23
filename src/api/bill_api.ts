export class BillCategoryService{

    /**
     * @description 获取标签树
     * @return {HttpResponse} result
     */
    static async categoryTree(excludeId = '') {
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

    static async info(categoryId) {
        return {
            code: 200,
            data: {
                title:"mock",
                color:"red",
                parentId:"0",
                code:"MOCK"
            }
        }
    }


    /**
     * @description 标签保存
     * @return {HttpResponse} result
     */
    static async saveCategory(tag) {
        console.log('保存标签:', tag);
        return { code: 200, message: '保存成功' };
    }

    /**
     * @description 删除标签
     * @return {HttpResponse} result
     */
    static async removeCategory(id) {
        console.log('删除标签:', id);
        return { code: 200, message: '删除成功' };
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
    static async chartStatsData(params = {}) {
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
    static async billDetailPage(params) {
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
