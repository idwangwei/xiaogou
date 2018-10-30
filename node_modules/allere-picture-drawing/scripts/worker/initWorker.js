/**
 * Created by LuoWen on 2017/2/23.
 */

//let workerContent = require("./workerContent");

let initWorker = ()=> {
    // window.URL = window.URL || window.webkitURL;
    //
    // var blob;
    // try {
    //     blob = new Blob([workerContent], {type: 'application/javascript'});
    // } catch (e) { // Backwards-compatibility
    //     window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
    //     blob = new BlobBuilder();
    //     blob.append(workerContent);
    //     blob = blob.getBlob();
    // }
    // var worker = new Worker(URL.createObjectURL(blob));
    var worker = new Worker('./tasks2.bundle.js')

    // worker.postMessage('Test');

    return worker;
};

export default initWorker;