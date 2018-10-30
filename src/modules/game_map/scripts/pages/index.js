/**
 * Created by Administrator on 2017/5/2.
 */
import goodsSelectCtrl from '../directives/goodsSelectPage/goodsSelectCtrl';
import './gameGoodsSelectPage/gameGoodsSelectCtrl';
import gameMapLevelCtrl from './game_map_level/index';
import gameMapSceneCtrl from'./game_map_scene/index';
import gameMapAtlas1Ctrl from './game_map_atlas1/index';
import gameMapAtlas2Ctrl from './game_map_atlas2/index';
import gameMapAtlas3Ctrl from './game_map_atlas3/index';
import gameMapAtlas4Ctrl from './game_map_atlas4/index';
import gameMapAtlas5Ctrl from './game_map_atlas5/index';
import gameMapAtlas6Ctrl from './game_map_atlas6/index';
import atlasShareBtnCtrl from '../directives/atlasShareBtn/atlasShareBtnCtrl';
import gameGoodsPayCtrl from './game_goods_pay/index';
import gameGoodsProtocolCtrl from './game_goods_pay_protocol';
import gameGoodsPayResultCtrl from './game_goods_pay_result/index';

let controllers = angular.module('gameMap.controllers', []);
controllers.controller('goodsSelectCtrl',goodsSelectCtrl);
controllers.controller('gameMapLevelCtrl',gameMapLevelCtrl);
controllers.controller('gameMapSceneCtrl',gameMapSceneCtrl);
controllers.controller('gameMapAtlas1Ctrl',gameMapAtlas1Ctrl);
controllers.controller('gameMapAtlas1Ctr2',gameMapAtlas2Ctrl);
controllers.controller('gameMapAtlas1Ctr3',gameMapAtlas3Ctrl);
controllers.controller('gameMapAtlas1Ctr4',gameMapAtlas4Ctrl);
controllers.controller('gameMapAtlas1Ctr5',gameMapAtlas5Ctrl);
controllers.controller('gameMapAtlas1Ctr6',gameMapAtlas6Ctrl);
controllers.controller('atlasShareBtnCtrl',atlasShareBtnCtrl);
controllers.controller('gameGoodsPayCtrl',gameGoodsPayCtrl);
controllers.controller('gameGoodsProtocolCtrl',gameGoodsProtocolCtrl);
controllers.controller('gameGoodsPayResultCtrl',gameGoodsPayResultCtrl);

