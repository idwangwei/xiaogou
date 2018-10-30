/**
 * Created by 彭建伦 on 2016/6/7.
 * 在所有想后端发起的请求后统一加上jsessionid
 */
let appendJSessionId = function ($q, $rootScope) {
    return {
        request: function (config) {
            var deferred = $q.defer();

            if(config.url.indexOf('recognize')!= -1){
                deferred.resolve(config);
                return deferred.promise;
            }

            if (config.url.indexOf('html') == -1 && config.url.indexOf('jsessionid') == -1 && config.url.indexOf('js') == -1 && config.url.indexOf('.json') == -1) { //拦截向后端发起的http请求，在请求的URL后面加上jsessionid
                if (config.url.indexOf('vc/getSID') == -1) {
                    if ($rootScope.sessionID) {
                        config.url += ';jsessionid=' + $rootScope.sessionID;
                    }
                }
            }
            deferred.resolve(config);
            return deferred.promise;
        }
    }
};
appendJSessionId.$inject = ['$q', '$rootScope'];
export default appendJSessionId;

