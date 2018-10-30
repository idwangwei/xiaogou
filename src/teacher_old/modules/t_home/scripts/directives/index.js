/**
 * Created by ww on 2018/2/28.
 */
import tabItem from './tabItem';
let directives = angular.module("t_home.directives",[]);
directives.directive("tabItem",["$timeout", "$rootScope", "tabItemService", tabItem]);
