/**
 * Created by ZL on 2018/1/13.
 */

import campPacksConnect from './camp_packs_connect/index';
let directives = angular.module("m_xly.directives", []);

directives.directive("campPacksConnect", campPacksConnect);