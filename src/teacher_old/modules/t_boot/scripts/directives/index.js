/**
 * Created by 彭建伦 on 2015/7/14.
 */

//import './random-choice/random-choice';
import taskTopBar from './t_credits_store/task_top_bar/index';
import monitorAd from './monitor_ad/index';

let directives = angular.module('app.directives', []);
directives.directive("taskTopBar", taskTopBar);
directives.directive("monitorAd", monitorAd);

define([], function () {
    return directives;
});
