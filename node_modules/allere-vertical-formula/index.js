/**
 * Created by LuoWen on 2016/8/2.
 */
import "./css/vertical.less";
import vertical from "./component/vertical";
import verticalService from "./service/verticalService"

angular.module("verticalFormula", [])
    .directive('vertical', vertical)
    .service("verticalService", verticalService)

