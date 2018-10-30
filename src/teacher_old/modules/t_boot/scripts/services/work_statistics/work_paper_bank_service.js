/**
 * Created by Administrator on 2016/8/2.
 */
import BaseService from 'baseComponentForT/base_service';
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';
import _find from 'lodash.find';
import _each from 'lodash.foreach';
import _sortby from 'lodash.sortby';
import {
    FETCH_WR_TEXTBOOK_LIST_START
    , FETCH_WR_TEXTBOOK_LIST_SUCCESS
    , FETCH_WR_TEXTBOOK_LIST_FAIL
    , SELECT_TEXTBOOK_WORK
    , SELECT_UNIT
} from './../../redux/action_typs';

@Inject("$q", "serverInterface", "commonService", '$ngRedux')
class WorkPaperBankService {
    $q;
    $ngRedux;
    commonService;
    serverInterface;

    /**
     * 获取所有的教材列表
     */
    @actionCreator
    getTextbookList(callback, type, noVacation) {
        let _this = this;
        callback = callback || angular.noop;
        return (dispatch, getState)=> {
            let param = {
                depth: 4,
                grade: getState().wl_selected_clazz.grade,
                book: getState().wl_selected_clazz.teachingMaterial.split('-')[0].trim()
            };
            if (type) param.type = type;
            if (noVacation) param.noVacation = noVacation;
            dispatch({type: FETCH_WR_TEXTBOOK_LIST_START});
            this.commonService.commonPost(this.serverInterface.GET_TEXTBOOK_LIST_V2, param).then((data)=> {
                if (data.code === 200) {
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
                    dispatch({type: FETCH_WR_TEXTBOOK_LIST_SUCCESS, payload: data.detail});
                    callback.call(_this, true);
                    return;
                }
                dispatch({type: FETCH_WR_TEXTBOOK_LIST_FAIL});
                callback.call(_this, false);
            }, ()=> {
                dispatch({type: FETCH_WR_TEXTBOOK_LIST_FAIL});
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
            let textbooks = getState().wr_textbooks;
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

            dispatch({type: SELECT_TEXTBOOK_WORK, payload: {clazzId:selectedClazz.id,textbook:selectTextbook}});
        }
    }


    /**
     * 选择的当前单元
     */
    @actionCreator
    selectUnit(chapterName, unitId, unitName, isFirst) {
        return {type: SELECT_UNIT, payload: {chapterName: chapterName, unitId: unitId, unitName: unitName, isFirst:isFirst}};
    }

}


export default WorkPaperBankService;