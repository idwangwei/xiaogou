/**
 * Created by qiyuexi on 2018/3/7.
 */
import {Service, actionCreator,Inject} from '../module';
import _find from 'lodash.find';
import _each from 'lodash.foreach';
import _sortby from 'lodash.sortby';
import {
    FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_START
    , FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_SUCCESS
    , FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_FAIL
    , SELECT_AREA_EVALUATION_TEXTBOOK_WORK
    , SELECT_AREA_EVALUATION_UNIT
    , GET_AE_LIST
    , LIST_OBJ
    , GET_AUTO_PAPER_LIST
    , SELECT_AREA_AUTO_PAPER
    , FETCH_ALL_REPORT_INFO
} from './../redux/action_types/index';
@Service('areaEvaluationService')
@Inject('$q', '$rootScope', 'commonService', 'areaEvaluationInterface', '$ngRedux')

class CreditsInfoService {
    commonService
    areaEvaluationInterface
    constructor(){
        this.cancelRequestList=[];
    }
    @actionCreator
    getTextbookList(callback) {
        let _this = this;
        callback = callback || angular.noop;
        return (dispatch,getState)=> {
            dispatch({type: FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_START});
            this.commonService.commonPost(this.areaEvaluationInterface.GET_TEXTBOOK_LIST_V2,
                {
                    depth: 4,
                    grade: getState().wl_selected_clazz.grade,
                    book: getState().wl_selected_clazz.teachingMaterial.split('-')[0].trim()
                }
            ).then((data)=>{
                if (data.code===200) {
                    _each(data.detail, (v)=> {//每一个教材版本设置展开flag(展开教材)
                        v.isOpened = false;
                        v.subTags = _sortby(v.subTags, 'seq'); //教材以seq排序
                        _each(v.subTags, (v2)=> { //每一个教材设置带版本的显示名字
                            v2.name = '【' + v.text + '】 ' + v2.text;
                            v2.subTags = _sortby(v2.subTags, 'seq');//教材章节以seq排序
                            _each(v2.subTags, function (v3) {
                                v3.subTags = _sortby(v3.subTags, 'seq'); //章节的单元以seq排序
                                v3.isOpened = false
                            });//每个教材下的单元设置展开flag(展开知识章节)
                        })

                    });
                    dispatch({type: FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_SUCCESS, payload: data.detail});
                    callback.call(_this, true);
                    return;
                }
                dispatch({type: FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_FAIL});
                callback.call(_this, false);
            },()=>{
                dispatch({type: FETCH_AREA_EVALUATION_WR_TEXTBOOK_LIST_FAIL});
                callback.call(_this, false);
            });
        }
    }

    /**
     * 选择教材
     * @param textbook
     * @param addHolidayWork true:添加寒假作业单元到当前班级对应的年级教材中
     * @returns {function(*, *)}
     */
    @actionCreator
    selectTextbook(textbook,addHolidayWork) {
        return (dispatch, getState)=> {
            let textbooks = getState().ae_textbooks;
            let selectedClazz = getState().wl_selected_clazz;
            let currentTextbook = null;

            //白名单用户默认显示当前班级的教材
            let bookVersion = null;
            let defaultTextbook = null;
            let holidayWork = null;
            let currentMonth = new Date().getMonth();
            let holidayStr = '假期作业';
            let currentBookName = this.commonService.convertToChinese(selectedClazz.grade)+"年级";
            let selectTextbook = null;
            try{
                bookVersion = _find(textbooks,{code:selectedClazz.teachingMaterial.split('-')[0]});
                defaultTextbook = _find(bookVersion.subTags, (book)=>{
                    return book.text.match(currentBookName+ ((currentMonth>0 && currentMonth<8) ? "下":"上"))
                });
                if(!defaultTextbook){
                    defaultTextbook = textbooks[0] && textbooks[0]['subTags'] && textbooks[0]['subTags'][0];
                }
            }catch (e){
                defaultTextbook = textbooks[0] && textbooks[0]['subTags'] && textbooks[0]['subTags'][0];
            }

            //指定了教材id,使用教材列表中的数据更新该教材
            if(textbook){
                _find(textbooks, (version)=> {
                    return currentTextbook = _find(version.subTags, {id: textbook.id});
                });
            }
            //更新教材成功，使用之前的教材展开标签
            if(currentTextbook){
                _each(currentTextbook.subTags, (serverUnit)=> {
                    let localUnit = _find(textbook.subTags, {id: serverUnit.id});
                    serverUnit.isOpened = localUnit && localUnit.isOpened;
                })
            }

            selectTextbook = currentTextbook || defaultTextbook;
            //当前选择班级为默认班级时，在布置作业的单元列表最后一栏添加假期作业
            if(addHolidayWork){
                holidayStr = selectTextbook.text.match('上') ? '寒假作业':'暑假作业';
                holidayWork = _find(bookVersion.subTags, (book)=>{return book.text.match(holidayStr)});

                if(holidayWork && ((currentTextbook && currentTextbook.id == defaultTextbook.id)||!currentTextbook)){
                    let currentGradeWinterWork = _find(holidayWork.subTags,(grade)=>{return grade.text.match(currentBookName)});
                    if(!_find(selectTextbook.subTags,{text:holidayStr})){
                        selectTextbook.subTags.push({
                            id:currentGradeWinterWork.id,
                            text:holidayStr,
                            subTags:currentGradeWinterWork.subTags,
                            seq:selectTextbook.subTags.length
                        })
                    }
                }

            }

            dispatch({type: SELECT_AREA_EVALUATION_TEXTBOOK_WORK, payload: {clazzId:selectedClazz.id,textbook:selectTextbook}});
        }
    }


    /**
     * 选择的当前单元
     */
    @actionCreator
    selectUnit(chapterName, unitId, unitName, isFirst) {
        return {type: SELECT_AREA_EVALUATION_UNIT, payload: {chapterName: chapterName, unitId: unitId, unitName: unitName, isFirst:isFirst}};
    }
    /**
     * 选择试卷
     */
    @actionCreator
    selectCurrentPaper(params) {
        return {type: "SELECT_AE_WORK", payload: params};
    }

    /*建立区域测评*/
    createAE(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.areaEvaluationInterface.BUILD_AREA_EVALUATION, param, true);
        this.cancelRequestList.push(post.cancelDefer);
        let request = post.cancelDefer;
        post.requestPromise.then((data)=> {
            request = null;
            if (data.code == 200) {
                defer.resolve(true);
            }
            else {
                defer.resolve(false);
            }
        }, ()=> {
            request = null;
            defer.reject();
        });
        return defer.promise;
    };
    /*获取区域测评列表*/
    @actionCreator
    getAEList(param){
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: GET_AE_LIST.GET_AE_LIST_START});
            let post = this.commonService.commonPost(this.areaEvaluationInterface.GET_AREA_EVALUATION_LIST, param, true);
            this.cancelRequestList.push(post.cancelDefer);
            let request = post.cancelDefer;
            post.requestPromise.then((data)=> {
                request = null;
                if (data.code == 200) {
                    data.availableAreaAssessmentPaper.forEach((v,k)=>{
                        let str=v.startTime;
                        let t=new Date(str.replace(/-/g,"/"));
                        let arr=["日","一","二","三","四","五","六"]
                        v.f1=str.split(" ")[1].slice(0,5);
                        v.f2="星期"+arr[t.getDay()];
                        v.f3=str.split(" ")[0];
                        v.isStart=t.getTime()<new Date().getTime();
                    })
                    let tasks=data.availableAreaAssessmentPaper;
                    tasks.sort((a,b)=>{
                        return a.startTime<b.startTime?1:-1
                    })
                    dispatch({type: GET_AE_LIST.GET_AE_LIST_SUCCESS, payload: tasks});
                    defer.resolve(tasks);
                }
                else {
                    dispatch({type: GET_AE_LIST.GET_AE_LIST_FAIL});
                    defer.resolve(false);
                }
            }, ()=> {
                dispatch({type: GET_AE_LIST.GET_AE_LIST_FAIL});
                request = null;
                defer.reject();
            });
            return defer.promise;
        }
    }
    /*获取分数区间列表*/
    @actionCreator
    getScoreTypeList(param){
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            let post = this.commonService.commonPost(this.areaEvaluationInterface.GET_SCORE_TYPE_LIST, param, true);
            this.cancelRequestList.push(post.cancelDefer);
            let request = post.cancelDefer;
            post.requestPromise.then((data)=> {
                request = null;
                if (data.code == 200) {
                    let arr=["满分","优秀","良好","及格","不及格"]
                    let tasks=data.scoreDistribution;
                    tasks.forEach((v,k)=>{
                        v.labelCN=arr[k];
                    })
                    dispatch({type: LIST_OBJ.GET_SCORE_TYPE_LIST_SUCCESS, payload: tasks});
                    defer.resolve(tasks);
                }
                else {
                    defer.resolve(false);
                }
            }, ()=> {
                request = null;
                defer.reject();
            });
            return defer.promise;
        }
    }
    /*获取试卷平均分信息*/
    @actionCreator
    getStaticsInfo(param){
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            let post = this.commonService.commonPost(this.areaEvaluationInterface.GET_SCORE_STATICS_INFO, param, true);
            this.cancelRequestList.push(post.cancelDefer);
            let request = post.cancelDefer;
            post.requestPromise.then((data)=> {
                request = null;
                if (data.code == 200) {
                    let tasks=data.rank;
                    tasks.notSubmit=tasks.totalNum-tasks.submitNum
                    dispatch({type: LIST_OBJ.GET_STATICS_INFO_SUCCESS, payload: tasks});
                    defer.resolve(tasks);
                }
                else {
                    defer.resolve(false);
                }
            }, ()=> {
                request = null;
                defer.reject();
            });
            return defer.promise;
        }
    }
    /*获取试卷参与班级列表*/
    @actionCreator
    getClazzList(param){
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            let post = this.commonService.commonPost(this.areaEvaluationInterface.GET_CLAZZ_LIST, param, true);
            this.cancelRequestList.push(post.cancelDefer);
            let request = post.cancelDefer;
            post.requestPromise.then((data)=> {
                request = null;
                if (data.code == 200) {
                    let tasks=data.classAverageScores;
                    tasks.forEach((v)=>{
                        let s=v.averageWasteTime;
                        v.averageWasteTimeD=Math.floor(s/60)+"分"+(s*100%6000/100).toFixed(0)+"秒"
                    })
                    dispatch({type: LIST_OBJ.GET_PAPER_CLAZZ_LIST_SUCCESS, payload: tasks});
                    defer.resolve(tasks);
                }
                else {
                    defer.resolve(false);
                }
            }, ()=> {
                request = null;
                defer.reject();
            });
            return defer.promise;
        }
    }

    /*获取excel相关信息*/
    getExcelInfo(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.areaEvaluationInterface.EXPORT_EXCEL, param, true);
        this.cancelRequestList.push(post.cancelDefer);
        let request = post.cancelDefer;
        post.requestPromise.then((data)=> {
            request = null;
            if (data.code == 200) {
                defer.resolve(data.excelStatus);
            }
            else {
                defer.reject(false);
            }
        }, ()=> {
            request = null;
            defer.reject();
        });
        return defer.promise;
    };

    /*获取自动组卷的试卷列表*/
    @actionCreator
    getAutoPaperList(param){
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            let post = this.commonService.commonPost(this.areaEvaluationInterface.GET_AUTO_PAPER_LIST, param, true);
            this.cancelRequestList.push(post.cancelDefer);
            let request = post.cancelDefer;
            post.requestPromise.then((data)=> {
                request = null;
                if (data.code == 200) {
                    let tasks=data.paperList;
                    dispatch({type: GET_AUTO_PAPER_LIST.GET_AUTO_PAPER_LIST_SUCCESS, payload: tasks});
                    defer.resolve(tasks);
                }
                else {
                    defer.resolve(false);
                }
            }, ()=> {
                request = null;
                defer.reject();
            });
            return defer.promise;
        }
    }
    /**
     * 选择自动组卷的试卷
     */
    @actionCreator
    selectedAutoDetailPaper(params) {
        return {type: SELECT_AREA_AUTO_PAPER, payload: params};
    }
    /*获取报表信息*/
    @actionCreator
    getAllReportInfo(param){
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            let post = this.commonService.commonPost(this.areaEvaluationInterface.GET_ALL_REPORT_INFO, param, true);
            this.cancelRequestList.push(post.cancelDefer);
            let request = post.cancelDefer;
            post.requestPromise.then((data)=> {
                request = null;
                if (data.code == 200) {
                    if(data.knowledgeMasterRateList.length>0){
                        let tasks=data;
                        var rankArr=["全国","全省","全市","全区","全校"]
                        var list1=tasks.areaAssessmentStatisticList;
                        list1.sortList.forEach((v,a)=>{
                            let k=v.sortClass/v.totalClass;
                            if(k<=0.1){
                                v.headType=1
                            }else if(k<=0.3){
                                v.headType=2
                            }else{
                                v.headType=3
                            }
                            v.rankType=rankArr[v.type]
                        })
                        list1.sortList.sort((a,b)=>{
                            return b.type-a.type
                        })
                        // list1.sortList.length=3
                        list1.classAverageTimeD=Math.floor(list1.classAverageTime/60000)+"分"+Math.floor(list1.classAverageTime%60000/1000)+"秒"
                        list1.dateD=list1.startTime.slice(5,16)+'到'+list1.stopTime.slice(5,16)
                        dispatch({type: FETCH_ALL_REPORT_INFO, payload: tasks});
                        defer.resolve(tasks);
                    }else{
                        defer.reject(false);
                    }
                }
                else {
                    defer.reject(false);
                }
            }, ()=> {
                request = null;
                defer.reject(false);
            });
            return defer.promise;
        }
    }
}

export default CreditsInfoService;
