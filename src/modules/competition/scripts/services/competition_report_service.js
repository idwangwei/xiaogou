/**
 * Created by Administrator on 2017/3/20.
 */
import BaseService from 'base_components/base_service';

class competitionReportService extends BaseService {

    constructor() {
        super(arguments);
    }

    /**
     * 获取比赛报告
     * @returns {function(*, *)}
     */
    getCompetionReport(instanceId) {
        let me = this;
        return (dispatch, getState)=> {
            let defer = me.$q.defer();
            var classId = getState().wl_selected_clazz.id;
            var params = {
                classId: classId,
                paperInstanceId: instanceId
            };
            me.commonService.commonPost(me.competitionInterface.GET_COMPETITION_REPORT_INFO, params).then((data)=> {
                defer.resolve(data);
            }, data=> {
                defer.resolve(data);
            });
            return defer.promise;
        }
    }
}

competitionReportService.$inject = ['$http', '$q', 'competitionInterface', '$rootScope', 'commonService', "$ngRedux"];
export default competitionReportService;



