import  directives from './../index';
directives.directive('focusMe', ["$timeout",  function ($timeout) {
    return {
        link: function(scope, element) {
            element[0].onclick=function(){
                element[0].focus();
            }
        }
    };
}]);