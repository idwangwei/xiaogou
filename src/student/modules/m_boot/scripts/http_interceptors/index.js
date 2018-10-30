/**
 * Created by 彭建伦 on 2016/6/7.
 * 用于拦截APP的所有请求与响应的angular拦截器模块
 * 该模块主要用于处理：
 *    1.拦截后端的一些特殊返回code,如
 *       650:用户在其他地方登录
 *       651:用户是主动退出的
 *       603:session过期
 *    2.在请求后面添加jessionid
 *    3.根据$rootScope.ip和constants中的配置生成请求的完整URL
 *
 */
import getRequestURL from './getRequestURL.request';
import appendJSessionId from './appendJSessionId.request';
import appendTimeStamp from "./appendTimeStamp.request";
import replaceHttps from './replaceHttps.request';
import userLogoutBySelf from './userLogoutBySelf.response';
import userSessionTimeout from './userSessionTimeout.response';
import unExpectedServerError from './unExpectedServerError.response';
import userLoginInOtherPlace from './userLoginInOtherPlace.response';

let ngHttpInterceptors = angular.module('ngHttpInterceptors', []);
ngHttpInterceptors.factory('getRequestURL', getRequestURL);
ngHttpInterceptors.factory('appendJSessionId', appendJSessionId);
ngHttpInterceptors.factory('appendTimeStamp', appendTimeStamp);
ngHttpInterceptors.factory('replaceHttps', replaceHttps);
ngHttpInterceptors.factory('userLogoutBySelf', userLogoutBySelf);
ngHttpInterceptors.factory('userSessionTimeout', userSessionTimeout);
ngHttpInterceptors.factory('unExpectedServerError', unExpectedServerError);
ngHttpInterceptors.factory('userLoginInOtherPlace', userLoginInOtherPlace);
export default ngHttpInterceptors;
