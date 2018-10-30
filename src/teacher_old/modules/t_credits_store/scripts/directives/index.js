/**
 * Created by ZL on 2017/11/6.
 */
// import taskTopBar from './task_top_bar/index';
import getTeacherReward from './get_teacher_reward/index'
import rotaryDraw from './ratory_draw'

let directives = angular.module("t_credits_store.directives",[]);
// directives.directive("taskTopBar", taskTopBar);
directives.directive("getTeacherReward", getTeacherReward);
directives.directive("rotaryDraw", rotaryDraw);