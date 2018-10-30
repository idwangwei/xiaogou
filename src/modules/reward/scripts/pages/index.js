/**
 * Created by Administrator on 2017/5/2.
 */
import signInCtrl from './sign_in/sign_in_ctrl';
import dayTaskCtrl from './day_task/day_task_ctrl';
import levelNameCtrl from './level_name/level_name_ctrl';
import scoreStoreCtrl from './score_store/score_store_ctrl';
import scoreDetailsCtrl from './score_details/score_details_ctrl';
import levelNameRankListCtrl from './level_name_rank_list/level_name_rank_list_ctrl';

let controllers = angular.module('reward.controllers', []);
controllers.controller('signInCtrl',signInCtrl);
controllers.controller('dayTaskCtrl',dayTaskCtrl);
controllers.controller('levelNameCtrl',levelNameCtrl);
controllers.controller('scoreStoreCtrl',scoreStoreCtrl);
controllers.controller('scoreDetailsCtrl',scoreDetailsCtrl);
controllers.controller('levelNameRankListCtrl',levelNameRankListCtrl);
