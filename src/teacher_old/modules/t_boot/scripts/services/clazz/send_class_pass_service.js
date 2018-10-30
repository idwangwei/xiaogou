/**
 * Created by 邓小龙 on 2015/7/23.
 * @description
 * classGameService 课堂游戏服务
 */
import services from "./../index";
'use strict';
services.factory('classGameService', ['$http', '$q', 'mockInterface', function ($http, $q, mockInterface) {

    var rowArray = [];//行数组
    var colArray = [];//列数组
    var initData = {   //sendClassPassCtrl的初始化数据
        items: [],       //已布置游戏数组
        allGames: []    //选择关卡游戏数组
    };

    /**
     * 获取所有游戏列表承诺
     */
    function getAllGameListPromise() {
        var defer = $q.defer();
        $http.get(mockInterface.GET_CLASS_GAME_LIST).success(function (response) {
            defer.resolve(response);
        })
        return defer.promise;
    };

    /**
     * 得到初始化数据
     */
    function getInitData() {
        if (initData.items.length == 0 && initData.allGames.length == 0) {//如果初始数据没有，就进行初始化。
            getAllGameListData();
            return initData;
        }
        return initData;
    }

    /**
     * 处理所有游戏列表的回调函数，即从后台获取到的数据。
     */
    function getAllGameListData() {
        getAllGameListPromise().then(function (data) {

            angular.forEach(data, function (baseInfo) { //循环主对象

                angular.forEach(baseInfo.detail, function (detailInfo, index) { //循环子对象

                    if (detailInfo.selectedPass) {//获取已布置的游戏
                        var retInfo = {};//构造一个零时对象，将原来的主从表分离开
                        retInfo.detailId = detailInfo.detailId;
                        retInfo.passName = detailInfo.passName;
                        retInfo.passDecribe = detailInfo.passDecribe;
                        retInfo.baseId = baseInfo.baseId;
                        retInfo.gameImg = baseInfo.gameImg;
                        retInfo.gameName = baseInfo.gameName;
                        initData.items.push(retInfo);
                    } else {//获取可以选择的关卡
                        colArray.push(detailInfo);
                        if (colArray.length == 2) {//处理一列两列情况，列有两个元素时，就用行数组来装列数组
                            rowArray.push(colArray);
                            colArray = [];//清空列数组
                        }
                    }
                });
                if (colArray.length != 0) {//某一个游戏明细只有一个关卡可以添加的情况。
                    rowArray.push(colArray);
                    colArray = [];
                }
                if (rowArray.length > 0) {//明细有数据，此时主表才显示
                    baseInfo.detailArry = rowArray;
                    rowArray = [];
                    initData.allGames.push(baseInfo);
                }
                //baseInfo.detailArry=rowArray;
                //rowArray=[];
                //initData.allGames.push(baseInfo);

            });

        });
    };

    /**
     * 即保存已选择的关卡
     * @param allGames 游戏关卡数组
     * @param items 已发布的游戏数组
     * @returns {{allGames: Array, items: Array}}
     */
    function savaPass(allGames, items) {
        var retInfo = {
            allGames: [],
            items: []
        };
        angular.forEach(allGames, function (game) {
            angular.forEach(game.detailArry, function (passColArray, index) {
                if (passColArray.length > 0) {
                    var i = 0;
                    while (i < passColArray.length) {
                        if (passColArray[i].selectedPass) {//如果已勾选
                            var retInfo = {};//构造一个零时对象
                            retInfo.detailId = passColArray[i].detailId;
                            retInfo.passName = passColArray[i].passName;
                            retInfo.passDecribe = passColArray[i].passDecribe;
                            retInfo.baseId = game.baseId;
                            retInfo.gameImg = game.gameImg;
                            retInfo.gameName = game.gameName;
                            retInfo.selectedPass = true;
                            items.push(retInfo);//把这个对象加入到已发布游戏数组中
                            passColArray.splice(i, 1);//而关卡选择数组就删掉这个元素。
                        } else {
                            //debugger;
                            if (index != 0 && game.detailArry[index - 1].length == 1) { //这里是处理勾选一行一列，需要合并列的情况如第一行[A,B]
                                // 第二行[C,D]，此时勾选到A和C那么需要构建[B,D]为一行
                                var preArry = game.detailArry[index - 1];//找到之前第一行数据有一个元素(除了index为0情况)
                                preArry.push(passColArray[i]);//给之前那一行添加该元素
                                passColArray.splice(i, 1);//当前数组删除当前元素
                            } else {
                                i = i + 1; //只有当没有删除元素时，i才+1，否则就指向当前索引。
                            }
                            //i=i+1; //只有当没有删除元素时，i才+1，否则就指向当前索引。

                        }
                    }
                }
            });
        });
        angular.forEach(allGames, function (game) {
            angular.forEach(game.detailArry, function (passColArray) {
                if (passColArray.length > 0) {

                }
            });
        });
        retInfo.allGames = allGames;
        retInfo.items = items;
        return retInfo;
    };
    /**
     * 删除已发布游戏
     * @param item  当前已发布游戏
     * @param index 当前已发布游戏索引
     * @param allGames 游戏关卡数组
     * @param items 已发布的游戏数组
     * @returns {{allGames: Array, items: Array}}
     */
    function deleteItem(item, index, allGames, items) {
        var retInfo = {
            allGames: [],
            items: []
        };
        angular.forEach(allGames, function (game) {
            if (item.baseId == game.baseId) {//如果当前要删除的游戏关卡和遍历的一样
                var rowArray = [];//行数组
                var detailInfo = {};//临时对象
                detailInfo.passName = item.passName;
                detailInfo.passDecribe = item.passDecribe;
                detailInfo.detailId = item.detailId;
                detailInfo.selectedPass = false;
                if (game.detailArry.length > 0) {//如果有明细数组，这里detailArry是二维数组
                    if (game.detailArry[game.detailArry.length - 1].length == 1) {//如果该二维数组最后一个元素（该元素是一维数组）有一个元素，即属于一行一列，可以在该数组添加一列。
                        game.detailArry[game.detailArry.length - 1].push(detailInfo);//给该元素添加一列。
                    } else {
                        rowArray.push(detailInfo);
                    }
                } else {
                    rowArray.push(detailInfo);
                }
                if (rowArray.length > 0) {//如果行数组被赋值，就添加该数组。
                    game.detailArry.push(rowArray);
                }
                items.splice(index, 1);//已发布的游戏删掉该元素。
            }
        });
        retInfo.allGames = allGames;
        retInfo.items = items;
        return retInfo;
    };
    return {
        getInitData: getInitData,
        savaPass: savaPass,
        deleteItem: deleteItem
    };

}]);
