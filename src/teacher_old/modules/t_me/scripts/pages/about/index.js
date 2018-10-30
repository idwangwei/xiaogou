/**
 * Created by ZL on 2018/3/7.
 */
import {Inject, View, Directive, select} from '../../module';
@View('about', {
    url: '/about',
    styles: require('./style.less'),
    template: require('./page.html'),
    inject: ['$scope', '$state', '$rootScope', '$ngRedux', 'commonService']
})
class aboutCtrl {
    commonService;

    appNumVersion = this.commonService.getAppNumVersion();
    changeLog = this.commonService.getChangeLog();
    clickCount = 0;

    back() {
        this.go("home.me")
    }

    clickImg() {
        $scope.clickCount++;
        /*if($scope.clickCount==5){
         localStorage.clear();
         commonService.alertDialog('缓存已被清除！');
         }*/
    };
}