
    var exec = require('cordova/exec');


    function HandWrite() {
    }

    /**
     * Get device info
     *
     * @param {Function} successCallback The function to call when the heading data is available
     * @param {Function} errorCallback The function to call when there is an error getting the heading data. (OPTIONAL)
     */
    HandWrite.prototype.recognize = function (successCallback, errorCallback) {
//    argscheck.checkArgs('fF', 'HandWrite.getInfo', arguments);
        exec(successCallback, errorCallback, "HandWriteRecognize", "recognize", []);
    };
    HandWrite.prototype.undo = function (successCallback, errorCallback) {
//      argscheck.checkArgs('fF', 'HandWrite.getInfo', arguments);
        exec(successCallback, errorCallback, "HandWriteRecognize", "undo", []);
    };
    HandWrite.prototype.clear = function (successCallback, errorCallback) {
 //      argscheck.checkArgs('fF', 'HandWrite.getInfo', arguments);
         exec(successCallback, errorCallback, "HandWriteRecognize", "clear", []);
    };
    HandWrite.prototype.init = function (width,height,successCallback, errorCallback) {
//    argscheck.checkArgs('fF', 'HandWrite.getInfo', arguments);
        exec(successCallback, errorCallback, "HandWriteRecognize", "init", [width,height]);
    };
    HandWrite.prototype.addStroke = function (jsonPoints,strokeId,successCallback, errorCallback) {
    //    argscheck.checkArgs('fF', 'HandWrite.getInfo', arguments);
            exec(successCallback, errorCallback, "HandWriteRecognize", "addStroke", [jsonPoints,strokeId]);
    };
//    HandWrite.prototype.setTrainImage = function (trainVal, imgBase64,imgUrl, successCallback, errorCallback) {
////    argscheck.checkArgs('fF', 'HandWrite.getInfo', arguments);
//        exec(successCallback, errorCallback, "HandWrite", "setTrainImage", [trainVal, imgBase64,imgUrl]);
//    };
//    HandWrite.prototype.deleteTrainImage = function (imgPath, successCallback, errorCallback) {
//        //    argscheck.checkArgs('fF', 'HandWrite.getInfo', arguments);
//        exec(successCallback, errorCallback, "HandWrite", "deleteTrainImage", [imgPath]);
//    };
//    HandWrite.prototype.getTrainImageList = function (successCallback, errorCallback) {
//        //    argscheck.checkArgs('fF', 'HandWrite.getInfo', arguments);
//        exec(successCallback, errorCallback, "HandWrite", "getTrainImageList",[]);
//    };
//    HandWrite.prototype.trainFromTrainImages = function (successCallback, errorCallback) {
//        //    argscheck.checkArgs('fF', 'HandWrite.getInfo', arguments);
//        exec(successCallback, errorCallback, "HandWrite", "trainFromTrainImages",[]);
//    };
//
//     HandWrite.prototype.getLabelCharacterMap = function (successCallback, errorCallback) {
//            //    argscheck.checkArgs('fF', 'HandWrite.getInfo', arguments);
//            exec(successCallback, errorCallback, "HandWrite", "getLabelCharacterMap",[]);
//     };
//     HandWrite.prototype.getCutImages = function (successCallback, errorCallback) {
//                 //    argscheck.checkArgs('fF', 'HandWrite.getInfo', arguments);
//                 exec(successCallback, errorCallback, "HandWrite", "getCutImages",[]);
//     };



    module.exports = new HandWrite();

