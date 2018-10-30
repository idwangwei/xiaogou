/**
 * Created by 彭建伦 on 2016/6/7.
 * 根据$rootScope.ip和constants中的配置生成请求的完整URL
 */
import _indexOf from 'lodash.indexof';
let getRequestURL = ($q, $rootScope, $ngRedux, finalData, needShardingUrlList) => {
    return {
        request: (config) => {
            let state = $ngRedux.getState();
            let deferred = $q.defer();

            if(config.url.indexOf('recognize')!= -1){
                deferred.resolve(config);
                return deferred.promise;

            }

            //拦截向后端发起的http请求，在需要添加sharding的URL后面加sharding参数
            if (config.url.indexOf('html') === -1
                && config.url.indexOf('js') === -1
                && config.url.indexOf('.json') === -1
                && _indexOf(needShardingUrlList,config.url) !== -1 //确定为需要添加sharding的接口
                && config.url.indexOf('shardingId') === -1
            ) {
                let shardingId = state.sharding_clazz && state.sharding_clazz.id;
                let businessType = (config.url.indexOf(finalData.BUSINESS_TYPE.RC) !== -1 && 'rc')
                    ||(config.url.indexOf(finalData.BUSINESS_TYPE.QBU) !== -1 && finalData.BUSINESS_TYPE.QBU)
                    ||(config.url.indexOf(finalData.BUSINESS_TYPE.COMPETITION) !== -1 && finalData.BUSINESS_TYPE.QBU)
                    ||(config.url.indexOf(finalData.BUSINESS_TYPE.GAME) !== -1 && finalData.BUSINESS_TYPE.GAME);

                //url后添加sharding和businessType参数
                if (shardingId && businessType) {
                    config.url = config.url
                        + '?shardingId=' + shardingId
                        + '&businessType=' + businessType;
                }
                // else if(state.wl_selected_clazz && state.wl_selected_clazz.id){
                //     config.url = config.url
                //         + '?shardingId=' + state.wl_selected_clazz.id
                //         + '&businessType=' + businessType;
                // }else if(state.profile_clazz.clazzList && state.profile_clazz.clazzList[0]){
                //     config.url = config.url
                //         + '?shardingId=' + state.profile_clazz.clazzList[0].id
                //         + '&businessType=' + businessType;
                // }
            }

            //动态添加ip
            if (config.url.indexOf('html') === -1
                && config.url.indexOf('js') === -1
                && config.url.indexOf('.json') === -1
                && $rootScope.ip
            ) {
                config.url = $rootScope.ip + config.url;
            }

            deferred.resolve(config);
            return deferred.promise;
        }
    }
};
getRequestURL.$inject = ['$q', '$rootScope', '$ngRedux', 'finalData', 'needShardingUrlList'];
export default getRequestURL;

