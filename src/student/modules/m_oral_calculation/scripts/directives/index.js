/**
 * Created by WL on 2017/9/5.
 */
import equation from './equation/index';
import equationInput from './equation_input/index';
import oralCalculationList from './oral_calculation_list/oral_calculation_list';
import {canvasInputDirective, canvasInputDelegate} from './canvas_write/index';
import canvasInputScrollbar from './scrollbar/index'
import oralCalculationGuide from './oral_calculation_guide_v2/index';
import scrollTip from './scroll_tip/scrollTip';
import loadingProcessingOral from './oral_calculation_loading/index';
import recognizeStrokeImage from './recognizeStrokeImage/index';

let directives = angular.module("m_oral_calculation.directives", []);

directives.directive('equation', equation);
directives.directive('equationInput', equationInput);
directives.directive('canvasInput', canvasInputDirective);
directives.directive('canvasInputScrollbar', canvasInputScrollbar);
directives.directive('scrollTip', scrollTip);
directives.directive('oralCalculationGuide', oralCalculationGuide);
directives.directive('oralCalculationList',oralCalculationList);
directives.service('canvasInputDelegate', canvasInputDelegate);
directives.directive('loadingProcessingOral', loadingProcessingOral);
directives.directive('recognizeStrokeImage', recognizeStrokeImage);
