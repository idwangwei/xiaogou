/**
 *
 * Thanks to Three.js, mr.doob
 */
define([], function () {

    var ngQRCodeScaner = angular.module('ngQRCodeScaner', []);

    ngQRCodeScaner.service('QRCodeScaner', ['$log', '$q', function ($log, $q) {
        if (!window.cordova || !window.cordova.plugins)
            return $log.debug('check if your cordova is correctly installed!');
        if (!window.cordova.plugins.barcodeScanner)
            return $log.debug('check if QRCodeScaner plugin is correctly installed!');

        this.scan = function () {
            var defer = $q.defer();
            cordova.plugins.barcodeScanner.scan(function (result) {
                defer.resolve(result);
                $log.debug('scan result:' + JSON.stringify(result));
            }, function (error) {
                defer.reject(error);
                $log.debug('scan failed:' + JSON.stringify(error));
            });
            return defer.promise;
        };
    }]);

    return ngQRCodeScaner;
});

