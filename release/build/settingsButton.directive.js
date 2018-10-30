var custonButtons = angular.module('customButtons', ['ionic']);
custonButtons.directive('btnSettings', btnSettingsDirective);
btnSettingsDirective.$inject = [];
function btnSettingsDirective() {
    btnSettingsController.$inject = ['$scope', '$window'];
    function btnSettingsController($scope, $window) {
        $scope.btnIcon = ($scope.icon === undefined || $scope.icon === '') ?
            'ion-android-more-vertical' : $scope.icon;
        $scope.showMenu = false;
        $scope.getIcon = function () {
            return $scope.showMenu ?
                ($scope.iconActive || $scope.btnIcon) : ($scope.btnIcon);
        };
        $scope.getButtonClass = function () {
            return $scope.showMenu ?
                ($scope.buttomActiveClass || $scope.buttomClass) : ($scope.buttomClass);
        };
        $scope.clickAction = function ($event) {
            $event.stopPropagation();
            $scope.showMenu = true;
            if (typeof $scope.onClick === "function") {
                $scope.onClick({isopened: $scope.showMenu});
            }
        };
        function bodyClickFn(){
            console.log('from setting button body click fun....');
            $scope.$apply(function(){
                $scope.showMenu=false;
            });
        }
        $scope.$on('$destroy',function(){
            $($window.document).off('click',bodyClickFn);
        });
        $($window.document).on('click',bodyClickFn);

    }

    btnSettingsLink.$inject = [];
    function btnSettingsLink($scope, $el, $attrs) {
    }

    return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        scope: {
            icon: '@?',
            iconActive: '@?',
            itemClass: '@?',
            buttomClass: '@?',
            buttomActiveClass: '@?',
            noBorder: '=',
            onClick: '&',
            actions: '='
        },
        controller: btnSettingsController,
        link: btnSettingsLink,
        template: require('./tpls/settingsButton.tpl.html')
    };
}

