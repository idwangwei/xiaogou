/**
 * Created by pengjianlun on 15-11-24.
 */
require.config({
    paths:{
        angular:'../bower_components/angular/angular',
        mathJax:'../bower_components/MathJax/MathJax',
        mathJaxCfg:'../bower_components/MathJax/config/TeX-AMS-MML_HTMLorMML-full',
        app:'app'
    },
    shim :{
        app:{
            deps:['angular']
        },
        angular:{
            deps:['mathJaxCfg']
        },
        mathJaxCfg:{
            deps:['mathJax']
        }
    }
});
require(['app'],function(){
    angular.element().ready(function () {
        return angular.bootstrap(document, ['mathJaxParser']);
    });
});
