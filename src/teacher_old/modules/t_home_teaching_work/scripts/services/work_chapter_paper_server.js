/**
 * Created by Administrator on 2016/8/1.
 */
import BaseService from 'baseComponentForT/base_service';
import _sortby from 'lodash.sortby';
import _each from 'lodash.foreach';
import {
    SELECT_DETAIL_PAPER
    , SELECT_EDIT_PAPER
    , PAPER_EDIT_LIST_ADD
    , FETCH_UNIT_POINTS_START
    , FETCH_UNIT_POINTS_SUCCESS
    , FETCH_UNIT_POINTS_FAIL
    , FETCH_PAPER_LIST_START
    , FETCH_PAPER_LIST_SUCCESS
    , FETCH_PAPER_LIST_FAIL
    , FETCH_MINE_PAPER_LIST_START
    , FETCH_MINE_PAPER_LIST_SUCCESS
    , FETCH_MINE_PAPER_LIST_FAIL
    , SELECT_KNOWLEDGE
    , MODIFY_MINE_PAPER_START
    , MODIFY_MINE_PAPER_SUCCESS
    , MODIFY_MINE_PAPER_FAIL
    , DELETE_SPECIFIED_MINE_PAPER


} from 'modules/t_boot/scripts/redux/action_typs';
import {
    VERTICAL_CALC_SCOREPOINT_TYPE,
    VERTICAL_ERROR_SCOREPOINT_TYPE,
    VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
} from 'allereConstants/src/vertical-formula-scorepoint-type';

class WorkChapterPaperService extends BaseService {
    oralCalculationTempQues = {};

    constructor() {
        super(arguments)
    }

    /**
     * 指定选择查看详情的试卷
     * @param paper
     * @returns {Function}
     */
    selectedDetailPaper(paper) {
        return (dispatch, getState)=> {
            dispatch({type: SELECT_DETAIL_PAPER, payload: paper})
        }
    }

    /**
     * 指定选择编辑的试卷
     * @param paper
     * @returns {Function}
     */
    selectedRedactPaper(paper) {
        return (dispatch, getState)=> {
            dispatch({type: SELECT_EDIT_PAPER, payload: paper})
        }
    }

    /**
     * 获取试卷内容
     * @param paperId
     * @param checkStuNum 是否检查班级人数超过10人
     * @returns {Function}
     */
    fetchPaper(paperId, checkStuNum) {
        let defer = this.$q.defer();
        let param = {
            id: paperId,
            publishType: 2
        };
        if (checkStuNum) {
            param.isCheckNum = 1;
        }
        this.commonService.commonPost(this.serverInterface.GET_P_DETAIL_Q_LIST, param)
            .then((data) => {
                let paper = {};
                if (data.code == 200) {
                    paper.basic = data.basic;
                    paper.qsTitles = data.qsTitles;
                    paper.tags = data.tags;


                    //TODO: ==start==公开课后待注释（将题干标有约分（{reduc}）的脱式计算，特殊处理为约分题型）
                    // _each(paper.qsTitles,(bigQ)=>{
                    //     _each(bigQ.qsList,(smallQ)=>{
                    //
                    //         if(smallQ.qContext.match(/\{reduc\}/)){
                    //             smallQ.qContext = smallQ.qContext.replace(/\{reduc\}/,'');
                    //
                    //             let $qContext = $(smallQ.qContext);
                    //             let $span = $qContext.find('.appTextarea');
                    //             $span.replaceWith(
                    //                 $(`<simplify id="${$span.attr('id')}" label="${$span.attr('label')}"></simplify>`)
                    //                     .attr('style','width:310px;min-height:100px')
                    //             );
                    //             smallQ.qContext = $qContext[0].outerHTML;
                    //         }
                    //     });
                    // });
                    //TODO: ==end==公开课后待注释（将题干标有约分（{reduc}）的脱式计算，特殊处理为约分题型）


                    this.parseQuestion(paper);
                    this.savePaperDataToLocal(paper);
                    return defer.resolve(paper);
                }
                if (data.code == 850) {
                    return defer.resolve(data);
                }
                defer.resolve(false);
            }, ()=> {
                defer.reject();
            });
        return defer.promise;
    }

    /**
     * 获取试卷内容
     * @param paperId
     * @returns {Function}
     */
    fetchEditPaper(paperId) {
        let defer = this.$q.defer();

        this.commonService.commonPost(this.serverInterface.FETCH_EDIT_PAPER_DATA, {
            sourceId: paperId,
            publishType: 6
        })
            .then((data) => {
                let paper = {};
                if (data && data.code == 200) {
                    paper.basic = data.basic;
                    paper.qsTitles = data.qsTitles;
                    paper.tags = data.tags;

                    //TODO: ==start==公开课后待注释（将题干标有约分（{reduc}）的脱式计算，特殊处理为约分题型）
                    // _each(paper.qsTitles,(bigQ)=>{
                    //     _each(bigQ.qsList,(smallQ)=>{
                    //
                    //         if(smallQ.qContext.match(/\{reduc\}/)){
                    //             smallQ.qContext = smallQ.qContext.replace(/\{reduc\}/,'');
                    //
                    //             let $qContext = $(smallQ.qContext);
                    //             let $span = $qContext.find('.appTextarea');
                    //             $span.replaceWith(
                    //                 $(`<simplify id="${$span.attr('id')}" label="${$span.attr('label')}"></simplify>`)
                    //                     .attr('style','width:310px;min-height:100px')
                    //             );
                    //             smallQ.qContext = $qContext[0].outerHTML;
                    //         }
                    //     });
                    // });
                    //TODO: ==end==公开课后待注释（将题干标有约分（{reduc}）的脱式计算，特殊处理为约分题型）


                    this.parseQuestion(paper);
                    this.savePaperDataToLocal(paper);
                    return defer.resolve(paper);
                }
                defer.resolve(false);
            }, (data)=> {
                defer.reject(data)
            });
        return defer.promise;
    }

    /**
     * 解析竖式
     * @param paper
     */
    parseQuestion(paper) {
        paper.qsTitles = _sortby(paper.qsTitles, 'seqNum');
        paper.qsTitles.forEach((item)=> {
            item.qsList = _sortby(item.qsList, 'seqNum');
            item.qsList.forEach(qs=> {
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
        });
    }

    /**
     * 将试卷加入我的编辑页
     * @param unitId 所在单元ID
     * @param paper 需要加入编辑的试卷
     * @returns {Function|promise}
     */
    addBackupWork(unitId, paper) {
        return (dispatch, getState)=> {
            var defer = this.$q.defer();
            var params = {
                tagId: unitId,
                sourceId: paper.basic.id,
                type: this.getRootScope().homeOrClazz.type
            };
            this.commonService.commonPost(this.serverInterface.ADD_TEXTBOOK_PAPER_TO_MINE, params).then((data)=> {
                if (data && data.code == 200) {

                    paper.basic.id = data.paper.id;
                    paper.basic.createTime = data.paper.createTime;
                    paper.basic.description = '我的编辑';
                    this.savePaperDataToLocal(paper);
                    let paperInfo = {
                        id: data.paper.id,
                        title: data.paper.name,
                        //description: data.paper.,
                        createdTime: data.paper.createTime
                    };
                    dispatch({type: PAPER_EDIT_LIST_ADD, payload: {unitId: unitId, paperInfo: paperInfo}});
                    dispatch({type: SELECT_EDIT_PAPER, payload: paperInfo});

                    return defer.resolve(true);
                }
                defer.resolve(false);
            });
            return defer.promise;
        }
    };

    ///**
    // * 更新编辑的试卷内容
    // * @param paper
    // * @returns {promise}
    // */
    //updatePaperInfo (paper) {
    //    var param = {
    //        id: this.backupWork.id,
    //        paperInfo: JSON.stringify(paper),
    //        name: paper.basic.title,
    //        publishType:6
    //    };
    //    return this.commonService.commonPost(this.serverInterface.UPDATE_PAPER_INFO, param);
    //}

    /**
     * 根据知识点信息向服务器获取相关小题集合
     */
    getSmallQByPointInfo() {


    }

    /**
     * 根据单元ID获取单元下所有的知识点总列表
     * @param unitId
     * @returns {Function}
     */
    getTextPointsByUnitId(unitId) {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();

            dispatch({type: FETCH_UNIT_POINTS_START});
            this.commonService.commonPost(this.serverInterface.GET_UNIT_TEXT_POINTS, {id: unitId}).then((data)=> {
                if (angular.isArray(data) && data.length > 0) {
                    _each(data, (point)=> {
                        point.isOpened = true;
                        point.subTags = _sortby(point.subTags, 'text');
                    });

                    data = _sortby(data, 'text');


                    dispatch({type: FETCH_UNIT_POINTS_SUCCESS, payload: {list: data, id: unitId}});
                    defer.resolve(true);
                } else {
                    dispatch({type: FETCH_UNIT_POINTS_FAIL});
                    defer.resolve(false);
                }
            });
            return defer.promise;
        }
    }

    /**
     * 根据单元Id获取所用的试卷列表
     * @param unitId
     */
    getPaperList(unitId) {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            let condition = {
                "tagName": "",         //根据标签名模糊查询。为空表示全匹配
                "paperName": "",       //根据试卷名模糊查询。为空表示全匹配
                "tagIds": [unitId]           //根据标签ID查找。可以不赋值，但必须保留结构
            };
            let page = {
                "curPage": '',    //查询的当前页
                "perSize": '',    //每页显示的数目
                "sort": '',       //排序方式。asc升序；desc降序。可为空，表示升序
                "order": ""       //排序的属性
            };
            let param = {'condition': JSON.stringify(condition), 'page': JSON.stringify(page)};
            dispatch({type: FETCH_PAPER_LIST_START});
            this.commonService.commonPost(this.serverInterface.GET_LIB_LIST, param).then(function (data) {
                if (data) {
                    dispatch({
                        type: FETCH_PAPER_LIST_SUCCESS,
                        payload: {unitId: unitId, paperList: data.items, needHideRapid: data.needHideRapid}
                    });
                    defer.resolve(true);
                    return;
                }
                dispatch({type: FETCH_PAPER_LIST_FAIL});
                defer.resolve(false);
            });
            return defer.promise;
        }
    }

    /**
     * 根据单元Id获取所用的试卷列表
     * @param unitId
     * @param isLoadMore 是否是加载更多
     */
    getMinePaperList(unitId, isLoadMore) {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            let param = {
                publishType: 6,
                tagId: unitId,
                size: getState().wr_chapter_with_paperlist.minePageInfo.size,
                lastKey: ""
            };
            if (isLoadMore) {
                param.lastKey = getState().wr_chapter_with_paperlist.minePageInfo.lastKey
            }


            dispatch({type: FETCH_MINE_PAPER_LIST_START});
            this.commonService.commonPost(this.serverInterface.FETCH_EDIT_PAPER_LIST, param).then(function (data) {
                if (data && data.code == 200) {
                    let mineList = [];
                    _each(data.papers, (paperInfo)=> {
                        mineList.push({
                            id: paperInfo.id,
                            title: paperInfo.name,
                            createdTime: paperInfo.createTime
                        })
                    });

                    dispatch({
                        type: FETCH_MINE_PAPER_LIST_SUCCESS
                        , payload: {
                            unitId: unitId
                            , mine: mineList
                            , isLoadMore: isLoadMore
                        }
                    });
                    defer.resolve({canLoadMore: data.papers.length >= param.size});
                    return;
                }
                dispatch({type: FETCH_MINE_PAPER_LIST_FAIL});
                defer.resolve(false);
            });

            return defer.promise;
        }
    }


    /**
     * 根据知识点Id向服务器查询相关小题集合
     * @param condition
     * @returns {promise}
     */
    getSmallQListByKnowledgeId(condition) {
        let page = JSON.stringify(condition.page);

        return this.commonService.commonPost(
            this.serverInterface.GET_SMALLQ_LIST_BY_KNOWLEDGE_ID
            , {condition: JSON.stringify(condition), page: page}
        );
    }


    /**
     * 选择的当前单元
     */
    selectKnowledge(knowledge) {
        return (dispatch, getState)=> {
            dispatch({type: SELECT_KNOWLEDGE, payload: knowledge});
        }
    }

    /**
     * 保存试卷编辑
     * @param params
     * @returns {promise}
     */
    savePaper(params) {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: MODIFY_MINE_PAPER_START});
            this.commonService.commonPost(this.serverInterface.MODIFY_EDIT_PAPER_DATA, params).then((data)=> {
                if (data && data.code == 200) {
                    dispatch({type: MODIFY_MINE_PAPER_SUCCESS});
                    let paper = this.ngLocalStore.getTempPaper();

                    //如果该试卷已被发布过，则新生成一张试卷
                    if (data.paper) {
                        paper.data.basic.id = data.paper.id;
                        paper.data.basic.title = data.paper.name;
                        paper.data.basic.createdTime = data.paper.createTime;
                    }
                    this.modifyLocalPaperData(paper.data);
                    defer.resolve(true)
                }
                else {
                    dispatch({type: MODIFY_MINE_PAPER_FAIL});
                    defer.resolve(false)
                }
            });
            return defer.promise;
        }
    }


    /**
     * 返回答题的题号加名称 的中文字符串
     * @param bigQ
     * @returns {string}
     */
    getBigQText(bigQ) {
        return this.commonService.convertToChinese(+bigQ.seqNum + 1) + '、' + bigQ.title;
    }

    /**
     * 删除编辑试卷
     */
    deletePaper(paperId, unitId) {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            this.commonService.commonPost(this.serverInterface.DELETE_MINE_PAPER, {sourceId: paperId}).then((data)=> {
                if (data && data.code == 200) {
                    dispatch({type: DELETE_SPECIFIED_MINE_PAPER, payload: {paperId: paperId, unitId: unitId}});
                    this.deleteLocalPaperData(paperId);
                }
                defer.resolve(data)
            });
            return defer.promise;
        }
    }


    /**
     * 保存试卷的编辑到本地
     * @param paper
     * @param onlyTemp
     * @returns {*}
     */
    savePaperDataToLocal(paper, onlyTemp) {
        this.ngLocalStore.setTempPaper(this.getRootScope().user.loginName + '/' + paper.basic.id, paper);
        if (onlyTemp) {
            return
        }
        return this.ngLocalStore.paperStore.setItem(this.getRootScope().user.loginName + '/' + paper.basic.id, paper).then(()=> {
            console.log('save papercontent to local store success!')
        });
    }

    modifyLocalPaperData(paper) {
        this.ngLocalStore.paperStore.setItem(this.getRootScope().user.loginName + '/' + paper.basic.id, paper).then(()=> {
            console.log('save papercontent to local store success!')
        });
    }

    deleteLocalPaperData(paperId) {
        this.ngLocalStore.paperStore.removeItem(this.getRootScope().user.loginName + '/' + paperId).then(()=> {
            console.log('delete papercontent to local store success!')
        });
    }


    /**
     * 获取子级知识点的父级知识点信息
     * @param ids
     * @returns {promise}
     */
    getParentPointInfo(ids) {
        return this.commonService.commonPost(this.serverInterface.GET_PARENT_POINT_LIST, {ids: ids})
    }

    /**
     * 生成口算题
     */
    produceOralCalculation(userId, tagId, questionNumber, limitTime, isHandwrite) {
        let defer = this.$q.defer();
        this.commonService.commonPost(this.serverInterface.PRODUCE_ORAL_CALCULATION, {
            uId: userId,
            tagId: tagId,
            questionNumber: questionNumber,
            limitTime: limitTime,
            type:isHandwrite?11:10
        }).then((data)=> {
            defer.resolve(data);
        }, (err)=> {
            defer.resolve(false);
        });
        return defer.promise;
    }

    /**
     * 检查班级人数是都满10人
     */
    checkClassStudentCount(isFirst) {
        let defer = this.$q.defer();
        let param = {};
        if (!isFirst) {
            param.isCheckNum = 1;
        }
        this.commonService.commonPost(this.serverInterface.CHECK_CLASS_STU_NUM, param).then((data)=> {
            defer.resolve(data);
        }, (err)=> {
            defer.resolve(false);
        });
        return defer.promise;
    }

}

WorkChapterPaperService.$inject = ['$q',
    '$rootScope',
    '$ngRedux',
    'serverInterface',
    'commonService',
    'ngLocalStore'
];
export default WorkChapterPaperService ;
