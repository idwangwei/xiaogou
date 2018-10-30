/**
 * Created by 彭建伦 on 2016/3/21.
 */
import module from './module';
import {expressionSet,unSupportExpressionSet} from './expressionSet';
module.constant('EXPRESSION_SET', expressionSet);
module.constant('UNSUPPORT_EXPRESSION_SET', unSupportExpressionSet);
module.constant('INPUT_AREA_TYPE', {
    PULL_INPUT_AREA: 'pull-input-area'
});

module.constant('INPUTBOX_TYPES', {
    APP_TEXTAREA: 'app-textarea', //应用题输入框（标签名）
    SELECT_INPUT_BOX: 'select-input-area', //选择型输入框
    COMMENT_INPUT_BOX: 'comment', //步骤说明框
    C_APP_TEXTAREA:'appTextarea', //填空题输入框（类名）
    IMG_INPUT_AREA:'img-input-area',//图片输入框
    PULL_INPUT_AREA: 'pull-input-area', //脱式输入框
    VARIABLE_SOLVE_INPUT_AREA:'variable-solve-input-area',  //解方程输入框
    CIRCLE_SELECT_INPUT_ARAE:'circle-select-input-area',    //圆形选择输入框
    CIRCLE_INPUT_ARAE:'circle-input-area'
});
