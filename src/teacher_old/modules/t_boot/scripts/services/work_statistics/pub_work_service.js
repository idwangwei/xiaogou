/**
 * Created by ZL on 2017/10/25.
 */
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';
import _find from 'lodash.find';
import _each from 'lodash.foreach';
import _sortby from 'lodash.sortby';
import {PUB_WORK_DIFF_UNIT} from './../../redux/action_typs';
import {
    VERTICAL_CALC_SCOREPOINT_TYPE,
    VERTICAL_ERROR_SCOREPOINT_TYPE,
    VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
} from 'allereConstants/src/vertical-formula-scorepoint-type';

@Inject("$q", "serverInterface", "commonService", '$ngRedux')
class pubWorkService {
    $q;
    $ngRedux;
    commonService;
    serverInterface;

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
            qReplaceMode: mode
        };
        return (dispatch, getState) => {
            let defer = this.$q.defer();
            dispatch({type: PUB_WORK_DIFF_UNIT.FETCH_TEMP_PAPER_QUES_START});
            this.commonService.commonPost(this.serverInterface.GET_TEMP_PAPER_QUES, param).then((data) => {
                if (data.code === 200) {
                    let quesList = data.questions;
                    angular.forEach(quesList, (v, k)=> {
                        if (quesList[k].referAns && typeof quesList[k].referAns != 'object') {
                            quesList[k].referAns = JSON.parse(quesList[k].referAns);
                        } else {
                            quesList[k].referAns = quesList[k].referAns;
                        }
                    });
                    let setParams = data.tempPaperSetParams;
                    angular.forEach(setParams, (v, k)=> {
                        setParams[k].selectedQIds.length = 0;
                    });
                    this.parseQuestion(quesList);
                    dispatch({
                        type: PUB_WORK_DIFF_UNIT.FETCH_TEMP_PAPER_QUES_SUCCESS,
                        payload: {
                            setParams: setParams,
                            quesList: quesList,
                            paperName: data.paperName
                        }
                    });
                    defer.resolve(true);
                } else {
                    dispatch({type: PUB_WORK_DIFF_UNIT.FETCH_TEMP_PAPER_QUES_FAIL});
                    defer.resolve(false, data.msg);
                }

            }, (res) => {
                dispatch({type: PUB_WORK_DIFF_UNIT.FETCH_TEMP_PAPER_QUES_FAIL});
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
            dispatch({type: PUB_WORK_DIFF_UNIT.COMPOSE_MULTI_UNIT_PAPER_START});
            this.commonService.commonPost(this.serverInterface.GET_MULTI_UNITS_PAPER, params).then((data) => {
                if (data.code === 200) {
                    dispatch({
                        type: PUB_WORK_DIFF_UNIT.COMPOSE_MULTI_UNIT_PAPER_SUCCESS,
                        payload: {paper: data.paper}
                    });
                    defer.resolve(true);
                } else {
                    dispatch({type: PUB_WORK_DIFF_UNIT.COMPOSE_MULTI_UNIT_PAPER_FAIL});
                    defer.resolve(false, data.msg);
                }

            }, (res) => {
                dispatch({type: PUB_WORK_DIFF_UNIT.COMPOSE_MULTI_UNIT_PAPER_FAIL});
                defer.resolve(false);
            });
            return defer.promise;
        }
    }


    /**
     * 删除选择的试题
     */
    @actionCreator
    deleteSelectQues(tempPaperSetParams, questions) {
        return (dispatch, getState)=> {
            dispatch({
                type: PUB_WORK_DIFF_UNIT.CHANGE_PAPER_SET_PARAMS, payload: {
                    setParams: tempPaperSetParams,
                    quesList: questions,
                }
            });
        }
    }

    /**
     * 删除选择的试题
     */
    @actionCreator
    changePaperName(paperName) {
        return (dispatch, getState)=> {
            dispatch({
                type: PUB_WORK_DIFF_UNIT.CHANGE_PAPER_NAME, payload: {
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
                type: PUB_WORK_DIFF_UNIT.CHANGE_PAPER_SET_PARAMS, payload: {
                    setParams: {},
                    quesList: {},
                }
            });
        }
    }

}


export default pubWorkService;