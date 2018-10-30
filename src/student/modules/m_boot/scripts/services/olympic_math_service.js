/**
 * Created by 邓小龙 on 2017/3/2.
 */
import services from  './index';
import BaseService from 'base_components/base_service';
import _sortby from 'lodash.sortby';
import _each from 'lodash.foreach';
import {OLYMPIC_MATH, UNIT, PROFILE} from './../redux/actiontypes/actiontypes';
import logger from 'log_monitor';

import {
    VERTICAL_CALC_SCOREPOINT_TYPE,
    VERTICAL_ERROR_SCOREPOINT_TYPE,
    VERTICAL_FILLBLANKS_SCOREPOINT_TYPE
} from 'allereConstants/src/vertical-formula-scorepoint-type';

class OlympicMathService extends BaseService {
    constructor() {
        super(arguments);
        this.cancelOlympicMathHomeRequestList = []; //奥数主页的请求
    }

    /**
     * 改变年级
     * @param reSelectGrade
     * @returns {function()}
     */
    changeGrade(reSelectGrade) {
        return (dispatch, getState)=> {
            dispatch({type: OLYMPIC_MATH.OLYMPIC_MATH_CHANGE_GRADE, payload: reSelectGrade});
        };
    }

    /**
     * 改变班级
     * @param reSelectGrade
     * @returns {function()}
     */
    changeClazz(reSelectClazz) {
        return (dispatch, getState)=> {
            dispatch({type: OLYMPIC_MATH.OLYMPIC_MATH_CHANGE_CLAZZ, payload: reSelectClazz});
        };
    }

    /**
     * 设置作业列表的urlFrom 到store保存
     * @param reSelectGrade
     * @returns {function()}
     */
    changeUrlFromForStore(urlFrom) {
        return (dispatch, getState)=> {
            dispatch({type: OLYMPIC_MATH.CHANGE_WORK_LIST_URL_FROM, payload: {urlFrom:urlFrom}});
        };
    }

    /**
     * 获取奥数主页数据
     * @returns {function()}
     */
    fetchOlympicMathHomeData() {
        return (dispatch, getState)=> {
            dispatch({type: OLYMPIC_MATH.OLYMPIC_MATH_HOME_DATA_SUCCESS});
        };
    }

   


}

OlympicMathService.$inject = ["$ngRedux", "$timeout", "serverInterface", "verticalService", "commonService", "finalData", "ngLocalStore"];
services.service("olympicMathService", OlympicMathService);


