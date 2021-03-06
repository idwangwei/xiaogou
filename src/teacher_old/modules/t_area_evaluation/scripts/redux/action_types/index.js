/**
 * Created by qiyuexi on 2017/12/8.
 */
export const FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_START = "FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_START";
export const FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_SUCCESS = "FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_SUCCESS";
export const FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_FAIL = "FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_FAIL";
export const SELECT_AREA_EVALUATION_TEXTBOOK_WORK = "SELECT_AREA_EVALUATION_TEXTBOOK_WORK";
export const SELECT_AREA_EVALUATION_UNIT = "SELECT_AREA_EVALUATION_UNIT";
export const SELECT_AREA_AUTO_PAPER = "SELECT_AREA_AUTO_PAPER";
export const FETCH_ALL_REPORT_INFO = "FETCH_ALL_REPORT_INFO";
//跨单元组卷
export const PUB_WORK_DIFF_UNIT={
    FETCH_AREA_EVALUATION_TEMP_PAPER_QUES_START:'fetch_area_evaluation_temp_paper_ques_start',
    FETCH_AREA_EVALUATION_TEMP_PAPER_QUES_FAIL:'fetch_area_evaluation_temp_paper_ques_fail',
    FETCH_AREA_EVALUATION_TEMP_PAPER_QUES_SUCCESS:'fetch_area_evaluation_temp_paper_ques_success',
    CHANGE_AREA_EVALUATION_PAPER_SET_PARAMS:'change_area_evaluation_paper_set_params',//修改试卷设置信息（每单元选择题数，难以成都修改）
    CHANGE_AREA_EVALUATION_PAPER_NAME:'change_area_evaluation_paper_name',//修改试卷名
    PUBLISH_AREA_EVALUATION_TEMP_PAPER_SUCCESS:'publish_area_evaluation_temp_paper_success',//作业发布成功

    COMPOSE_AREA_EVALUATION_MULTI_UNIT_PAPER_START:'compose_area_evaluation_multi_unit_paper_start', //组卷开始
    COMPOSE_AREA_EVALUATION_MULTI_UNIT_PAPER_FAIL:'compose_area_evaluation_multi_unit_paper_fail', //组卷失败
    COMPOSE_AREA_EVALUATION_MULTI_UNIT_PAPER_SUCCESS:'compose_area_evaluation_multi_unit_paper_success',//组卷成功
};
export const GET_AE_LIST={
    GET_AE_LIST_START:"GET_AE_LIST_START",
    GET_AE_LIST_FAIL:"GET_AE_LIST_FAIL",
    GET_AE_LIST_SUCCESS:"GET_AE_LIST_SUCCESS",
}
export const LIST_OBJ={
    GET_SCORE_TYPE_LIST_SUCCESS:"GET_SCORE_TYPE_LIST_SUCCESS",
    GET_STATICS_INFO_SUCCESS:"GET_STATICS_INFO_SUCCESS",
    GET_PAPER_CLAZZ_LIST_SUCCESS:"GET_PAPER_CLAZZ_LIST_SUCCESS",
}
export const GET_AUTO_PAPER_LIST={
    GET_AUTO_PAPER_LIST_START:"GET_AUTO_PAPER_LIST_START",
    GET_AUTO_PAPER_LIST_FAIL:"GET_AUTO_PAPER_LIST_FAIL",
    GET_AUTO_PAPER_LIST_SUCCESS:"GET_AUTO_PAPER_LIST_SUCCESS",
}