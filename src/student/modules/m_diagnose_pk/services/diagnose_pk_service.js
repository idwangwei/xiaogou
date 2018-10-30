/**
 * Created by ZL on 2018/1/4.
 */
import {Inject, actionCreator} from '../module';
@Inject("$ngRedux"
    , "$timeout"
    , "serverInterface"
    , "verticalService"
    , "commonService"
    , "finalData"
    , "ngLocalStore"
    , '$rootScope'
    , '$q')
class diagnosePkService {
    /**
     * 获取驯宠大战数据
     */
    getDiagnosePkInfo(callBack) {
        callBack = callBack || angular.noop;
        let postInfo = this.commonService.commonPost(this.serverInterface.DIAGNOSE_RANKING_INFO, null, true);
        postInfo.requestPromise.then((data)=> {
            callBack(data);
        }, ()=> {
            callBack(false);
        });
    }

    getDiagnosePkLiveInfo(callBack) {
        callBack = callBack || angular.noop;
        let param = {
            publishType: -1,
            limit: 10
        };
        this.commonService.commonPost(this.serverInterface.GET_WINTER_BROADCAST_DATA, param).then((data)=> {
            callBack(data);
        }, ()=> {
            callBack(false);
        });
    }

    /**
     * 获取昨日或前日前五名奖励
     * @param callBack
     */
    getLastDiagnoseTop5(grade,topType,callBack){
        callBack = callBack || angular.noop;
        let param = {
            grade:grade,
            topType:topType
        };
        this.commonService.commonPost(this.serverInterface.GET_LAST_TOP_FIVE, param).then((data)=> {
            callBack(data);
        }, ()=> {
            callBack(false);
        });
    }

    /**
     * 获取前五名奖励
     * @param callBack
     */
    getDiagnoseTop5Award(grade,callBack){
        callBack = callBack || angular.noop;
        let param = {
            grade:grade
        };
        this.commonService.commonPost(this.serverInterface.DIAGNOSE_CHAMPION_GET_CREDITS, param).then((data)=> {
            callBack(data);
        }, ()=> {
            callBack(false);
        });
    }
}
export default diagnosePkService;