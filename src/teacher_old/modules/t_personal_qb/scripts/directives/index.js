/**
 * Created by ZL on 2018/3/30.
 */
import submitLoading from './submit_loading/index'
import selectBorad from './select_borad/index'

let directives = angular.module("t_personal_qb.directive",[]);
directives.directive("submitLoading", submitLoading);
directives.directive("selectBorad", selectBorad);