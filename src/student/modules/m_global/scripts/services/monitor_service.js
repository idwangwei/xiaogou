/**
 * Created by qiyuexi on 2018/2/2.
 */
/**
 * Created by qiyuexi on 2017/12/8.
 */
import {Service, actionCreator,Inject} from '../module';
@Service('monitorService')
@Inject('$q', '$rootScope', 'commonService', 'serverInterface', '$ngRedux', '$state')
class MonitorService {
    serverInterface;
    commonService
    constructor() {
        this.cancelRequestList = [];
    }

    /**
     * 获取测评广告信息
     */
    fetchMonitorInfo(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.serverInterface.MONITOR_GET_INFO, param, true);
        this.cancelRequestList.push(post.cancelDefer);
        let request = post.cancelDefer;
        post.requestPromise.then((data)=> {
            request = null;
            if (data.code == 200) {
                defer.resolve(data.areaAssessmentAdvertisement);
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
    /**
     * 获取直播广告信息
     */
    fetchLiveAdInfo(param) {
        let defer = this.$q.defer();
        let post = this.commonService.commonPost(this.serverInterface.LIVE_GET_INFO, param, true);
        this.cancelRequestList.push(post.cancelDefer);
        let request = post.cancelDefer;
        post.requestPromise.then((data)=> {
            request = null;
            if (data.code == 200) {
                var d=data.result;
                var arr=["日","一","二","三","四","五","六"];
                var startTime=new Date(d.startTime.replace(/-/g,"/"));
                d.showTime=d.startTime.slice(0,10)+" （周"+arr[startTime.getDay()]+"）"+d.startTime.slice(11,16)
                defer.resolve(d);
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
}

export default MonitorService;