/**
 * Author 邓小龙 on 2015/8/26.
 * @description 做题
 */
// define(['../index'],function(directives){
    function paperLayout(){
        return {
            restrict:'EA',
            transclude:true,
            template:'<div class="layout" ng-transclude></div>'
        };
    }
function paperHeader(){
        return {
            restrict:'EA',
            transclude:true,
            template:' <div class="header" ng-transclude></div>'
        };
    }
    function paperMain(){
        return {
            restrict:'EA',
            transclude:true,
            template:' <div class="main" ng-transclude></div>'
        };
    }
    function paperFooter(){
        return {
            restrict:'EA',
            transclude:true,
            template:' <div class="footer" ng-transclude></div>'
        };
    }
    function paperOperation(){
        return {
            restrict:'EA',
            transclude:true,
            template:' <div class="operation"  ng-transclude></div>'
        };
    }
    function paperOperateItem(){
        return {
            restrict:'EA',
            scope:{
              btnText:'@'
            },
            replace:true,
            template:'<a href="#" class="operation-disable">{{btnText}}</a>'
            //template:'<span class="operation-disable">{{btnText}}</span>'
        };
    }
// });
export {paperLayout,paperHeader,paperMain,paperFooter,paperOperation,paperOperateItem}