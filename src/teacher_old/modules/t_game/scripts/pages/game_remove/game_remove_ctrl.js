/**
 * Created by ww on 2016/4/7.
 * 试玩游戏删除
 */

import {Inject, View, Directive, select} from '../../module';
@View('game_remove', {
    url: '/game_remove',
    styles: require('./style.less'),
    template: require('./game_remove.html'),
    inject: ["$scope", "$timeout", "commonService", "$rootScope", "$state", '$ngRedux']
})
class gameRemoveCtrl {
    commonService;

    showLoadingWord = false;

    back() {
        this.go("chapter_game_list")
    };

    initData() {
        this.gradePackageConfig = [
            {
                grade: '一年级上册',
                packages: [
                    {name: "mathgames11", gameArr: ['礼物工厂', '跷跷板', '小熊的娃娃机', '小兔过河', '熊猫实验室', '加减球场']},
                    {name: "mathgames12", gameArr: ['海狸搬家', '田田的果园1', '图形部落', '时钟小飞', '云端棉花糖']}
                ]
            },
            {
                grade: '一年级下册',
                packages: [
                    {name: "mathgames13", gameArr: ['田田的果园2', '寻榛记1', '寻榛记2', '图形部落2']},
                    {name: "mathgames14", gameArr: ['寻榛记3', '穿越魔法门', '步步升糕', '怪兽阶梯']}
                ]
            },
            {
                grade: '二年级上册',
                packages: [
                    {name: "mathgames21", gameArr: ['捕鱼大比拼', '小迷糊买礼物', '南瓜怪管农场', '部落捣蛋鬼']},
                    {name: "mathgames22", gameArr: ['树爷爷的秘诀1', 'MR KEY的恶作剧', '植物人种花记', '树爷爷的秘诀2', '农场大丰收']}
                ]
            },
            {
                grade: '二年级下册',
                packages: [
                    {name: "mathgames23", gameArr: ['雪人盛会', '寻找彩虹岛', '飓风港大亨', '港口之星']},
                    {name: "mathgames24", gameArr: ['萌逗小人国', '星星商业街', '星星美食街', '图形部落3', '时钟小飞2', '森林聚会']}
                ]
            },
            {
                grade: '三年级上册',
                packages: [
                    {name: "mathgames31", gameArr: ['机器人维修站', '海岛部队', '酋长的契约', '部落魔法师']},
                    {name: "mathgames32", gameArr: ['保卫海底家园', '帮帮智多虫', '艾尔岛的休息日', '章鱼开店']}
                ]
            },
            {
                grade: '三年级下册',
                packages: [
                    {name: "mathgames33", gameArr: ['淘气小公主', '春天的盛会', '图图马戏团', '海底探宝队']},
                    {name: "mathgames34", gameArr: ['小象嘟嘟减肥记', '烦恼的小七', '忍者寿司店', '海底选美大赛']}
                ]
            },
            {
                grade: '速算',
                packages: [
                    {name: "mathgames90", gameArr: ['速算']}
                ]
            }
        ];
        this.downloadGamePackage = [];
        this.gradePackageConfig.forEach((grade, index)=> {
            this.downloadGamePackage[index] = {
                grade: grade.grade,
                packages: []
            };
        });


    }

    initFlagData() {
        this.showLoadingWord = true;
        this.listEmpty = false;
        this.getRootScope().isLoadingProcessing = true;
    }

    onAfterEnterView() {
        this.$timeout(()=> {
            this.initData();
            if (AppDir) {
                this.initFlagData();
                AppDir.getGamesInfo((error, data)=> {
                    if (error) {
                        return console.error(error);
                    }
                    if (!data.length) {
                        this.getScope().$apply(()=> {
                            this.listEmpty = true;
                        })
                    }
                    data.forEach((item, i)=> {
                        var name = "mathgames" + item.name;
                        var pkg = this.getPackage(name);
                        var p = pkg.package;
                        p.size = item.totalSizeMb;
                        p.index = i + 1;
                        this.getScope().$apply(()=>{
                            this.downloadGamePackage[pkg.idx].packages.push(p);
                        });
                    });
                    this.getScope().$apply(()=>{
                        this.getRootScope().isLoadingProcessing = false;
                        this.showLoadingWord = false;
                    })
                });
            } else {
                return console.error('AppDir is not defined!');
            }
        }, 500);
    }

    getPackage(name) {
        var rt = {};
        this.gradePackageConfig.forEach((grade, index)=>{
            grade.packages.forEach((p)=>{
                if (p.name == name) {
                    rt.idx = index;
                    rt.package = p;
                }
            });
        });
        return rt;
    }

    removePackage(grade, index) {
        this.commonService.showConfirm("消息提示", "是否删除该游戏包?").then((res)=>{
            if (res) {
                var name = grade.packages[index].name;
                var nameTail = name.substr(name.length - 2, name.length);
                AppDir.delGameDir(nameTail, (error)=> {
                    if (error) {
                        console.error(error);
                        this.commonService.showAlert("提示", "<p>删除失败!</p>");
                    } else {
                        this.getScope().$apply(()=>{
                            grade.packages.splice(index, 1);
                            console.log('delete success!')
                        });
                    }
                });
            }
        });
    };
}
export default gameRemoveCtrl;
/*controllers.controller('gameRemoveCtrl',
 ["$scope", "$timeout", "commonService", "$rootScope", "$state", function ($scope, $timeout, commonService, $rootScope, $state) {
 $scope.showLoadingWord = false;
 $timeout(function () {
 $scope.gradePackageConfig = [
 {
 grade: '一年级上册',
 packages: [
 {name: "mathgames11", gameArr: ['礼物工厂', '跷跷板', '小熊的娃娃机', '小兔过河', '熊猫实验室', '加减球场']},
 {name: "mathgames12", gameArr: ['海狸搬家', '田田的果园1', '图形部落', '时钟小飞', '云端棉花糖']}
 ]
 },
 {
 grade: '一年级下册',
 packages: [
 {name: "mathgames13", gameArr: ['田田的果园2', '寻榛记1', '寻榛记2', '图形部落2']},
 {name: "mathgames14", gameArr: ['寻榛记3', '穿越魔法门', '步步升糕', '怪兽阶梯']}
 ]
 },
 {
 grade: '二年级上册',
 packages: [
 {name: "mathgames21", gameArr: ['捕鱼大比拼', '小迷糊买礼物', '南瓜怪管农场', '部落捣蛋鬼']},
 {name: "mathgames22", gameArr: ['树爷爷的秘诀1', 'MR KEY的恶作剧', '植物人种花记', '树爷爷的秘诀2', '农场大丰收']}
 ]
 },
 {
 grade: '二年级下册',
 packages: [
 {name: "mathgames23", gameArr: ['雪人盛会', '寻找彩虹岛', '飓风港大亨', '港口之星']},
 {name: "mathgames24", gameArr: ['萌逗小人国', '星星商业街', '星星美食街', '图形部落3', '时钟小飞2', '森林聚会']}
 ]
 },
 {
 grade: '三年级上册',
 packages: [
 {name: "mathgames31", gameArr: ['机器人维修站', '海岛部队', '酋长的契约', '部落魔法师']},
 {name: "mathgames32", gameArr: ['保卫海底家园', '帮帮智多虫', '艾尔岛的休息日', '章鱼开店']}
 ]
 },
 {
 grade: '三年级下册',
 packages: [
 {name: "mathgames33", gameArr: ['淘气小公主', '春天的盛会', '图图马戏团', '海底探宝队']},
 {name: "mathgames34", gameArr: ['小象嘟嘟减肥记', '烦恼的小七', '忍者寿司店', '海底选美大赛']}
 ]
 },
 {
 grade: '速算',
 packages: [
 {name: "mathgames90", gameArr: ['速算']}
 ]
 }
 ];
 $scope.back = function () {
 $state.go("chapter_game_list")
 };
 $rootScope.viewGoBack = $scope.back.bind($scope);

 $scope.downloadGamePackage = [];
 $scope.gradePackageConfig.forEach(function (grade, index) {
 $scope.downloadGamePackage[index] = {
 grade: grade.grade,
 packages: []
 };
 });

 if (!AppDir) {
 return console.error('AppDir is not defined!');
 }

 $scope.$root.isLoadingProcessing = true;
 $scope.showLoadingWord = true;
 $scope.listEmpty = false;
 AppDir.getGamesInfo(function (error, data) {
 if (error) {
 return console.error(error);
 }
 if (!data.length) {
 $scope.$apply(function () {
 $scope.listEmpty = true;
 })
 }
 data.forEach(function (item, i) {
 var name = "mathgames" + item.name;
 var pkg = getPackage(name);
 var p = pkg.package;
 p.size = item.totalSizeMb;
 p.index = i + 1;
 $scope.$apply(function () {
 $scope.downloadGamePackage[pkg.idx].packages.push(p);
 });
 });
 $scope.$apply(function () {
 $scope.$root.isLoadingProcessing = false;
 $scope.showLoadingWord = false;
 })
 });


 function getPackage(name) {
 var rt = {};
 $scope.gradePackageConfig.forEach(function (grade, index) {
 grade.packages.forEach(function (p) {
 if (p.name == name) {
 rt.idx = index;
 rt.package = p;
 }
 });
 });
 return rt;
 }


 $scope.removePackage = function (grade, index) {
 commonService.showConfirm("消息提示", "是否删除该游戏包?").then(function (res) {
 if (res) {
 var name = grade.packages[index].name;
 var nameTail = name.substr(name.length - 2, name.length);
 AppDir.delGameDir(nameTail, function (error) {
 if (error) {
 console.error(error);
 commonService.showAlert("提示", "<p>删除失败!</p>");
 } else {
 $scope.$apply(function () {
 grade.packages.splice(index, 1);
 console.log('delete success!')
 });
 }
 });
 }
 });
 };
 }, 500);
 }]);*/
