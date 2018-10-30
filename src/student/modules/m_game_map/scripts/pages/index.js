/**
 * Created by Administrator on 2017/5/2.
 */
import goodsSelectCtrl from '../directives/goodsSelectPage/goodsSelectCtrl';
import atlasShareBtnCtrl from '../directives/atlasShareBtn/atlasShareBtnCtrl';

let controllers = angular.module('m_game_map.controllers', []);
controllers.controller('goodsSelectCtrl',goodsSelectCtrl);
controllers.controller('atlasShareBtnCtrl',atlasShareBtnCtrl);

