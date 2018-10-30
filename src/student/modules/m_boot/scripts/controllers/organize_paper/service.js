import services from  '../../services/index';
import BaseService from 'base_components/base_service';
import {GET_MATH_PAPER, MATH_PAPER_SUCCESS, MATH_PAPER_FAILED}
    from '../../redux/actiontypes/actiontypes'

class MathPaperService extends BaseService {

    constructor() {
        super(arguments);
        this.organizePaperUrlFrom = '';
    }
    postData(url, body){
        return fetch(url || 'http://localhost:3030/get-math-paper',{
            method: 'POST',
            body: '',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            cache: 'default'
        }).then((response) => response.json())
    }
    getInfoData( params ){
        return (dispatch, getState) => {
            params = {
                depth: 5,
                grade: 0,        //后端要求写死为0
                book: 'AS',
                bookCode: getState().olympic_math_selected_grade.num,   //当前选择的册数
            }
            dispatch({type: GET_MATH_PAPER});
            return this.commonService.commonPost('/qb/ptag/getTextbooks_v2', params)
                .then((data) => {
                    dispatch({type: MATH_PAPER_SUCCESS})
                    console.log(data);
                    try{
                        if(data.code == 200){
                            var realData = data.detail;
                            var arr =  realData[0].subTags[0].subTags[0].subTags.map((item, index) => {
                                return {
                                    id: item.id,
                                    name: item.text.replace(/^\d+\./, ''),
                                    index: item.seq,
                                    seq: item.seq,
                                    code: item.code
                                }
                            }).filter((item) => !/^AS[\-\d]+50$/.test(item.code) )  //返回不包含 code : AS***50的内容

                            arr.sort((a,b) => a.seq - b.seq);
                            return arr;
                        }
                    }catch(err){
                        console.error(err);
                        return false;
                    }

                })
        }
    }
    organizePaper(params){
        var url = '/qus/api/practice/new';
        params.type=9;
       return this.commonService.commonPost(url, params )
            .then(data => {
                console.log(data);
                return data;
            })
    }
    getPaperDetail(id, curPage) {
        return (dispatch, getState) => {
            dispatch({type: 'GET_PAPER_DETAIL'});
            var params,condition,page;
            condition = {
                tagIds: [id],
                content: ''
            }
            page = {
                curPage: curPage,
                perSize: 15,
                sort: 'desc',
                order: 'createdTime'
            }
            params = {
                condition: JSON.stringify(condition),
                page: JSON.stringify(page)
            }
            return  this.commonService.commonPost('/dqb/question/list', params)
                .then((data) => {
                    console.log(data);
                    return data.items;
                })
        }
    }
    getPracticeInfo(params){
        return (dispatch, getState) => {
            dispatch({type: 'GET_PERSONAL_INFO'});
            return this.commonService.commonPost('/qus/api/studyStatistics/student/classDetail', params).then(data => {
                console.log(data);
                if(data.code == 200){
                    return data
                }else{
                    return false;
                }
            })
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
    /*
    * 获取奥数个人学情
    * */
    getPersonalInfo(params){
        return (dispatch, getState) => {
            dispatch({type: 'GET_PERSONAL_INFO'});
            let currentSelectedId = getState().olympic_math_selected_clazz.id;
            return  this.commonService
                .commonPost(this.serverInterface.GET_CLAZZ_STUDY_STATISC_NEW, params)
                .then((data) => {
                    console.log(data);
                    if(data.code == 200){
                        return data
                    }else{
                        return false;
                    }
                })
        }
    }

}

MathPaperService.$inject = ['$http', '$q', '$rootScope',  'serverInterface', 'commonService', "$ngRedux"];
services.service('mathPaperService', MathPaperService);