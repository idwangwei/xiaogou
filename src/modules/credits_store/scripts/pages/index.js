/**
 * Created by ZL on 2017/11/6.
 */
import creditsStoreTask from './credits_store_task/index';
import taskProgress from './task_progress/index';
import creditsStore from './credits_store/index'
import creditsExchangeGoods from './credits_exchange_goods/index'
import submitExchangeGoods from './submit_exchange_goods/index'
import creditsList from './credits_list'

let controllers = angular.module('creditsStore.controllers', []);
controllers.controller('creditsStoreTask', creditsStoreTask);
controllers.controller('taskProgress', taskProgress);
controllers.controller('creditsStore', creditsStore);
controllers.controller('creditsExchangeGoods', creditsExchangeGoods);
controllers.controller('submitExchangeGoods', submitExchangeGoods);
controllers.controller('creditsList', creditsList);