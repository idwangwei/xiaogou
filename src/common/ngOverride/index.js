/**
 * Created by 彭建伦 on 2016/10/24.
 * 覆盖angular或者ionic的一些指令或服务
 */
import exceptionHandler from "./exceptionHandler";
import {ngClickDirectiveDecorator, ngClickDirective} from "./ngClick";
export default angular.module('ngOverride', [])
    .factory("$exceptionHandler", exceptionHandler);
    // .config(ngClickDirectiveDecorator)
    // .directive("ngClick", ngClickDirective);
