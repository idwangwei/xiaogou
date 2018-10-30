/**
 * Created by WangLu on 2017/3/27.
 */
//import "angular";
import './index.less';
import './pixi.min';
import recordPlayers from './recordPlayer';
import openClass02Ctrl from './open_class_02_ctrl';

let CONST = {
    DEGREE: Math.PI / 2,
    RULER: "ruler",
    TRIANGLE: "triangle",
    CANVAS_WIDTH: 500,
    CANVAS_HEIGHT: 500,
    CANVAS_BG_COLOR: "0x1099bb",
    ACTION: {
        MOVE: 'move',
        ROTATE: 'rotate'
    }
};

angular.module('openClass02', [])
  .directive('openClass02', ['serverInterface', function (serverInterface) {  //TODO
  /* .directive('openClass02', [function () {*/
        return {
            district: "E",
            scope: true,
            controller: openClass02Ctrl,
            controllerAs: 'ctrl',
            link: function (scope, element, attr, ctrl) {
                let shape = attr.bg;
                 shape = shape.replace(/(\$\{ip\}:90)(.*)/, function (match, $1, $2) {
                 return serverInterface.IMG_SERVER + $2;
                 });
                 //TODO
                shape = shape.replace(/' '/g, '').replace(/\'/g, '');
                ctrl.shapeSrc = shape;
                ctrl.attr = attr;
                ctrl.body = element[0];
                ctrl.initStage();
            }
        }
    }])
    .service('recordPlayer', recordPlayers);