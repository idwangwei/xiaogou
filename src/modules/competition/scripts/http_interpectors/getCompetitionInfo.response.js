/**
 * Created by pjl on 2017/3/18.
 */
/**
 * Created by 彭建伦 on 2016/6/7.
 * 拦截 登录请求获取竞赛信息
 */
let getCompetitionInfo = function ($q,$rootScope,competitionInterface) {
    return {
        response: function (res) {
            let deferred = $q.defer();
            if(res.config.url.indexOf('login') != -1 && (res.data.code == 200 ||res.data.code == 601||res.data.code == 609)){
                //自动登录，换账号登录$rootScope没有销毁
                $rootScope.competition = res.data.loginName == $rootScope.loginName ? ($rootScope.competition||{}):{};
                $rootScope.hasCompetition = false;
                $rootScope.loginName = res.data.loginName;

                if(res.data.competition && res.data.competition.length){
                    $rootScope.hasCompetition = true;

                    $rootScope.competition.area = res.data.competition[0].area || "";
                    $rootScope.competition.progressInfo = res.data.competition[0].progressInfo || {};
                    var infoArr = $rootScope.competition.area.split("@");
                    $rootScope.competitionSchoolTitle = infoArr[0]+infoArr[1]; //举办竞赛的区域标题
                    $rootScope.competitionPaperTitle = infoArr[2]+'（'+infoArr[3]+'）'; //竞赛试卷名称
                }else {
                    $rootScope.competition = {};
                }
                if(res.config.url.indexOf('student') != -1){$rootScope.currentSystem = 'student';$rootScope.showCompetitionAdAlertBoxFlag = true;}
                if(res.config.url.indexOf('teacher') != -1){$rootScope.currentSystem = 'teacher'}
                if(res.config.url.indexOf('parent') != -1){$rootScope.currentSystem = 'parent';$rootScope.showCompetitionAdAlertBoxFlag = true;}
                $rootScope.$emit('fetch_competition_info_from_server');
            }
            console.log("http interceptor!!!!");
            deferred.resolve(res);
            return deferred.promise;
        },
        request:function (config) {
            let deferred = $q.defer();

            //学生端登录成功获取竞赛试卷信息
            let isStudent = config.url === competitionInterface.GET_COMPETITION_PAPER_INFO;
            let isTeacher = config.url === competitionInterface.GET_COMPETITION_PAPER_INFO_TEACHER;
            if ((isStudent || isTeacher) && config.url.indexOf('shardingId') === -1){
                config.url = config.url
                    + '?shardingId=' + config.data.groupId
                    + '&businessType=qbu';
            }

            deferred.resolve(config);
            return deferred.promise;
        }
    }
};
getCompetitionInfo.$inject = ['$q','$rootScope','competitionInterface'];
export default getCompetitionInfo;

