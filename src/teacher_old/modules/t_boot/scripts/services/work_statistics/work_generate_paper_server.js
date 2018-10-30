/**
 * Created by Administrator on 2016/8/1.
 */

import BaseService from 'baseComponentForT/base_service';
import _each from 'lodash.foreach';
import {
     FETCH_PAPER_CRITERIA_START
    ,FETCH_PAPER_CRITERIA_SUCCESS
    ,FETCH_PAPER_CRITERIA_FAIL
    ,GEN_PAPER_DATA_START
    ,GEN_PAPER_DATA_SUCCESS
    ,GEN_PAPER_DATA_FAIL
    ,PAPER_EDIT_LIST_ADD
} from './../../redux/action_typs';

class WorkGeneratePaperService extends BaseService{
    constructor(){
        super(arguments);
    }

    /**
     * 向服务器获取试卷组合标准集合
     */
    getCriteriaList(){
        return(dispatch,getState)=>{
            let defer = this.$q.defer();
            dispatch({type:FETCH_PAPER_CRITERIA_START});
            this.commonService.commonPost(this.serverInterface.GET_PAPER_CONDITION).then((data)=>{
                if(data && data.code == 200){
                    let criteriaList = [];
                    _each(data.difficulty,(v,i)=> {
                        criteriaList.push({
                            val:v.code,
                            rank:v.code == 'easy'?'基础':v.code == 'medium'?'精炼':'培优',
                            selected:i==0,
                            desc:v.desc
                        });
                    });
                    dispatch({type:FETCH_PAPER_CRITERIA_SUCCESS,payload:criteriaList });
                    return defer.resolve(true)
                }

                dispatch({type:FETCH_PAPER_CRITERIA_FAIL});
                defer.resolve(false);
            });
            return defer.promise;
        };
    }

    /**
     * 合成试卷
     */
    postGenerate(params){
        let defer = this.$q.defer();

        return (dispatch,getState)=>{
            let unitId = getState().wr_selected_unit.unitId;

            dispatch({type:GEN_PAPER_DATA_START});
            this.commonService.commonPost(this.serverInterface.AUTO_GENERATE_PAPER, params).then((data)=>{
                if(data && data.code == 200){
                    let paperInfo = {
                        id:data.paper.id,
                        title:data.paper.name,
                        createdTime:data.paper.createTime
                    };

                    dispatch({type:GEN_PAPER_DATA_SUCCESS});
                    dispatch({type: PAPER_EDIT_LIST_ADD, payload: {unitId: unitId, paperInfo: paperInfo}});

                    return defer.resolve(true)
                }
                dispatch({type:GEN_PAPER_DATA_FAIL});
                defer.resolve(false)
            });
            return defer.promise;
        };
    }
}

WorkGeneratePaperService.$inject = ['$q','$rootScope','$ngRedux','serverInterface','commonService','$timeout'];
export default WorkGeneratePaperService ;
