/**
 * Created by ZL on 2018/3/23.
 */
import {Service, Inject, actionCreator} from '../module';
import * as types from './../redux/action_types';
@Service('personalQBService')
@Inject('$q', 'commonService', 'teacherPersonalQbInterface', '$ngRedux')
class personalQBService {
    $q;
    commonService;
    teacherPersonalQbInterface;
    cancelSubmitQuesRequest = [];

    /**
     * 获取所有教材的所有年级
     * @returns {function(*, *)}
     */
    getTextbooksList(callBack) {
        callBack = callBack || angular.noop;
        // return (dispatch, getState)=> {
        //     let defer = this.$q.defer();
        // dispatch({type: types.BOOK_TYPE.FETCH_BOOK_TYPE_LIST_START});
        let params = {
            depth: 2,
            onlyGrade: true
        };
        this.commonService.commonPost(this.teacherPersonalQbInterface.getTextbooks, params).then((data)=> {
            if (data.code == 200) {
                // dispatch({type: types.BOOK_TYPE.FETCH_BOOK_TYPE_LIST_SUCCESS, playLoad: data.detail});
                // defer.resolve(data.detail);
                callBack(data.detail);
            } else {
                // dispatch({type: types.BOOK_TYPE.FETCH_BOOK_TYPE_LIST_FAIL});
                // defer.resolve(data.detail);
                callBack(false);
            }
        });
        // return defer.promise;
        // }
    }

    /**
     * 获取年级下的课时信息
     * @param textBook 教材
     * @param grade    年级
     * @returns {function(*, *)}
     */
    @actionCreator
    getUnitInfo(textBook, grade) {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            let params = {
                depth: 7,
                grade: grade,
                book: textBook,
                onlyGrade: true
            };
            dispatch({type: types.BOOK_TYPE.FETCH_SELECT_BOOK_INFO_START});
            this.commonService.commonPost(this.teacherPersonalQbInterface.getTextbooks, params).then((data)=> {
                if (data.code == 200) {
                    let gradeSubTags = data.detail;// TODO 正式测试时，这里返回的应该是一个年级
                    dispatch({type: types.BOOK_TYPE.FETCH_SELECT_BOOK_INFO_SUCCESS, playLoad: gradeSubTags});
                    defer.resolve(gradeSubTags);
                } else {
                    dispatch({type: types.BOOK_TYPE.FETCH_SELECT_BOOK_INFO_FAIL});
                    defer.resolve(false);
                }
            });
            return defer.promise;
        }
    }

    /**
     * 选择一个教材版本
     * @param book
     */
    @actionCreator
    selectTextbook(book, version) {
        let textbook = {};
        textbook.text = book.text;
        textbook.code = book.code;
        return (dispatch, getState)=> {
            dispatch({type: types.EDITING_QUES.SELECT_BOOK_TYPE, playLoad: {textbook: textbook, grade: version}})
        }

    }

    /**
     * 选择课时和单元
     */
    @actionCreator
    selectChapterUnit(unitInfo, chapterInfo) {
        let unit = {};
        unit.code = unitInfo.code;
        unit.id = unitInfo.id;
        unit.seq = unitInfo.seq;
        unit.text = unitInfo.text;
        return (dispatch, getState)=> {
            dispatch({type: types.EDITING_QUES.SELECT_CHAPTER_UNIT, playLoad: {unit: unitInfo, chapter: chapterInfo}})
        }
    }

    /**
     * 选择知识点
     * @param knowledge
     * @returns {function(*, *)}
     */
    @actionCreator
    selectKnowledgePoint(knowledge) {
        return (dispatch, getState)=> {
            dispatch({type: types.EDITING_QUES.SELECT_KNOWLEDGE_POINT, playLoad: {knowledge: knowledge}})
        }
    }

    /**
     * 选择难度
     */
    @actionCreator
    selectDifficultyLevel(level) {
        return (dispatch, getState)=> {
            dispatch({type: types.EDITING_QUES.SELECT_DIFFICULTY_LEVEL, playLoad: {difficulty: level}})
        }
    }


    /**
     * 添加题目到教师题库
     */
    addQuestionForTeacherLib(params) {
        // return (dispatch, getState)=> {
        let defer = this.$q.defer();
        let postInfo = this.commonService.commonPost(this.teacherPersonalQbInterface.createQuestionForTeacher, params).then((data)=> {
            if (data.code == 200) {
                defer.resolve(true);
            } else {
                defer.resolve(false);
            }
        });
        // this.cancelSubmitQuesRequest.push(postInfo);
        return defer.promise;
        // }

    }

    /**
     * 保存题干
     * @param quesTitle
     * @returns {function(*, *)}
     */
    @actionCreator
    saveQuesTitle(quesTitle) {
        return (dispatch, getState)=> {
            dispatch({type: types.QUES_CONTENT.SAVE_QUES_TITLE, playLoad: {quesTitle: quesTitle}})
        }
    }

    /**
     * 保存图片
     * @param imageList
     * @returns {function(*, *)}
     */
    @actionCreator
    saveQuesImgList(imageList) {
        return (dispatch, getState)=> {
            dispatch({type: types.QUES_CONTENT.SAVE_QUES_IMG_LIST, playLoad: {imageList: imageList}})
        }
    }

    /**
     * 保存选项
     * @param quesRightAns
     * @param quesOptionsAns
     */
    @actionCreator
    saveQuesOptions(quesRightAns, quesOptionsAns) {
        return (dispatch, getState)=> {
            dispatch({
                type: types.QUES_CONTENT.SAVE_QUES_ANS_OPTIONS,
                playLoad: {quesRightAns: quesRightAns, quesOptionsAns: quesOptionsAns}
            })
        }
    }

    /**
     * 清空选择的题目知识点相关信息
     */
    @actionCreator
    clearSelectQuesInfo() {
        return (dispatch, getState)=> {
            dispatch({type: types.EDITING_QUES.CLEAR_EDITING_QUES})
        }
    }

    /**
     * 清空 题目的题干、图片、选项信息
     */
    @actionCreator
    clearEditQuesInfo() {
        return (dispatch, getState)=> {
            dispatch({type: types.QUES_CONTENT.CLEAR_QUES_CONTENT})
        }
    }

    /**
     * 获取老师出题个数
     * @param userId
     * @returns {*}
     */
    getTeacherQbQuestionCount(userId) {
        let defer = this.$q.defer();
        this.commonService.commonPost(this.teacherPersonalQbInterface.getTeacherQbQuestionCount, {userId: userId}).then((data)=> {
            if (data.code == 200) {
                defer.resolve(data.teacherQbQuestionCount);
            } else {
                defer.resolve(false);
            }
        });
        return defer.promise;
    }

    /**
     * 教师获取自己的出题列表
     * @param userId
     */
    getQbQuestionList(userId, callBack) {
        callBack = callBack || angular.noop;
        this.commonService.commonPost(this.teacherPersonalQbInterface.getTeacherQbQuestionList, {userId: userId}).then((data)=> {
            if (data.code == 200) {
                callBack.call(this, data.teacherQbQuestionList);
            } else {
                callBack.call(this, false);
            }
        });
    }

    /**
     * 组卷
     */
    @actionCreator
    composePaper(params) {
        return (dispatch, getState)=> {
            let defer = this.$q.defer();
            dispatch({type: types.MAKE_PAPER.MAKE_PAPER_FROM_TEACHER_QB_START});
            this.commonService.commonPost(this.teacherPersonalQbInterface.makePaperFromTeacherQb, params).then((data)=> {
                if (data.code == 200) {
                    let paper = {
                        paperName: params.paperName,
                        paperId: data.paperId
                    };
                    dispatch({type: types.MAKE_PAPER.MAKE_PAPER_FROM_TEACHER_QB_SUCCESS, playLoad: paper});
                    defer.resolve(data);
                } else {
                    dispatch({type: types.MAKE_PAPER.MAKE_PAPER_FROM_TEACHER_QB_FAIL});
                    defer.resolve(data);
                }
            });
            return defer.promise;
        }
    }

    @actionCreator
    changePaperName(paperName) {
        return (dispatch, getState)=> {
            dispatch({
                type: types.MAKE_PAPER.CHANGE_NAME_MAKE_PAPER_FROM_TEACHER, playLoad: {
                    paperName: paperName
                }
            });
        }
    }

    /**
     * 清空临时试卷
     */
    @actionCreator
    clearTempMackPaper() {
        return (dispatch, getState)=> {
            dispatch({
                type: types.MAKE_PAPER.CLEAR_TEMP_MAKE_PAPER
            });
        }
    }

    /**
     * 从老师题库删除题目
     */
    deleteQuesFromTeacherQb(quesIds) {
        let params = {
            questionIds: JSON.stringify(quesIds)
        };
        let defer = this.$q.defer();
        this.commonService.commonPost(this.teacherPersonalQbInterface.deleteQuesFromTeacherQb, params).then((data)=> {
            if (data.code == 200) {
                defer.resolve(data);
            } else {
                defer.resolve(data);
            }
        });

        return defer.promise;
    }
}