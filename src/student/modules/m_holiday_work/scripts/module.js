import {registerModule} from 'ngDecoratorForStudent/ng-decorator';
import './constants/index';
import './directives/index';
import './pages/index';
import './services/index';
import reducers from "./redux/index";
import * as defaultStates from './redux/default_states/index';

let holidayWorkModule = angular.module('m_holiday_work', [
    'm_holiday_work.controllers',
    'm_holiday_work.constants',
    'm_holiday_work.directives',
    'm_holiday_work.services'
]);
registerModule(holidayWorkModule,reducers,defaultStates);

holidayWorkModule.run(['$rootScope',($root)=>{
    /*$root.loadHolidayWorkImg = (imgUrl)=>{
        return require('../images/' + imgUrl);
    };*/
    console.log('=========================================')
}]);
holidayWorkModule.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(false);
    $stateProvider.state('holiday_work_detail', { //作业明细--整个作业查看
        cache:false,
        url: '/holiday_work_detail/:paperId/:paperInstanceId/:urlFrom',
        template: require('./pages/holiday_work_detail/page.html'),
        controller: 'holidayWorkDetailCtrl as ctrl'
    })
        .state('holiday_select_question', { //选择试题
            url: '/holiday_select_question/:paperId/:paperInstanceId/:redoFlag/:urlFrom/:questionIndex/:urlFromMark',
            template: require('./pages/holiday_select_question/page.html'),
            controller: 'holidaySelectQuestionCtrl as ctrl'
        })
        .state('holiday_do_question', { //做题
            url: '/holiday_do_question/:paperId/:paperInstanceId/:redoFlag/:questionIndex/:urlFrom/:urlFromMark/:isFirst',
            template: require('./pages/holiday_do_question/page.html'),
            controller: 'holidayDoQuestionCtrl as doCtrl'
        })
        .state('holiday_work_praise', { //作业评价
            url: '/holiday_work_praise/:workId/:workInstanceId',
            template: require('./pages/holiday_work_praise/page.html'),
            controller: 'holidayWorkPraiseCtrl as ctrl'
        })


}]);

export {holidayWorkModule}
export * from 'ngDecoratorForStudent/ng-decorator'
