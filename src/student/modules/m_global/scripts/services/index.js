/**
 * Created by ZL on 2017/12/28.
 */
// import appInfoService from './appinfo_service';
// import ProfileService from './profile_service';
// import WxPayService from './wxpay_service';
import bargainService from './bargain_service';
import monitorService from './monitor_service';

let services = angular.module('m_global.services', []);
// services.service('appInfoService',appInfoService);
// services.service('profileService',ProfileService);
// services.service('wxPayService',WxPayService);
services.service('bargainService',bargainService);
services.service('monitorService',monitorService);
