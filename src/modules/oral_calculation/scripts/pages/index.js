/**
 * Created by WL on 2017/9/5.
 */

import oralCalculationWorkList from './oral_calculation_work_list/index';
import oralCalculationDoQuestion from './oral_calculation_do_question/index';
import oralCalculationCheckAnswer from './oral_calculation_check_answer/index';

let controllers = angular.module('oralCalculation.controllers', []);
controllers.controller('oralCalculationWorkList',oralCalculationWorkList);
controllers.controller('oralCalculationDoQuestion',oralCalculationDoQuestion);
controllers.controller('oralCalculationCheckAnswer',oralCalculationCheckAnswer);