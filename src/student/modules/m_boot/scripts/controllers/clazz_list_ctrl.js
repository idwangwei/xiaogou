/**
 * @author by 彭建伦 on 2015/9/11.
 */
import controllers from './index';
controllers.controller('clazzListCtrl', ['$scope', '$log', '$state', 'profileService', function ($scope, $log, $state, profileService) {
    $scope.clazzList = profileService.classList;
    profileService.getClassesList();
    /**
     * 点击选择班级跳转到主界面
     * @param clazzId
     */
    $scope.handleClazzSelect = function (clazzId) {
        if (!clazzId) {
            $log.error('clazzListCtrl.handleClazzSelect clazzId is invalid!');
            return;
        }
        profileService.clazz.clazzId = clazzId;
        $state.go('home.work_list');
    };
}]);
