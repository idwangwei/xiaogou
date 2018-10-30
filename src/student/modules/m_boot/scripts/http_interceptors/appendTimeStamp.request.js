/**
 * Created by 彭建伦 on 2016/6/7.
 * 在所有想后端发起的请求后统一加上jsessionid
 */
let appendTimeStamp = function ($q) {
    return {
        request: function (config) {
            var deferred = $q.defer();

            if(config.url.indexOf('recognize')!= -1){
                deferred.resolve(config);
                return deferred.promise;
            }

            if(config.method=="POST"){
                config.url += (config.url.match('\\?') ? '&timestamp=':'?timestamp=') + config.data.$tmp;
                delete config.data.$tmp;
            }
            deferred.resolve(config);
            return deferred.promise;
        }
    }
};
appendTimeStamp.$inject = ['$q'];
export default appendTimeStamp;

