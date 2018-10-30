/**
 * Created by 邓小龙 on 2016/9/23.
 * 给需要一些请求url方式换成https，如登录、注册等
 */
let replaceHttps = function ($q, $rootScope,finalData) {
    return {
        request: function (config) {
            var deferred = $q.defer();
            if (config.url.indexOf('html') == -1 && config.url.indexOf('.js') == -1 && config.url.indexOf('.json') == -1) { //拦截向后端发起的http请求，在请求的URL后面加上jsessionid
                if (finalData.HTTPS_URL_REG.test(config.url)&&!finalData.HTTPS_EXCLUDE_161_REG.test(config.url)) {
                    config.url=config.url.replace(/http:\/\/(.*):(\d+)?(.*)/,'https://$1$3');
                }
            }
            deferred.resolve(config);
            return deferred.promise;
        }
    }
};
replaceHttps.$inject = ['$q', '$rootScope','finalData'];
export default replaceHttps;

