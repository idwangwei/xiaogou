/**
 * Created by 华海川 on 2015/12/8.
 * 学生游戏列表
 */
import  controllers from './../index';
controllers.controller('gameListCtrl',
    function ($scope, gameService, finalData, $ionicModal, $rootScope, studentService, commonService, $state,$ionicScrollDelegate,$ionicPopup) {
        "ngInject";
        $scope.data = gameService.data;
        $scope.pubGameStudent = gameService.pubGameStudent;
        $scope.classList = {};
        $scope.studentList = $rootScope.student;
        $scope.tip="还没有收到游戏";
        $scope.retFlag = false; //默认不显示提示信息tips（请求完了才显示）
        $scope.data.gameList.length=0;
        $scope.moreFlag = true;
        var page = {seq: 0, needDataNum: 16};

        studentInit();

        function createStuClazzList() {
            let studentList = angular.copy($rootScope.student);
            let studentClazzInfo;
            $scope.studentClazzList = [];

            angular.forEach(studentList, (stu, index)=> {
                angular.forEach(stu.clazzList, (clazz)=> {
                    if (clazz.status === 1) {
                        studentClazzInfo = {};
                        studentClazzInfo.stu = stu;
                        studentClazzInfo.clazz = clazz;
                        $scope.studentClazzList.push(studentClazzInfo);
                    }
                });
            });
        }

        /**
         * 给发布的学生设置值
         */
        function setGameStudentValue(id, name, showName, stuClazzStatus) {
            $scope.pubGameStudent.id = id;
            $scope.pubGameStudent.name = name;
            $scope.pubGameStudent.showName = showName;
            $scope.pubGameStudent.stuClazzStatus = stuClazzStatus;
        }

        /**
         * 默认选中一个学生班级
         */
        function initSelectedStuClazz() {
            let stuId,stuName,studentShowName,stuClazzStatus,findIndex=-1,selecetedStuClazz;
            stuId=$scope.studentClazzList[0].stu.studentId;
            stuName=$scope.studentClazzList[0].stu.studentName;
            studentShowName=$scope.studentClazzList[0].stu.studentName+ '（' + $scope.studentClazzList[0].clazz.name + '）';
            stuClazzStatus=$scope.studentClazzList[0].stu.stuClazzStatus;
            if (!$scope.pubGameStudent.id) {
                $rootScope.selectedGameClazz = $scope.studentClazzList[0].clazz;
                setGameStudentValue(stuId, stuName, studentShowName, stuClazzStatus);
                return;
            }

            angular.forEach($scope.studentClazzList,(stuClazz,index)=>{
                if($scope.pubGameStudent.id === stuClazz.stu.studentId&&stuClazz.clazz.id===$rootScope.selectedGameClazz.id)
                    findIndex=index;
            });
            if(findIndex!=-1){
                selecetedStuClazz=$scope.studentClazzList[findIndex];
                stuId=selecetedStuClazz.stu.studentId;
                stuName=selecetedStuClazz.stu.studentName;
                studentShowName=selecetedStuClazz.stu.studentName+ '（' + selecetedStuClazz.clazz.name + '）';
                stuClazzStatus=selecetedStuClazz.stu.stuClazzStatus;
                $rootScope.selectedGameClazz = selecetedStuClazz.clazz;
                setGameStudentValue(stuId, stuName, studentShowName, stuClazzStatus);
                return;
            }
            $rootScope.selectedGameClazz = $scope.studentClazzList[0].clazz;
            setGameStudentValue(stuId, stuName, studentShowName, stuClazzStatus);

        }


        /**
         * 学生初始化
         */
        function studentInit() {
            if ($rootScope.student && $rootScope.student.length > 0) {
                createStuClazzList();
                if ($scope.studentClazzList.length) {
                    initSelectedStuClazz();
                    return;
                }
                setGameStudentValue(null, null, null, null);
            }
            setGameStudentValue(null, null, null, null);
        }



        $scope.getGameList=function(){
            if(!$rootScope.selectedGameClazz||!$rootScope.selectedGameClazz.id){
                $scope.moreFlag = false;
                $scope.tip = $scope.pubGameStudent.name+"还没有成功加入一个班级";
                $scope.retFlag = true;
                return;
            }
            if($scope.data.gameList.length>0){
                page.seq=$scope.data.gameList.length;
            }
            gameService.getGameList(page,$rootScope.selectedGameClazz.id).then(function (gameList) {
                if(gameList){
                    gameList.forEach(function(item){
                        $scope.data.gameList.push(item);
                    });
                    if(gameList.length<page.needDataNum){              //已经是最后一页了，关闭上滑加载更多
                        $scope.moreFlag = false;
                    }else{
                        $scope.moreFlag = true;
                        if(page.seq==1){
                            $ionicScrollDelegate.scrollTop();//当为第一页的时候，需要滚动到顶部。否则会加载多页。
                        }
                    }
                }else {
                    $scope.moreFlag = false;
                }
                $scope.retFlag = true;
                $scope.loadingFlag=false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }


        $scope.showLevels = function (game) {
            gameService.isGameCanPlay({cgcId:game.cgcId,cgceId:game.cgceId,seq:game.cgceSeq}).then(function(data){
                if(data.code==200){
                    gameService.selectedGame = game;
                    //$state.go('game_level');

                    gameService.pubGame.publicId = game.cgceId;
                    gameService.pubGame.levelGuid = game.levels[0].levelGuid;
                    gameService.pubGame.kdName = game.levels[0].kdName;
                    gameService.pubGame.levelNum = game.levels[0].num;
                    gameService.pubGame.gameName = game.name;
                    $state.go('game_statistics');


                    return;
                }
                if(data.code==2016||data.code==2017 ||data.code==2018) {
                    commonService.showAlert('信息提示', '该游戏已经被老师更改，请重新选择');
                    $scope.retFlag=false;
                    page.seq=0;
                    $scope.data.gameList.length=0;
                    $scope.getGameList();
                }else{
                    console.log(data.msg);
                }
            });
        }
        $ionicModal.fromTemplateUrl('student-select.html', { //初始化modal页
            scope: $scope
        }).then(function (modal) {
            $scope.studentSelectModal = modal;
            $rootScope.modal.push(modal);
        });
        $scope.selectStudent = function (student,clazz) {
            $scope.studentSelectModal.hide();
            $scope.loadingFlag=true;
            gameService.pubGameStudent.id = student.studentId;
            gameService.pubGameStudent.name = student.studentName;
            $scope.pubGameStudent.showName = student.studentName+'（'+clazz.name+'）';
            $scope.pubGameStudent.stuClazzStatus=student.stuClazzStatus||null;
            $scope.retFlag = false;
            $scope.data.gameList.length=0;
            page.seq=0;
            $rootScope.selectedGameClazz=clazz;
            $scope.getGameList();
        };

        $scope.help =function(){
            $ionicPopup.alert({
                title: '常见问题',
                template: `
                <p style="color: #377AE6 !important;">问：家长端能够玩游戏吗？</p>
                <p>答：不能。需要退出登录，进入学生端才能玩游戏。</p>`,
                okText: '确定'
            });
        };

        $scope.getGameIconUrl = function(gameGuid){
            let name = gameGuid.match(/ab4_03|ab4_04/) ? 'ab4_other':gameGuid.split('_')[0];
            return $rootScope.loadImg('game_icon/'+name+'.png');
        }
        /*注冊返回*/
        $rootScope.viewGoBack=function () {
            return "exit";
        }.bind(this)
    });
