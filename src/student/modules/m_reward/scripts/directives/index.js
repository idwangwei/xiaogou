/**
 * Created by WL on 2017/5/4.
 */
// import rewardAdd from "./rewardAdd/index";
// import rewardAddPage from "./rewardAddPage/index";
import signInWarn from "./signInWarn/index";
import rewardStudentAd from "./rewardStudentAd/index";
import rewardPrompt from "./rewardPrompt/index";
import rewardLevelNameAlert from "./rewardLevelNameAlert/index";
// import signInPopups from "./signInPopups/index";
// import changeHeadImg from './change_head_img/change_head_img';
import rewardDialog from './reward_system_dialog/reward_dialog';

let directives = angular.module("m_reward.directives", []);

directives
    // .directive("rewardAdd", rewardAdd)
    // .directive("rewardAddPage", rewardAddPage)
    .directive("signWarn", signInWarn)
    .directive("rewardStudentAd", rewardStudentAd)
    .directive("rewardLevelNameAlert", rewardLevelNameAlert)
    .directive("rewardPrompt", rewardPrompt)
    // .directive("signInPopups", signInPopups)
    // .directive("changeHeadImg", changeHeadImg)
    .directive("rewardDialog", rewardDialog);