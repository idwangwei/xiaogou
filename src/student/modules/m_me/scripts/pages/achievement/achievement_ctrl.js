/**
 * Created by 华海川 on 2015/10/19.
 * 学生成就
 */
import {Inject, View, Directive, select} from '../../module';


@View('achievement', {
    url: '/achievement',
    template: require('./achievement.html'),
    styles: require('./achievement.less'),
    inject: [  '$scope'
        ,'$rootScope'
        ,'$state'
        ,'$timeout'
        ,'$ionicHistory'
        ,'$ngRedux'
        ,'profileService']
})
class AchievementCtrl {
    $ngRedux;
    $scope;
    $timeout;
    profileService;
    constructor(){
        this.initData();
    }

    initData(){
        this.initCtrl = false;
        this.achievements = []; //表扬列表

        this.getScope().termData = {nowTerm: '', terms: []};   //本学年，选择学年
        this.getScope().START_YEAR = 2015;                  //起始年份
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if (1 <= month&&month < 9) {
            year = year - 1;
        }
        this.getScope().termData.nowTerm = (year) + '-' + (year + 1)+' 学年';
        for (var i = this.getScope().START_YEAR; i <= year; i++) {
            var temp = (i) + '-' + (i + 1)+' 学年';
            this.getScope().termData.terms.push(temp);
        }

        this.startTime = this.getScope().termData.nowTerm.substring(0, 4) + '-09-01';
        this.endTime = (parseInt(this.getScope().termData.nowTerm.substring(0, 4)) + 1) + '-08-31';
    }
    onReceiveProps() {
        this.ensurePageData();
    }

    getAchievementList(){
        this.startTime = this.getScope().termData.nowTerm.substring(0, 4) + '-09-01';
        this.endTime = (parseInt(this.getScope().termData.nowTerm.substring(0, 4)) + 1) + '-08-31';
        this.pullRefresh();
    }


    ensurePageData(){
        if(!this.initCtrl){
            this.initCtrl = true;
            this.pullRefresh();
        }
    }
    pullRefresh(){
        this.fetchAchievementList(this.startTime, this.endTime).then((data)=>{
            if(data){
                this.achievements.splice(0,this.achievements.length);
                angular.forEach(this.achievementsLocal,(item)=>{
                    this.achievements.push(item);
                });
            }
            this.getScope().$broadcast('scroll.refreshComplete');
        },()=>{
            this.getScope().$broadcast('scroll.refreshComplete');
        });
    }
    back(){
        this.go('home.me','back');
    }




    mapStateToThis(state) {
        return {
            achievementsLocal: state.profile_achievement.achievementList
        }
    }

    mapActionToThis() {
        let ps=this.profileService;
        return {
            fetchAchievementList: ps.fetchAchievementList.bind(ps)
        }
    }
}
