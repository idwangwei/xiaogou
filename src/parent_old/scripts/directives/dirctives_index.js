/**
 * Created by ZL on 2018/1/16.
 */
import directives from './index';
import rewardAdd from "./rewardAdd/index";
import rewardAddPage from "./rewardAddPage/index";
directives.directive("rewardAdd", rewardAdd)
    .directive("rewardAddPage", rewardAddPage);