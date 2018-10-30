/**
 * Created by 彭建伦 on 2016/5/31.
 * local数据统一操作的angular service
 */
import NgLocalStoreService from './ngLocalStoreService';
import LocalStoreSyncMiddleware from './localStoreSyncMiddleware';
let ngLocalStoreModule = angular.module('ngLocalStore', []);
ngLocalStoreModule.provider('ngLocalStore', NgLocalStoreService);
ngLocalStoreModule.factory('localStoreSyncMiddleware', LocalStoreSyncMiddleware);
export default ngLocalStoreModule;
