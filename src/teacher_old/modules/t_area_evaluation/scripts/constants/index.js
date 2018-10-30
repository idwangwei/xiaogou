/**
 * Created by qiyuexi on 2018/3/7.
 */

import {Constant} from "../module";
@Constant('areaEvaluationInterface', {
        GET_TEXTBOOK_LIST_V2: '/qb/ptag/getTextbooks_v2',//获取所有教材列表
        GET_TEMP_PAPER_QUES:'/rqb/question/getQuestionListForTempPaper',//根据单元选择题数生成题目
        GET_MULTI_UNITS_PAPER:'/pqb/api/paper/multiUnits/saveAuto',//根据单元选择题数生成试卷
        BUILD_AREA_EVALUATION:'/um/trGroup/save/area/assessment',//生成区域测评
        GET_AREA_EVALUATION_LIST:'/qbu/api/area/deliver/listMore',//获取区域测评列表
        GET_SCORE_TYPE_LIST:'/qbu/api/simpleStatics/area/scoreDistribution',//获取分数区间列表
        GET_SCORE_STATICS_INFO:'/qbu/api/area/simpleStatics/rank',//获取平均分和统计相关
        EXPORT_EXCEL:'/um/trGroup/area/assessment/excel',//excel导出接口
        GET_CLAZZ_LIST:'/um/trGroup/area/assessment/classAverageScore',//获取班级信息列表
        GET_AUTO_PAPER_LIST:'/um/trGroup/area/assessment/get/paper',//获取后台自动组好的试卷  不用手动去选
        GET_ALL_REPORT_INFO:'/um/trGroup/area/assessment/statistics',//获取测评报告
})
class areaEvaluationInterface {
}