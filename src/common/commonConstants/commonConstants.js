/**
 * Created by 彭建伦 on 2016/4/5.
 */
const commonConstants = angular.module('commonConstants', []);

commonConstants.constant('commonConstants', {
    CLASS_NAME_MATHJAX_EXPRESSION_IN_Q_BODY: 'm_in_q_body', //题干中所有需要被显示成Mathjax形态的内容会被加上这个class
    RENDER_EVENT_FOR_MATHJAX_EXPRESSION_IN_Q_BODY:'q_body_mathjax.render' //题干中Mathjax渲染事件
});

export default commonConstants;

