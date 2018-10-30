/**
 * Created by ZL on 2018/2/26.
 */
import {Service, Inject, actionCreator} from '../module';
import {PUB_ORAL_WORK_DIFF_UNIT} from './../redux/action_typs';
import {
    VERTICAL_CALC_SCOREPOINT_TYPE,
    VERTICAL_ERROR_SCOREPOINT_TYPE,
    VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
} from 'allereConstants/src/vertical-formula-scorepoint-type';
@Service('oralAssemblePaperService')
@Inject("$q", "workPublish4Interface", "commonService", '$ngRedux')
class oralAssemblePaperService {
    $q;
    $ngRedux;
    commonService;
    workPublish4Interface;

    parseQuestion(qsList) {
        // paper.qsTitles = _sortby(paper.qsTitles, 'seqNum');
        // paper.qsTitles.forEach((item)=> {
        //     item.qsList = _sortby(item.qsList, 'seqNum');
        qsList.forEach(qs=> {

            qs.inputList = [];
            let answerKey = JSON.parse(qs.answerKey);
            let isVerticalSp = type=>type == VERTICAL_CALC_SCOREPOINT_TYPE || type == VERTICAL_ERROR_SCOREPOINT_TYPE || type == VERTICAL_FILLBLANKS_SCOREPOINT_TYPE;
            let addMatrixToVerticalFormulaService = (anskey)=> {
                anskey.scorePoints.forEach(sp=> {
                    let spInfo = {};
                    spInfo.spList = [];
                    sp.referInputBoxes.forEach(inputbox=> {
                        let uuid = inputbox.uuid;
                        let answerMatrixList = [];
                        let presetMatrix = null;//竖式改错的矩阵
                        let getPresetMatrix = (matrixInfo)=> {
                            let rt = null;
                            Object.keys(matrixInfo).forEach(key=> {
                                if (key != 'preset' && matrixInfo[key] instanceof Array) {
                                    rt = {verticalId: key, matrix: matrixInfo[key]};
                                }
                            });
                            return rt;
                        };
                        if (!inputbox.info) { //如果不是竖式改错打勾叉
                            let vfMatrix = anskey.vfMatrix;
                            if (vfMatrix && vfMatrix.length) {
                                vfMatrix.forEach(matrixInfo=> {
                                    if (matrixInfo.preset)
                                        presetMatrix = getPresetMatrix(matrixInfo);
                                });
                                vfMatrix.forEach(matrixInfo=> {
                                    if (matrixInfo[uuid]) {
                                        let spListItem = {
                                            inputBoxUuid: uuid,
                                            scorePointId: sp.uuid,
                                            matrix: matrixInfo[uuid],
                                            type: anskey.type
                                        };
                                        if (presetMatrix && presetMatrix.matrix && presetMatrix.matrix.length)
                                            spListItem.presetMatrixInfo = presetMatrix;
                                        spInfo.spList.push(spListItem);
                                    }
                                });
                            } else {
                                let spListItem = {
                                    inputBoxUuid: uuid,
                                    scorePointId: sp.uuid,
                                    type: anskey.type
                                };
                                spInfo.spList.push(spListItem);
                            }
                        } else {
                            spInfo.spList.push({
                                inputBoxUuid: uuid,
                                scorePointId: sp.uuid,
                                currentQSelectItem: inputbox.info.selectItem,
                            });
                        }
                    });
                    qs.inputList.push(spInfo);
                });
            };
            answerKey.forEach((ans)=> {
                if (isVerticalSp(ans.type))
                    addMatrixToVerticalFormulaService(ans);
            });
        });
        // });
    }

    /**
     * 根据选择生成试题
     */
    @actionCreator
    getComposePaperQues(tempPaperSetParams, type) {
        let mode = type || 1;
        let param = {
            tempPaperSetParams: JSON.stringify(tempPaperSetParams),
            qReplaceMode: 1
        };
        return (dispatch, getState) => {
            let defer = this.$q.defer();
            dispatch({type: PUB_ORAL_WORK_DIFF_UNIT.FETCH_TEMP_ORAL_PAPER_QUES_START});
            this.commonService.commonPost(this.workPublish4Interface.GET_TEMP_ORAL_PAPER_QUES, param).then((data) => {
                if (data.code === 200) {
                    let periodQuestionMapItems = data.periodQuestionMapItems;
                    let tempPaperSetParams = [];
                    angular.forEach(periodQuestionMapItems, (v, k)=> {
                        if (!tempPaperSetParams[k]) tempPaperSetParams[k] = {};
                        tempPaperSetParams[k].tagId = periodQuestionMapItems[k].periodTagId;
                        tempPaperSetParams[k].periodTagName = periodQuestionMapItems[k].periodTagName;
                        tempPaperSetParams[k].includeQIds = [];
                        tempPaperSetParams[k].selectedQIds = [];
                        tempPaperSetParams[k].questionNum = periodQuestionMapItems[k].questions.length;
                        angular.forEach(periodQuestionMapItems[k].questions, (v1, k1)=> {
                            if (v1.referAnswer && typeof v1.referAnswer != 'object') {
                                v1.referAnswer = JSON.parse(v1.referAnswer);
                            } else {
                                v1.referAnswer = v1.referAnswer;
                            }
                            // tempPaperSetParams[k].includeQIds.push(v1.integrateQuestionItem.id);
                        });
                        this.parseQuestion(periodQuestionMapItems[k].questions);
                    });
                    dispatch({
                        type: PUB_ORAL_WORK_DIFF_UNIT.FETCH_TEMP_ORAL_PAPER_QUES_SUCCESS,
                        payload: {
                            selectBookText: getState().wl_selected_clazz.teachingMaterial,
                            setParams: tempPaperSetParams,
                            periodQuestionMapItems: periodQuestionMapItems,
                            paperName: data.paperName
                        }
                    });

                    defer.resolve(true);
                } else {
                    dispatch({type: PUB_ORAL_WORK_DIFF_UNIT.FETCH_TEMP_ORAL_PAPER_QUES_FAIL});
                    defer.resolve(false, data.msg);
                }

            }, (res) => {
                dispatch({type: PUB_ORAL_WORK_DIFF_UNIT.FETCH_TEMP_ORAL_PAPER_QUES_FAIL});
                defer.resolve(false);
            });
            return defer.promise;
        }
    }

    /**
     * 根据选择生成试卷
     */
    @actionCreator
    composePaper(params) {
        return (dispatch, getState) => {
            let defer = this.$q.defer();
            dispatch({type: PUB_ORAL_WORK_DIFF_UNIT.COMPOSE_ORAL_MULTI_UNIT_PAPER_START});
            this.commonService.commonPost(this.workPublish4Interface.GET_ORAL_MULTI_UNITS_PAPER, params).then((data) => {
                if (data.code === 200) {
                    dispatch({
                        type: PUB_ORAL_WORK_DIFF_UNIT.COMPOSE_ORAL_MULTI_UNIT_PAPER_SUCCESS,
                        payload: {paper: data.paper}
                    });
                    defer.resolve(true);
                } else {
                    dispatch({type: PUB_ORAL_WORK_DIFF_UNIT.COMPOSE_ORAL_MULTI_UNIT_PAPER_FAIL});
                    defer.resolve(false, data.msg);
                }

            }, (res) => {
                dispatch({type: PUB_ORAL_WORK_DIFF_UNIT.COMPOSE_ORAL_MULTI_UNIT_PAPER_FAIL});
                defer.resolve(false);
            });
            return defer.promise;
        }
    }


    /**
     * 删除选择的试题
     */
    @actionCreator
    deleteSelectQues(tempPaperSetParams, periodQuestionMapItems) {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({
                type: PUB_ORAL_WORK_DIFF_UNIT.CHANGE_ORAL_PAPER_SET_PARAMS, payload: {
                    setParams: tempPaperSetParams,
                    periodQuestionMapItems: periodQuestionMapItems,
                }
            });
            defer.resolve(true);
            return defer.promise;
        }
    }

    /**
     * 修改试卷名
     */
    @actionCreator
    changePaperName(paperName) {
        return (dispatch, getState)=> {
            dispatch({
                type: PUB_ORAL_WORK_DIFF_UNIT.CHANGE_ORAL_PAPER_NAME, payload: {
                    paperName: paperName
                }
            });
        }
    }


    /**
     * 成功的试题
     */
    @actionCreator
    pubPaperSucceed() {
        return (dispatch, getState)=> {
            dispatch({
                type: PUB_ORAL_WORK_DIFF_UNIT.CHANGE_ORAL_PAPER_SET_PARAMS, payload: {
                    setParams: [],
                    periodQuestionMapItems: [],
                }
            });
        }
    }

    /**
     * 清空本地的试题数据
     */
    @actionCreator
    clearPaperDate() {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({
                type: PUB_ORAL_WORK_DIFF_UNIT.CHANGE_ORAL_PAPER_SET_PARAMS, payload: {
                    setParams: [],
                    periodQuestionMapItems: [],
                    tempPaperSetParams: '',
                    paperName: '',
                }
            });
            defer.resolve(true);
            return defer.promise;
        }
    }

}


export default oralAssemblePaperService;