/**
 * Created by Administrator on 2016/3/31.
 */
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from './../scripts/redux/index';
describe('work_list_ctrl', function () {
    //我们会在测试中使用这个scope
    var scope, $backend, rootScope, createController, serverI;
    //模拟我们的Application模块并注入我们自己的依赖
    beforeEach(function () {
        angular.mock.module('app', function ($ngReduxProvider) {
            $ngReduxProvider.createStoreWith(rootReducer, [thunk]);
        });
    });
    //模拟Controller，并且包含 $rootScope 和 $controller
    beforeEach(angular.mock.inject(function ($rootScope, $controller, $httpBackend, serverInterface) {
        $backend = $httpBackend;
        rootScope = $rootScope;
        serverI = serverInterface;
        //设置$httpBackend冲刷$http请求
        $backend.when('POST', serverI.GET_CLASSES).respond(DATA.CLAZZ_LIST);
        $backend.when('POST', serverI.GET_WORK_LIST).respond(DATA.WORK_LIST);
        //创建一个空的 scope
        scope = $rootScope.$new();
        //声明 Controller并且注入已创建的空的 scope
        createController = function () {
            return $controller('workListCtrl', {
                $scope: scope
            });
        }
    }));

    // 测试从这里开始

    it('能够正确地加载班级列表，并且第一个班级默认选中', function () {
        let ctrl = createController();
        $backend.flush();
        expect(ctrl.clazzList.length).toBeGreaterThan(0);
        expect(ctrl.clazz.id).toBeDefined();
        expect(ctrl.clazz.id).toBe(DATA.CLAZZ_LIST.classes[0].id);
    });
    it('能够正确地加载作业列表', function () {
        let ctrl = createController();
        $backend.flush();
        expect(ctrl.workList.length).toBeGreaterThan(0);
    });


    const DATA = {
        CLAZZ_LIST: {
            "code": 200,
            "msg": "OK",
            "classes": [{
                "id": "610016",
                "clazz": 1,
                "grade": 1,
                "schoolId": "0001",
                "schoolName": "爱里尔小校",
                "schoolSimpleName": "小爱",
                "name": "爱里尔一班",
                "provinceId": "28",
                "provinceName": "四川省",
                "cityId": "225",
                "cityName": "成都市",
                "districtId": "1878",
                "districtName": "武侯区",
                "status": 1,
                "createdTime": "2015-12-30 14:44:15",
                "updatedTime": "2016-01-12 21:33:35",
                "gradeName": "一年级",
                "studentCount": 2,
                "teacher": "abcde",
                "auditStatusName": "通过",
                "className": "一班",
                "checkingNum": 0,
                "checkedNum": 0,
                "reject": 0,
                "ingnored": 0
            }]
        },
        WORK_LIST: {
            "msg": "OK",
            "code": 200,
            "lastKey": "17daceac-d803-48b1-9aa4-f4a348c2175f",
            "histories": [{
                "wasteTime": 2,
                "instanceId": "f07a8595-e377-4886-affd-c3f3e3ebb9e3",
                "publishTime": "2016-04-12 12:06:46",
                "publishWeek": "星期二",
                "gradeTime": "2016-04-12 16:52:49",
                "publishType": 2,
                "groupId": "610016",
                "groupName": "爱里尔一班",
                "paperHistories": [{
                    "paperId": "2935d677-f090-4761-a718-271e2999abab",
                    "paperTitle": "分橘子-1",
                    "encourage": {"62cbda5d-8b1c-4b35-b941-39824c19a7b1": [7, 10]},
                    "type": 1,
                    "worthScore": 100.0,
                    "score": 0.0,
                    "status": 2,
                    "latestScore": 0.0,
                    "reworkTimes": 0
                }]
            }, {
                "wasteTime": 1,
                "instanceId": "29f3ac7e-d70f-4ce8-b4bd-65f8c5d8423b",
                "publishTime": "2016-04-12 12:04:14",
                "publishWeek": "星期二",
                "gradeTime": "2016-04-12 22:30:33",
                "publishType": 2,
                "groupId": "610016",
                "groupName": "爱里尔一班",
                "paperHistories": [{
                    "paperId": "10aefcaa-f9b3-434c-a97e-81ee950ed792",
                    "paperTitle": "分桃子-1",
                    "encourage": {"62cbda5d-8b1c-4b35-b941-39824c19a7b1": [8, 10]},
                    "type": 1,
                    "worthScore": 100.0,
                    "score": 0.0,
                    "status": 2,
                    "latestScore": 0.0,
                    "reworkTimes": 0
                }]
            }, {
                "wasteTime": 0,
                "instanceId": "f1d73fcf-8a90-4bda-92f3-b90a7f0ae9a0",
                "publishTime": "2016-03-29 12:04:37",
                "publishWeek": "星期二",
                "gradeTime": "2016-03-29 12:05:59",
                "publishType": 2,
                "groupId": "610016",
                "groupName": "爱里尔一班",
                "paperHistories": [{
                    "paperId": "fb275e84-8385-436e-8414-7889ea5400d2",
                    "paperTitle": "面积单位-1",
                    "encourage": {"62cbda5d-8b1c-4b35-b941-39824c19a7b1": [1, 6]},
                    "type": 1,
                    "worthScore": 100.0,
                    "score": 3.0,
                    "status": 4,
                    "latestScore": 3.0,
                    "reworkTimes": 0
                }]
            }, {
                "wasteTime": 5,
                "instanceId": "44b6712d-a295-4842-9af0-08afd3eb84a8",
                "publishTime": "2016-03-25 19:40:04",
                "publishWeek": "星期五",
                "gradeTime": "2016-03-25 19:46:48",
                "publishType": 2,
                "groupId": "610016",
                "groupName": "爱里尔一班",
                "paperHistories": [{
                    "paperId": "c9a247d7-7610-4851-a712-64e9c4b7d0a5",
                    "paperTitle": "猴子的烦恼-1",
                    "encourage": {"62cbda5d-8b1c-4b35-b941-39824c19a7b1": []},
                    "type": 1,
                    "worthScore": 100.0,
                    "score": 1.4,
                    "status": 4,
                    "latestScore": 14.0,
                    "reworkTimes": 17
                }]
            }, {
                "wasteTime": 0,
                "instanceId": "1a9cedb6-87b3-4411-8180-9653746c7400",
                "publishTime": "2016-03-24 14:43:36",
                "publishWeek": "星期四",
                "gradeTime": "2016-03-26 10:09:57",
                "publishType": 2,
                "groupId": "610016",
                "groupName": "爱里尔一班",
                "paperHistories": [{
                    "paperId": "1990d2c1-6dac-4eaf-968f-9ffaed203d4e",
                    "paperTitle": "分一分（一）-1",
                    "encourage": {"62cbda5d-8b1c-4b35-b941-39824c19a7b1": [102]},
                    "type": 1,
                    "worthScore": 100.0,
                    "score": 1.0,
                    "status": 4,
                    "latestScore": 1.0,
                    "reworkTimes": 1
                }]
            }, {
                "wasteTime": 14,
                "instanceId": "10239170-c9d6-4fcf-84f1-0244ddf917e6",
                "publishTime": "2016-03-24 14:04:39",
                "publishWeek": "星期四",
                "gradeTime": "2016-03-25 17:10:47",
                "publishType": 2,
                "groupId": "610016",
                "groupName": "爱里尔一班",
                "paperHistories": [{
                    "paperId": "334545a2-3bd6-45ab-9510-6bdd4b97e3b4",
                    "paperTitle": "长方形的面积-1",
                    "encourage": {"62cbda5d-8b1c-4b35-b941-39824c19a7b1": [102]},
                    "type": 1,
                    "worthScore": 100.0,
                    "score": 2.0,
                    "status": 4,
                    "latestScore": 0.8,
                    "reworkTimes": 6
                }]
            }, {
                "wasteTime": 10,
                "instanceId": "a5f2b0f1-1df4-4eae-a255-5f3916c03cf2",
                "publishTime": "2016-03-24 14:00:22",
                "publishWeek": "星期四",
                "gradeTime": "2016-03-24 14:00:41",
                "publishType": 2,
                "groupId": "610016",
                "groupName": "爱里尔一班",
                "paperHistories": [{
                    "paperId": "7c1e6090-6cbc-40d1-aaa8-90a5ecb01e3a",
                    "paperTitle": "面积单位的换算-2",
                    "encourage": {"62cbda5d-8b1c-4b35-b941-39824c19a7b1": [10]},
                    "type": 1,
                    "worthScore": 100.0,
                    "score": 0.0,
                    "status": 2,
                    "latestScore": 0.0,
                    "reworkTimes": 0
                }]
            }, {
                "wasteTime": 2,
                "instanceId": "348f3f01-bf4a-4cff-940b-0c080ec5c43f",
                "publishTime": "2016-03-24 13:59:20",
                "publishWeek": "星期四",
                "gradeTime": "2016-03-25 19:36:32",
                "publishType": 2,
                "groupId": "610016",
                "groupName": "爱里尔一班",
                "paperHistories": [{
                    "paperId": "66930731-ff31-40ba-818e-3bd56b6441cd",
                    "paperTitle": "什么是面积-1",
                    "encourage": {},
                    "type": 1,
                    "worthScore": 100.0,
                    "score": 11.5,
                    "status": 4,
                    "latestScore": 11.5,
                    "reworkTimes": 0
                }]
            }, {
                "wasteTime": 1,
                "instanceId": "e180185e-3c9d-4ed3-9a3c-4a78d2620dcb",
                "publishTime": "2016-03-24 10:09:18",
                "publishWeek": "星期四",
                "gradeTime": "2016-03-24 10:11:37",
                "publishType": 2,
                "groupId": "610016",
                "groupName": "爱里尔一班",
                "paperHistories": [{
                    "paperId": "d6d228d7-bb6a-4272-a7db-0868f923fd5b",
                    "paperTitle": "手拉手-1",
                    "encourage": {},
                    "type": 1,
                    "worthScore": 100.0,
                    "score": 10.0,
                    "status": 4,
                    "latestScore": 10.0,
                    "reworkTimes": 2
                }]
            }, {
                "wasteTime": 2,
                "instanceId": "1a9fe4a3-3e12-4ae2-b7ff-3cc60338a020",
                "publishTime": "2016-03-22 12:14:13",
                "publishWeek": "星期二",
                "gradeTime": "2016-03-22 18:15:45",
                "publishType": 2,
                "groupId": "610016",
                "groupName": "爱里尔一班",
                "paperHistories": [{
                    "paperId": "e596482d-8de8-4de6-9ef9-96d774858e60",
                    "paperTitle": "买文具-2",
                    "encourage": {},
                    "type": 1,
                    "worthScore": 100.0,
                    "score": 0.0,
                    "status": 4,
                    "latestScore": 11.0,
                    "reworkTimes": 6
                }]
            }, {
                "wasteTime": 8,
                "instanceId": "d88649a4-7fca-48e4-91bb-a6d926288d58",
                "publishTime": "2016-03-22 10:06:22",
                "publishWeek": "星期二",
                "gradeTime": "2016-03-22 10:06:30",
                "publishType": 2,
                "groupId": "610016",
                "groupName": "爱里尔一班",
                "paperHistories": [{
                    "paperId": "83b63d4e-b2e6-4120-8a76-5e38d28a60e1",
                    "paperTitle": "小数的意义(一)-1",
                    "encourage": {},
                    "type": 1,
                    "worthScore": 100.0,
                    "score": 0.0,
                    "status": 2,
                    "latestScore": 0.0,
                    "reworkTimes": 0
                }]
            }]
        }
    };

});