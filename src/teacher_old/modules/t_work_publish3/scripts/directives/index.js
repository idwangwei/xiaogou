/**
 * Created by ww on 2018/2/28.
 */
import eqcFlyBox from './eqc_fly_box/index';
let directives = angular.module("t_work_publish3.directives",[]);
directives.directive("eqcFlyBox",["$timeout", eqcFlyBox]);
