/**
 * Created by 彭建伦 on 2016/6/7.
 * 根据$rootScope.ip和constants中的配置生成请求的完整URL
 */
import _indexOf from 'lodash.indexof';

let getRequestURL = function ($q, $rootScope, $ngRedux, finalData, needShardingUrlList) {
    return {
        request: function (config) {
            let deferred = $q.defer();
            let state = $ngRedux.getState();

            //拦截向后端发起的http请求，在请求的URL后面加上shardingId
            if (config.url.indexOf('html') == -1
                && config.url.indexOf('js') == -1
                && config.url.indexOf('.json') == -1
                && config.url.indexOf('shardingId') == -1
                && _indexOf(needShardingUrlList, config.url) != -1 //需要sharding的接口
            ) {
                let shardingId = state.sharding_clazz && state.sharding_clazz.id;
                let businessType = (config.url.indexOf(finalData.BUSINESS_TYPE.QBU) !== -1 && finalData.BUSINESS_TYPE.QBU)
                    || (config.url.indexOf(finalData.BUSINESS_TYPE.GAME) !== -1 && finalData.BUSINESS_TYPE.GAME)
                    || (config.url.indexOf(finalData.BUSINESS_TYPE.COMPETITION) !== -1 && finalData.BUSINESS_TYPE.QBU)
                    || (config.url.indexOf(finalData.BUSINESS_TYPE.RAPID_CALCULATION.URL) !== -1 && finalData.BUSINESS_TYPE.RAPID_CALCULATION.TYPE);

                //发布作业和发布游戏shardingId为选择发布的班级id
                if (config.url.indexOf(finalData.BUSINESS_TYPE.QBU_PUB_WORK) > -1) {
                    let assignee = config.data && config.data.assignee && JSON.parse(config.data.assignee);
                    shardingId = assignee[0].groupId;//由于目前发布作业业务逻辑只能发布一个班级的，那么assignee数组内的班级只有一个。
                } else if (config.url.indexOf(finalData.BUSINESS_TYPE.PUB_GAME) > -1
                    || config.url.indexOf(finalData.BUSINESS_TYPE.CAN_PUB_GAME) > -1) {

                    shardingId = config.data && config.data.clzIds && JSON.parse(config.data.clzIds);
                }

                //url后添加sharding和businessType参数,默认为第一个普通班级的ID
                if (shardingId && businessType) {
                    config.url = config.url
                        + '?shardingId=' + shardingId
                        + '&businessType=' + businessType;
                } else if (state.wl_selected_clazz && state.wl_selected_clazz.id) {
                    config.url = config.url
                        + '?shardingId=' + state.wl_selected_clazz.id
                        + '&businessType=' + businessType;
                } else if (state.clazz_list && state.clazz_list[0]) {
                    config.url = config.url
                        + '?shardingId=' + state.clazz_list[0].id
                        + '&businessType=' + businessType;
                }
            }
            if (config.url.indexOf('html') == -1
                && config.url.indexOf('js') == -1
                && config.url.indexOf('.json') == -1
                && $rootScope.ip
            ) {
                config.url = $rootScope.ip + config.url;
            }

            if (config.url.indexOf('/rqb/question/createQuestionForTeacher') != -1) {
                let u = new URL(config.url);
                u.port = 10001;
                u.pathname = '/rqb/question/createQuestionForTeacher';
                config.url = u.href;//'http://192.168.0.35:9088/rqb/question/createQuestionForTeacher';
            }

            deferred.resolve(config);
            return deferred.promise;
        }
    }
};
getRequestURL.$inject = ['$q', '$rootScope', '$ngRedux', 'finalData', 'needShardingUrlList'];
export default getRequestURL;

