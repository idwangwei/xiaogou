/**
 * Created by 彭建伦 on 2016/3/31.
 */
window.$=require('jquery');
let context2 = require.context('./../scripts/', true);
context2.keys().forEach(context2);
angular.element=window.$;
require('angular-mocks');
require('MathJax/MathJax.js');
// We use the context method on `require` which Webpack created
// in order to signify which files we actually want to require or import.
// Below, `context` will be a/an function/object with file names as keys.
// Using that regex, we scan within `client/app` and target
// all files ending with `.spec.js` and trace its path.
// By passing in true, we permit this process to occur recursively.
let context = require.context('./', true);

// Get all files, for each file, call the context function
// that will require the file and load it here. Context will
// loop and require those spec files here.
context.keys().forEach(context);



