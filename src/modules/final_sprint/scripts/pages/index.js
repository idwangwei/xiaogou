/**
 * Created by qiyuexi on 2017/12/7.
 */
import finalSprintHome from './final_sprint_home/index';
import finalSprintPay from './final_sprint_pay/index'
import finalSprintCheck from './final_sprint_check/index';
import finalSprintTrain from './final_sprint_train/index';
import sprintGoodsWeixinPay from './sprint_goods_weixin_pay/index'
import sprintGoodsPayProtocol from './sprint_goods_pay_protocol/index'
import sprintGoodsPayResult from './sprint_goods_pay_result/index'

let controllers = angular.module('finalSprint.controllers', []);
controllers.controller('finalSprintHome', finalSprintHome);
controllers.controller('finalSprintPay', finalSprintPay);
controllers.controller('finalSprintHome', finalSprintHome);
controllers.controller('finalSprintCheck', finalSprintCheck);
controllers.controller('finalSprintTrain', finalSprintTrain);
controllers.controller('sprintGoodsWeixinPay', sprintGoodsWeixinPay);
controllers.controller('sprintGoodsPayProtocol', sprintGoodsPayProtocol);
controllers.controller('sprintGoodsPayResult', sprintGoodsPayResult);
