/**
 * Created by ���� on 2015/10/26.
 */
define(['./index'], function (services) {
    services.service('checkService', ['$window', '$log', function ($window, $log) {

        var workCheckInfo = $window.localStorage.getItem('workCheckInfo');

        if (workCheckInfo) {
            workCheckInfo = JSON.parse(workCheckInfo);
        } else {
            workCheckInfo = [];
            $window.localStorage.setItem('workCheckInfo', JSON.stringify(workCheckInfo));
        }

        this.workCheckInfo = workCheckInfo;
        /**
         * �����ҵ�ļ�����
         * @param paperInstanceId
         * @param info
         */
        this.addCheckInfo = function (paperInstanceId, info) {
            if (this.hasCheckInfo(paperInstanceId)) {
                $log.debug('there is no checkinfo in workCheckInfo List!');
                return;
            }
            this.workCheckInfo.push({paperInstanceId: paperInstanceId, info: info});
            $window.localStorage.setItem('workCheckInfo', JSON.stringify(this.workCheckInfo));
        };
        /**
         * �Ƴ���ҵ�ļ�����
         * @param paperInstanceId
         */
        this.removeCheckInfo = function (paperInstanceId) {
            if (this.hasCheckInfo(paperInstanceId)) {
                $log.debug('there is no checkinfo in workCheckInfo List!');
                return;
            }
            var me = this;
            angular.forEach(this.workCheckInfo, function (info, idx) {
                if (info.paperInstanceId == paperInstanceId)me.workCheckInfo.splice(idx, idx + 1);
            });
            $window.localStorage.setItem('workCheckInfo', JSON.stringify(this.workCheckInfo));
        };
        this.updateCheckInfo = function (paperInstanceId, info) {
            if (this.hasCheckInfo(paperInstanceId)) {
                $log.debug('there is no checkinfo in workCheckInfo List!');
                return;
            }
            var me = this;
            angular.forEach(this.workCheckInfo, function (item, idx) {
                if (item.paperInstanceId == paperInstanceId) {
                    me.workCheckInfo[idx].info = info;
                }
            });
            $window.localStorage.setItem('workCheckInfo', JSON.stringify(this.workCheckInfo));
        };
        /**
         * ��ȡ
         * @param paperInstanceId
         */
        this.getCheckInfo = function (paperInstanceId) {
            var rt = null;
            angular.forEach(this.workCheckInfo, function (item) {
                if (item.paperInstanceId == paperInstanceId)rt = item;
            });
            return rt;
        };
        /**
         * ���localStorage���Ƿ��и���ҵ�ļ����Ϣ
         * @param paperInstanceId
         */
        this.hasCheckInfo = function (paperInstanceId) {
            var has = false;
            angular.forEach(this.workCheckInfo, function (item) {
                if (item.paperInstanceId == paperInstanceId)has = true;
            });
            return has;
        }

    }]);
});
