/** attach filters to this module
 * if you get 'unknown {x}Provider' errors from angular, be sure they are
 * properly referenced in one of the module dependencies in the array.
 **/
define(['ionicJS'], function () {
    'use strict';
    return angular.module('m_boot.filters', []);
});