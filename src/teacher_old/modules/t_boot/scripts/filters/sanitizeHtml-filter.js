define(['./index'], function (filters) {
    'use strict';
    // expand input and show post button on focus
    filters.filter('sanitizeHtml',['$sce',function($sce){
        return function(html){
            return $sce.trustAsHtml(html);
        }
    }]);
});