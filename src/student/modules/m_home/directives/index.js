/**
 * Created by qiyuexi on 2018/1/16.
 */
// import finalSprintAd from '../../m_final_sprint/scripts/directives/final_sprint_ad/index';//引入期末冲刺广告
import broadcastMsgItem from '../../m_global/scripts/directives/broadcast/broadcast-msg-item';//实况直播指令
import signInPopups from "../../m_reward/scripts/directives/signInPopups/index";//领取能量（需要sever 很伤）
let directives = angular.module("m_home.directives",[]);
// directives.directive('finalSprintAd',finalSprintAd);
directives.directive("broadcastMsgItem", broadcastMsgItem);
directives.directive("signInPopups", signInPopups);