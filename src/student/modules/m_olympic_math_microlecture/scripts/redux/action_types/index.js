/**
 * Created by ZL on 2017/11/28.
 */
export const MIRCORLECTURE_QUES = {
    //获取题目
    FETCH_TINY_CLASS_QUESTION_START:'FETCH_TINY_CLASS_QUESTION_START',
    FETCH_TINY_CLASS__QUESTION_STEP_STATUS_SUCCESS:'FETCH_TINY_CLASS__QUESTION_STEP_STATUS_SUCCESS',
    FETCH_TINY_CLASS_QUESTION_SUCCESS:'FETCH_TINY_CLASS_QUESTION_SUCCESS',
    FETCH_TINY_CLASS_QUESTION_FAIL:'FETCH_TINY_CLASS_QUESTION_FAIL',
    //提交题目答案
    TINY_CLASS_DIAGNOSE_SUBMIT_QUES_START:'TINY_CLASS_DIAGNOSE_SUBMIT_QUES_START',
    TINY_CLASS_DIAGNOSE_SUBMIT_QUES_SUCCESS:'TINY_CLASS_DIAGNOSE_SUBMIT_QUES_SUCCESS',
    TINY_CLASS_DIAGNOSE_SUBMIT_QUES_FAIL:'TINY_CLASS_DIAGNOSE_SUBMIT_QUES_FAIL',
    //获取做题记录
    FETCH_TINY_CLASS_QUES_RECORDS_START:'FETCH_TINY_CLASS_QUES_RECORDS_START',
    FETCH_TINY_CLASS_QUES_RECORDS_SUCCESS:'FETCH_TINY_CLASS_QUES_RECORDS_SUCCESS',
    FETCH_TINY_CLASS_QUES_RECORDS_FAIL:'FETCH_TINY_CLASS_QUES_RECORDS_FAIL',
};
export const MICRO_GRADE_LIST={
    //获取班级列表
    FETCH_MICRO_GRADE_LIST_START:'FETCH_MICRO_GRADE_LIST_START',
    FETCH_MICRO_GRADE_LIST_SUCCESS:'FETCH_MICRO_GRADE_LIST_SUCCESS',
    FETCH_MICRO_GRADE_LIST_FAIL:'FETCH_MICRO_GRADE_LIST_FAIL',
    //保存当前选择的年级
    SAVE_SELECT_MICRO_UNIT_GRADE:'SAVE_SELECT_MICRO_UNIT_GRADE',
}
export const MICRO_UNIT_LIST = {
    //获取单元
    FETCH_MICRO_UNIT_LIST_START:'FETCH_MICRO_UNIT_LIST_START',
    FETCH_MICRO_UNIT_LIST_SUCCESS:'FETCH_MICRO_UNIT_LIST_SUCCESS',
    FETCH_MICRO_UNIT_LIST_FAIL:'FETCH_MICRO_UNIT_LIST_FAIL',
    //保存当前选择的讲
    SAVE_SELECT_MICRO_UNIT_ITEM:'SAVE_SELECT_MICRO_UNIT_ITEM'
}
export const MICRO_EXAMPLE_LIST = {
    //获取列子列表
    FETCH_MICRO_EXAMPLE_LIST_START:'FETCH_MICRO_EXAMPLE_LIST_START',
    FETCH_MICRO_EXAMPLE_LIST_SUCCESS:'FETCH_MICRO_EXAMPLE_LIST_SUCCESS',
    FETCH_MICRO_EXAMPLE_LIST_FAIL:'FETCH_MICRO_EXAMPLE_LIST_FAIL',
    //保存当前选择的例子
    SAVE_SELECT_MICRO_EXAMPLE_ITEM:'SAVE_SELECT_MICRO_EXAMPLE_ITEM',
    MODIFY_SELECT_MICRO_EXAMPLE_ITEM:'MODIFY_SELECT_MICRO_EXAMPLE_ITEM', //作对举一反三的例题后更新正确题数
}
export const MICRO_EXAMPLE_DETAIL = {
    //获取例子的详情信息
    FETCH_MICRO_EXAMPLE_DETAIL_START:'FETCH_MICRO_EXAMPLE_DETAIL_START',
    FETCH_MICRO_EXAMPLE_DETAIL_SUCCESS:'FETCH_MICRO_EXAMPLE_DETAIL_SUCCESS',
    FETCH_MICRO_EXAMPLE_DETAIL_FAIL:'FETCH_MICRO_EXAMPLE_DETAIL_FAIL',
}
export const MICRO_VIP_LIST={ //支付商品
    SAVE_MICRO_PAY_BACK_URL:'SAVE_MICRO_PAY_BACK_URL',//保存支付列表返回的url
    FETCH_MICRO_GOODS_LIST_START:'FETCH_MICRO_GOODS_LIST_START',//获取商品列表
    FETCH_MICRO_GOODS_LIST_SUCCESS:'FETCH_MICRO_GOODS_LIST_SUCCESS',
    FETCH_MICRO_GOODS_LIST_FAIL:'FETCH_MICRO_GOODS_LIST_FAIL',
    SELECT_MICRO_GOODS:'SELECT_MICRO_GOODS',//选择的商品

    MICRO_GOODS_CREATE_ORDER_START:'MICRO_GOODS_CREATE_ORDER_START', //创建订单
    MICRO_GOODS_CREATE_ORDER_SUCCESS:'MICRO_GOODS_CREATE_ORDER_SUCCESS',
    MICRO_GOODS_CREATE_ORDER_FAIL:'MICRO_GOODS_CREATE_ORDER_FAIL',
    CHANGE_MICRO_GOODS_CREATE_ORDER_STATUS:'CHANGE_MICRO_GOODS_CREATE_ORDER_STATUS',//修改订单
};

export const MICRO_ALL_QUES_RECORDS={
    CHANGE_ALL_QUES_RECORDS_PAGINATION_INFO:'CHANGE_ALL_QUES_RECORDS_PAGINATION_INFO',//修改页码信息
    FETCH_ALL_QUES_RECORDS_REPORT_START:'FETCH_ALL_QUES_RECORDS_REPORT_START',//修改页码信息
    FETCH_ALL_QUES_RECORDS_REPORT_SUCCESS:'FETCH_ALL_QUES_RECORDS_REPORT_SUCCESS',//修改页码信息
    FETCH_ALL_QUES_RECORDS_REPORT_FAIL:'FETCH_ALL_QUES_RECORDS_REPORT_FAIL',//修改页码信息
}
export const MICRO_DO_QUESTION_MARK='MICRO_DO_QUESTION_MARK';