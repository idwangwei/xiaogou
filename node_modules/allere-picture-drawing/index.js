/**
 * Created by LuoWen on 20170106
 */
import "./styles/index.less";
import "./scripts/angular-canvas-painter";
import pictureDrawing from "./scripts/PictureDrawing";
import pictureDrawingService from "./scripts/PictureDrawingService";
import pictureDrawingCtrl from "./scripts/PictureDrawingCtrl";
// import "./bower_components/angular-canvas-painter/dist/angular-canvas-painter";

angular.module("pictureDrawing", ["pw.canvas-painter"])
    .directive('picture', pictureDrawing)
    .service("pictureDrawingService", pictureDrawingService)
    .controller("PictureDrawingCtrl", pictureDrawingCtrl)

