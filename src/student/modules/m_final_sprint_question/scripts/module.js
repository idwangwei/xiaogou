/**
 * Created by qiyuexi on 2018/1/9.
 */
import {
    registerModule
} from 'ngDecoratorForStudent/ng-decorator';
// import finalSprintQuestionReducers from './redux/index';

let finalSprintQuestionModule = angular.module('m_final_sprint_question', [
]);
registerModule(finalSprintQuestionModule);
finalSprintQuestionModule.run(['$state', '$rootScope','$ngRedux', ($state, $rootScope,$ngRedux)=> {
    /*$rootScope.loadFinalSprintQuestionImg = (imgUrl)=> {
        return require('../images/' + imgUrl);
    };*/
    // $ngRedux.mergeReducer(finalSprintQuestionReducers);
    console.log('model final sprint question install======================');
}]);
export {
    finalSprintQuestionModule
}
export * from 'ngDecoratorForStudent/ng-decorator';