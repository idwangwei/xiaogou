///**
// * Created by 彭建伦 on 2016/6/15.
// */
import {WORK_LIST, SELECT_QUESTION, APP_FLAG} from '../../actiontypes/actiontypes';
import _findIndex from 'lodash.findindex';
import * as defaultStates from './../../default_states/default_states';
import lodash_assign from 'lodash.assign';
import _find from 'lodash.find';


function wl_clazz_list_with_works(state = defaultStates.wl_clazz_list_with_works, action = null) {
    let nextState = lodash_assign({}, state);
    let payload = action.payload;
    let currentWork;
    switch (action.type) {
        case WORK_LIST.FETCH_WORK_LIST_SUCCESS:
            nextState[payload.clzId] = payload.list;
            return nextState;
        
        case WORK_LIST.DELETE_SELF_TRAIN_WORK:
            nextState[payload.clzId] = payload.list;
            return nextState;

        //*获取未提交的试卷信息*/
        case WORK_LIST.WORK_LIST_FETCH_DO_PAPER_SUCCESS:
            if (!payload.paper) {
                return state
            }
            let arr=_find(nextState[payload.clzId],{instanceId:payload.instanceId});
            if(!arr){
                if(nextState[payload.clzId]==null){
                    nextState[payload.clzId]=[];
                }
                nextState[payload.clzId].push({
                    instanceId:payload.instanceId,
                    paperInfo:{
                        doPaper:payload.paper
                    }
                })
            }else{
                arr.paperInfo.doPaper = payload.paper;
            }
            return nextState;
        //*获取提交的试卷信息*/
        case WORK_LIST.WORK_LIST_FETCH_PAPER_SUCCESS:
            if (!payload.paper) {
                return state
            }
            let index = _findIndex(nextState[payload.clzId], function (val) {
                return val.instanceId == payload.instanceId;
            });
            index = index == -1 ? nextState[payload.clzId].length:index;
            nextState[payload.clzId][index].paperInfo.paper = payload.paper;
            return nextState;

        //*提交试卷*/
        case WORK_LIST.SUBMIT_PAPER_MODIFY_PAPER_STATUS:
            currentWork = _find(nextState[payload.clzId],{instanceId:payload.instanceId});
            currentWork.paperInfo.status = payload.status;
            currentWork.paperInfo.doPaper.modifyStatusMap = true;
            return nextState;

        //*作业学生评价*/
        case WORK_LIST.FETCH_WORK_STU_PRAISE_SUCCESS:
            currentWork = _find(nextState[payload.clzId],{instanceId:payload.instanceId});
            currentWork.paperInfo.studentPraise = lodash_assign(
                currentWork.paperInfo.studentPraise||{}
                , payload.studentPraise
            );
            return nextState;
        case WORK_LIST.FETCH_WORK_STU_PRAISE_FAILED:
            nextState.errorInfo = action.error;
            return nextState;










        //*从select_question页面点击小题, 进入do_question页面, 更新当前大题下标(bigQIndex)/小题下标(smallQIndex)和页面来源(from)*/
        case WORK_LIST.SELECT_QUESTION_CHECK_ASSIGNED_QUESTION:
            currentWork = _find(nextState[payload.clzId],{instanceId:payload.instanceId});

            currentWork.paperInfo.doPaper.bigQIndex = payload.bigQIndex;  //保存当前大题在整个试卷中的下标
            currentWork.paperInfo.doPaper.smallQIndex = payload.smallQIndex; //保存当前小题在该大题中的下标
            currentWork.paperInfo.doPaper.from = payload.from; //保存上一个页面信息
            return nextState;

        //*do_question页面初始化题目slide列表*/
        case WORK_LIST.DO_QUESTION_FILL_SLIDE_BOX_DATA:
        //*do_question题目slide列表替换时更新slideBox*/
        case WORK_LIST.DO_QUESTION_REFRESH_SLIDE_BOX_LIST:
            _find(nextState[payload.clzId],{instanceId:payload.instanceId}).paperInfo.doPaper.slideBoxDataList = payload.slideBoxDataList;
            return nextState;

        //*do_question题目保存答案时更新该题的状态*/
        case WORK_LIST.DO_QUESTION_MODIFY_QUESTION_STATUS:
            _find(nextState[payload.clzId],{instanceId:payload.instanceId}).paperInfo.doPaper.statusMapForQuestions[payload.currentSmallQId] = payload.workStatus;
            return nextState;

        //*do_question页面检查答案OK*/
        case WORK_LIST.DO_QUESTION_CHECK_QUESTION_OK:
        //*do_question页面返回到select_question页*/
        case WORK_LIST.DO_QUESTION_BACK_TO_SELECT:
            _find(nextState[payload.clzId],{instanceId:payload.instanceId}).from = payload.from;
            return nextState;

        //*do_question题目slide列表替换时更新doPaper中当前小题的信息*/
        case WORK_LIST.DO_QUESTION_REFRESH_CURRENT_SMALL_Q:
            currentWork = _find(nextState[payload.clzId],{instanceId:payload.instanceId});

            currentWork.paperInfo.doPaper.bigQIndex = payload.bigQIndex;
            currentWork.paperInfo.doPaper.smallQIndex = payload.smallQIndex;
            return nextState;


        //*是否向服务器获取试卷*/
        case APP_FLAG.CAN_FETCH_PAPER_TRUE:
            _find(nextState[payload.clzId],{instanceId:payload.instanceId}).canFetchPaper = true;
            return nextState;
        case APP_FLAG.CAN_FETCH_PAPER_FALSE:
            _find(nextState[payload.clzId],{instanceId:payload.instanceId}).canFetchPaper = false;
            return nextState;
        case APP_FLAG.CAN_FETCH_DOPAPER_TRUE:
            _find(nextState[payload.clzId],{instanceId:payload.instanceId}).canFetchDoPaper = true;
            return nextState;
        case APP_FLAG.CAN_FETCH_DOPAPER_FALSE:
            _find(nextState[payload.clzId],{instanceId:payload.instanceId}).canFetchDoPaper = false;
            return nextState;
        //当班级被删除时，需要删除与该班级相关的数据
        case WORK_LIST.DELETE_CACHED_WORK_LIST:
            let clazzArray=[],findIndex;
            for(let clazzId in nextState){
                clazzArray.push({key:clazzId,value:nextState[clazzId]});
            }
            nextState={};
            payload.forEach(dClazz=> {
                findIndex=-1;
                clazzArray.forEach((stateClazz,index)=>{
                    if(stateClazz.key===dClazz.id)
                        findIndex=index;
                });
                if(findIndex!=-1)
                    nextState[dClazz.id]=clazzArray[findIndex].value;
                else
                    nextState[dClazz.id]=null;
            });
            return nextState;
        default:
            return state;
    }
}
export default wl_clazz_list_with_works;