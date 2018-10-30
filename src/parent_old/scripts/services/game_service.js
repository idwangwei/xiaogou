/**
 * Created by 华海川 on 2015/12/8.
 * 游戏service
 */

define(['./index'], function (services) {
    services.service('gameService',['$log', 'commonService', 'serverInterface','profileService','$rootScope','finalData','studentService','$q',
        function ($log, commonService, serverInterface,profileService,$rootScope,finalData,studentService,$q) {
            this.data={gameList:[]};
            this.pubGame ={publicId:'',classId:'',levelGuid:'',gameName:'',kdName:'',levelNum:'',className:''}; //一个已发布游戏相关信息
            this.pubGameStudent={id:null,name:null,showName:null};             //学生id
            this.errorStats={tabTitle:[],tabData:[],total:{}};   //错误统计
            this.selectedGame=null;
            /**
             * 获取游戏列表
             */
            this.getGameList = function (page,clzId) {
                var me = this;
                var defer =$q.defer();
                var params={stuId:me.pubGameStudent.id,subject: 1,category: finalData.homeOrClazz.type,clzIds:clzId};
                params.page=JSON.stringify(page);
                commonService.commonPost(serverInterface.GET_GAME_DATA, params).then(function (data) {
                    var gameList=[];
                    if(data.code!=200){
                        defer.resolve(false);
                        return;
                    }
                    if (data&&data.gameGrades.games) {
                       data.gameGrades.games.forEach(function(game){
                           var levelNums=game.levelNums;
                           if(levelNums){
                               levelNums=levelNums.split(',');
                               if(levelNums.length==1){
                                   game.showNum="第"+levelNums[0]+'关';
                               }else{
                                   game.showNum="第"+levelNums[0]+'-'+levelNums[levelNums.length-1]+'关';
                               }
                           }
                           gameList.push(game);
                       });
                    }
                    defer.resolve(gameList);
                });
                return defer.promise;
            };

            /**
             * 获取一个发布游戏的关卡
             * @param  cgceId:发布id  | cgcId:对应游戏id
             * @returns {promise}
             */
            this.getPubGameLevels=function(){
                var params={
                    role:'P',
                    stuId:this.pubGameStudent.id,
                    cgceId:this.selectedGame.cgceId,
                    cgcId:this.selectedGame.cgcId
                }
                return commonService.commonPost(serverInterface.GET_PUB_GAME_LEVELS,params);
            }

            /**
             * 获取个人错误统计
             * @param studentId 学生id
             */
            this.getErrorByStu =function(){
                var params={
                    studentId:this.pubGameStudent.id,
                    publicId:this.pubGame.publicId,
                    levelGuid:this.pubGame.levelGuid
                }
                var me =this;
                commonService.commonPost(serverInterface.GET_ERROR_BYSTU,params).then(function(data){
                    if(data){
                        debugger;
                        me.errorStats.tabTitle = data.data.tabTitle;
                        me.errorStats.tabData  =data.data.tabData;
                        me.errorStats.total = data.data.total;
                    }
                })
            }

            /**
             * 判断该游戏是否能玩
             * @returns {promise}
             */
            this.isGameCanPlay=function(params){
                return commonService.commonPost(serverInterface.IS_GAME_CAN_PLAY,params);
            }

        }]);
});
