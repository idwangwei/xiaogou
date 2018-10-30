/**
 * Author 邓小龙 on 2015/8/10.
 * @description
 */
import  directives from './../index';
directives.directive('tabItem', ["$timeout", "$rootScope", function ($timeout, $rootScope) {
    return {
        restrict: 'C',
        link: function ($scope, element, attr, ctrl) {
            if($(element).children().filter('.tab-title').text() === '护眼'){
                $(element).parent().append($(element));
                element.on('click', (ev)=>$timeout(()=> {
                    if(window.cordova && window.cordova.InAppBrowser){
                        let ref = window.cordova.InAppBrowser.open('http://mp.weixin.qq.com/s/oa_-IYuZwxQUSKp38HeGcg', '_blank', 'location=yes');
                    }else {
                        window.open('http://mp.weixin.qq.com/s/oa_-IYuZwxQUSKp38HeGcg', '_blank', 'location=yes')
                    }
                }));

            }
        }
    };
}]);
