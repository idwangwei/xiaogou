/**
 * Created by ww on 2018/1/5.
 */

module.exports = angular.module('m_question_every_day.constants',[])
    .constant('questionEveryDayInterface', {
        GET_QUESTION_LIST_DATA: '/api/zs/groups/questions', //获取每日一题指定月份所有试题
        TINY_CLASS_GET_QUES: '/qus/api/tinyClass/getQuestion', //获取试题
        TINY_CLASS_POST_QUES_ANS:'/qus/api/tinyClass/postQuestionAnswer',//提交答案：
        TINY_CLASS_CORRECT_QUES:'/qus/api/tinyClass/correctQuestion',//单题改错

    })
    .constant('questionEveryDayFinalData',{
    });