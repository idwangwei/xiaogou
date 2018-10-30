/**
 * Created by LuoWen on 2016/8/2.
 */
import "./css/vertical.less";
import vertical from "./directive/vertical"
// import verticalCell from "./directive/verticalCell"
import verticalService from "./service/verticalService"
// import verticalCompileMathjaxHtml from "./directive/verticalCompileMathjaxHtml"

angular.module("verticalFormula", [])
    .directive('vertical', vertical)
    //.directive('verticalCell', verticalCell)
    //.directive('vc', verticalCompileMathjaxHtml)
    .service("verticalService", verticalService)
    // .directive('vertical', ["", fn]); //good!


