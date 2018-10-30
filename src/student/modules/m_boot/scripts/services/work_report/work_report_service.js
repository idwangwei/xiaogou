/**
 * Created by ZL on 2017/6/1.
 */

import {Inject, actionCreator} from 'ngDecoratorForStudent/ng-decorator';
import {WORK_REPORT} from './../../redux/actiontypes/actiontypes';

@Inject('$q', '$rootScope', '$http', 'commonService', 'serverInterface', '$ngRedux', '$state', '$ionicBackdrop', 'profileService')
class work_report_service {
    /**
     * 获取作业报告数据 TODO
     */
    @actionCreator
    getWorkReportInfo(paperId, instanceId, classId) {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            let param = {
                paperId: paperId,
                paperInstanceId: instanceId,
                classId: classId,
                role: 'S'
            };
            let studentId = getState().profile_user_auth.user.userId;
            dispatch({type: WORK_REPORT.GET_WORK_REPORT_INFO_START});
            this.commonService.commonPostSpecial(this.serverInterface.WORK_REPORT_PAPER_ANALYSIS, param).then((data)=> {
                if (data.code === 200) {
                    // let info = data.info;
                    let analysis = data.analysis;
                    let quantityOfMasterLevel = analysis.stuId2KnowledgeMasterDict[studentId].quantityOfMasterLevel;
                    dispatch({
                        type: WORK_REPORT.GET_WORK_REPORT_INFO,
                        payload: {quantityOfMasterLevel: quantityOfMasterLevel}
                    });
                    dispatch({type: WORK_REPORT.GET_WORK_REPORT_INFO_SUCCESS});
                    let quesRecord = this.analysisQuesRecordData(analysis,studentId);
                    dispatch({type: WORK_REPORT.SAVE_WORK_QUES_RECORD, payload: quesRecord});
                } else {
                    dispatch({type: WORK_REPORT.GET_WORK_REPORT_INFO_FAIL});
                }
                defer.resolve(data);
            }, (res)=> {
                dispatch({type: WORK_REPORT.GET_WORK_REPORT_INFO});
                defer.resolve(false);
            });
            return defer.promise;
        }
    }

    /**
     *解析题目记录数据 TODO
     */
    analysisQuesRecordData(data,userId) {
        let quesRecord = {};
        let knowledgeIdArr = Object.values(data.stuId2KnowledgeMasterDict[userId].quantityOfMasterLevel);
        let knowledges = [];
        angular.forEach(knowledgeIdArr, (v, k)=> {
            knowledges = knowledges.concat(knowledgeIdArr[k]);
        });
        angular.forEach(knowledges, (value, key)=> {
            quesRecord[knowledges[key]] = data.knowledgeQuestionDict[knowledges[key]];
            if(quesRecord[knowledges[key]].unitId){
                let unidAndText = quesRecord[knowledges[key]].unitId.split('@#@');
                if(unidAndText.length>1){
                    quesRecord[knowledges[key]].unitId = unidAndText[0];
                    quesRecord[knowledges[key]].unitContent = unidAndText[1];
                }
            }
        });

        return quesRecord;
    }

    /**
     * 选择的知识点
     */
    @actionCreator
    selectWorkKnowledge(param) {
        return (dispatch)=> {
            dispatch({type: WORK_REPORT.SAVE_SELECT_WORK_KNOWLEDGE, payload: param});
        }
    }

    /**
     * 修改广告显示状态
     * @returns {function(*)}
     */
    @actionCreator
    changeDiagnoseDialogFlag(){
        return (dispatch)=> {
            dispatch({type: WORK_REPORT.CHANGE_DIAGNOSE_DIALOG_FLAG});
        }
    }

}


export default work_report_service;