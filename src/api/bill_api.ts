import {request} from "./axios";

export class BillCategoryService{

    /**
     * @description 获取标签树
     * @return {HttpResponse} result
     */
    static async categoryTree(excludeId = '') {
        let params = {excludeId:excludeId};
        return request('/bill/category/tree',params,'GET')
    }

    static async info(categoryId) {
        if(categoryId == null){
            return [];
        }
        return request('/bill/category/info',{id:categoryId},'GET')
    }

    static async list(params) {
        return request('/bill/category/list',params)
    }

    static async billsPage(params) {
        return request('/bill/category/bills/page',params)
    }


    /**
     * @description 标签保存
     * @return {HttpResponse} result
     */
    static async saveCategory(category) {
        return request('/bill/category',category)
    }

    /**
     * @description 删除标签
     * @return {HttpResponse} result
     */
    static async removeCategory(id) {
        if(id == null){
            return [];
        }
        return request('/bill/category',{categoryId:id},'DELETE');
    }
}
/**
 * @description -封装Bill服务的接口方法
 */
export class BillService {
    /**
     * @description 账单保存
     * @return {HttpResponse} result
     */
    static async saveBill(bill) {
        return request('/bill',bill)
    }



    /**
     * @description 获取账单详情
     * @param {Object} params - 请求参数
     * @param {string} params.id - 账单ID
     * @return {HttpResponse} result
     */
    static async billInfo(billId) {
        if(billId == null){
            return [];
        }
        return request('/bill',{id:billId},'GET')
    }

    static async recentlyCategories(count) {
        if(count == null){
            count = 3;
        }
        return request('/bill/category/recently',{count:count},'GET')
    }
}
