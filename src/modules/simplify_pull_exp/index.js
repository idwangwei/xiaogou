/**
 * Created by Administrator on 2017/9/13.
 */

import unitCon from './directive/cell/unit_con.js';
import numCon from './directive/cell/num_con.js';
import fracCon from './directive/cell/frac_con.js';
import rowCon from './directive/cell/row_con.js';
import simplifyKeyboard from './directive/keyboard/index.js';
import simplify from './directive/textarea/index.js';

angular.module('simplifyPullExp.directive',[])
    .directive('unitCon',unitCon)
    .directive('numCon',numCon)
    .directive('fracCon',fracCon)
    .directive('rowCon',rowCon)
    .directive('simplifyKeyboard',simplifyKeyboard)
    .directive('simplify',simplify);
