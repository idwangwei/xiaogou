/**
 * Created by WL on 2017/5/4.
 */
import rewardAdd from "./rewardAdd/index";
import rewardAddPage from "./rewardAddPage/index";
import signInWarn from "./signInWarn/index";
import rewardStudentAd from "./rewardStudentAd/index";
import rewardPrompt from "./rewardPrompt/index";
import rewardLevelNameAlert from "./rewardLevelNameAlert/index";
import signInPopups from "./signInPopups/index";

let directives = angular.module("reward.directives",[]);

directives.directive("rewardAdd", rewardAdd)
    .directive("rewardAddPage", rewardAddPage)
    .directive("signWarn", signInWarn)
    .directive("rewardStudentAd", rewardStudentAd)
    .directive("rewardLevelNameAlert", rewardLevelNameAlert)
    .directive("rewardPrompt", rewardPrompt)
    .directive("signInPopups", signInPopups);
