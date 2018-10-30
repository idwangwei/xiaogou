/**
 * Created by 彭健伦 on 2016/3/17.
 * 做题时题目下方的占位DIV，其高度为屏幕高度的50%
 */
import directives from './../index';
directives.directive('placeHolder', [function () {
    return {
        restrict: 'C',
        scope: true,
        controller:['$rootScope',function($rootScope){
            this.$root= $rootScope;
        }],
        link: function ($scope, $element,$attr,ctrl) {
            //function orientationchangeFn() {
            //      if(ctrl.$root.platform.IS_ANDROID){
            //          $($element).css('height', window.innerWidth * 0.5 + 'px');
            //      }else{
            //          $($element).css('height', window.innerHeight * 0.5 + 'px');
            //      }
            //}
            //$(window).on('orientationchange', orientationchangeFn);
            //$scope.$on('$destroy', function () {
            //    $(window).off('orientationchange', orientationchangeFn);
            //});
            //var val=window.innerHeight>window.innerWidth?window.innerHeight:window.innerHeight;
//            $($element).css('height', window.innerHeight * 0.5 + 'px');
            //console.log($element);
        }
    };
}]);
