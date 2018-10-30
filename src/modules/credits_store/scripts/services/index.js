/**
 * Created by ZL on 2017/11/6.
 */
import credits_store_service from './credits_store_service'
import credits_info_service from './credits_info_service'
import ratory_info_service from './ratory_info_service'

let services = angular.module('creditsStore.services', []);
services.service('creditsStoreService',credits_store_service);
services.service('creditsInfoService',credits_info_service);
services.service('ratoryInfoService',ratory_info_service);
