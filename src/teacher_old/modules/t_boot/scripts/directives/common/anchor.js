/**
 * Created by 华海川 on 2015/10/12.
 * 锚点操作
 */
define(['./../index'], function (directives) {
    directives.directive('listAnchor', ['$location','$anchorScroll','$interval','$timeout',function ($location,$anchorScroll,$interval,$timeout) {
        return {
            restrict: 'A',
            scope:{
                toId:'=listAnchor'
            },
            link: function ($scope,element,attrs) {
                var count =0;
                if($scope.toId){
                    var t =$interval(function(){
                        count++;
                        if(count>50){
                            $interval.cancel(t);
                        }
                        if(document.getElementById($scope.toId)){
                            goTo($scope.toId);
                            $interval.cancel(t);
                        }
                    },200);
                }

//                $timeout(function(){
//                    if($scope.toId)
//                    goTo($scope.toId);
//                },200);

                function goTo(id){
                        var old = $location.hash();
                        $location.hash(id);
                        $anchorScroll();
                        $location.hash(old);

                }
            }
        }
    }])
});