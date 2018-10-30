import {registerModule} from 'ngDecoratorForStudent/ng-decorator';
import reducers from "./redux/index";
import * as defaultStates from './redux/default_states/index';
let questionEveryDayModule = angular.module('m_question_every_day', []);
registerModule(questionEveryDayModule, reducers, defaultStates);
questionEveryDayModule.run(['$rootScope', ($root)=> {
		console.log('=========================================');
}]);
export {questionEveryDayModule}
export * from 'ngDecoratorForStudent/ng-decorator'
