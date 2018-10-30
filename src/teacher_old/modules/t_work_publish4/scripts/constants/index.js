/**
 * Created by ZL on 2018/3/12.
 */
import {Constant} from "../module";
@Constant('workPublish4Interface', {
    GET_TEMP_ORAL_PAPER_QUES:'/rqb/question/getQuestionListForTempRapidPaper',//口算跨单元组卷 根据单元选择题数生成题目
    GET_ORAL_MULTI_UNITS_PAPER:'/pqb/api/paper/multiUnits/saveRapidPaper',//口算跨单元组卷 根据单元选择题数生成试卷
})
class workPublish4Interface {
}