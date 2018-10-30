/**
 * Created by pjl on 2017/3/18.
 * http 拦截器
 */

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
import getCompetitionInfo from "./getCompetitionInfo.response";
let ngHttpInterceptors = angular.module('competition.ngHttpInterceptors', []);
ngHttpInterceptors.factory('getCompetitionInfo', getCompetitionInfo);
export default ngHttpInterceptors;


