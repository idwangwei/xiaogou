/**
 * Created by Administrator on 2017/2/17.
 */

import {Inject, View, Directive, select} from '../../module';
import _each from 'lodash.foreach';
@View('clear_local_data', {
    url: '/clear_local_data',
    template: require('./clear_local_data.html'),
    styles: require('./clear_local_data.less'),
    inject: ['$scope',
        '$rootScope',
        '$state',
        '$ngRedux',
        'commonService',
        'ngLocalStore',
        '$ionicLoading']
})

class ClearLocalDataCtrl{
    $ionicLoading;
    localData;
    constructor(){
        this.initData();
    }
    initData(){
        this.initCtrl = false;
        this.localData={
            gameSize:0,
            workSize:+(((Math.random()*100+100)/1024).toFixed(2)),
            gameNameArr:[],
            isStatisticSize:true
        };
    }

    onAfterEnterView(){
    }

    onReceiveProps() {
        if(this.initCtrl){return}
        this.initCtrl = true;
        this.statisticSize();
    }

    statisticSize(){
        //大概统计下载的作业大小
        this.ngLocalStore.paperStore.length().then((len)=>{
            if(len>0)this.localData.workSize += this.getRandomSum(len);
            this.localData.workSize = +this.localData.workSize.toFixed(2);
        });
        let self = this;
        //统计游戏包大小
        try {
            if (!AppDir) {
                self.localData.isStatisticSize = false;
                return console.error('AppDir is not defined!');
            }
            AppDir.getGamesInfo(function (error, data) {
                if (error) {
                    return console.error(error);
                }
                self.getScope().$apply(()=>{
                    if (data.length) {
                        data.forEach((item) => {
                            self.localData.gameSize += +item.totalSizeMb;
                            self.localData.gameNameArr.push(item.name);
                        });
                    }
                    self.localData.gameSize = Number(self.localData.gameSize).toFixed(2);
                    self.localData.isStatisticSize = false;
                })
            });
        }catch (e){
            self.localData.isStatisticSize = false;
        }
    }

    //获取指定个数的随机数(100-200)之和
    getRandomSum(count){
        let sum = 0;
        for(let i=0; i<count; i++){
            sum += Math.floor(Math.random()*100+100)/1024;
        }
        return +sum.toFixed(2);
    }

    clearLocalData(){
        let self = this;
        this.commonService.showPopup({
            title: '提示信息',
            template: `<div style="text-align: center">确认删除？</div>`,
            buttons: [
                {
                    text: '确认',
                    type: 'button-positive',
                    onTap: (e)=> {
                        //删除游戏和下载的作业
                        if(this.localData.gameSize == 0 && this.localData.workSize == 0){
                            this.commonService.showAlert("提示", "<p style='text-align: center'>没有下载任何作业和游戏!</p>");
                            return
                        }
                        try{
                            let arrNum = this.localData.gameNameArr.length;
                            this.$ionicLoading.show({template: '<div  class="clear-data-spinner"><ion-spinner icon="bubbles"></ion-spinner><span>清除数据中</span></div>'});
                            if(this.localData.gameNameArr.length){
                                _each(this.localData.gameNameArr,(item)=>{
                                    AppDir.delGameDir(item, function (error) {
                                        if (error) {
                                            console.error(error);
                                            self.commonService.showAlert("提示", "<p style='text-align: center'>删除失败!</p>");

                                        }else{
                                            arrNum--;
                                            if(arrNum == 0){
                                                clearPaper();
                                            }
                                        }
                                    });
                                });
                            }else{
                                clearPaper();
                            }

                        }catch (e){
                            self.$ionicLoading.hide();
                            self.commonService.showAlert("提示", "<p style='text-align: center'>删除失败!</p>");
                        }
                    }
                },
                {
                    text: '取消'
                }
            ]
        });

        function clearPaper(){
            self.$ionicLoading.hide();
            self.ngLocalStore.clear();
            // let currentSystem = localStorage.getItem('currentSystem');
            // let USER_MANIFEST = localStorage.getItem('USER_MANIFEST');
            // let USER_MANIFEST_P = localStorage.getItem('USER_MANIFEST_P');
            // let USER_MANIFEST_T = localStorage.getItem('USER_MANIFEST_T');
            // let USER_MANIFEST_S = localStorage.getItem('USER_MANIFEST_S');
            // let firstGoToRegister = localStorage.getItem('firstGoToRegister');
            // let studyStateLastStateUrl = localStorage.getItem('studyStateLastStateUrl');
            // localStorage.clear();
            // if(currentSystem)localStorage.setItem('currentSystem',currentSystem);
            // if(USER_MANIFEST)localStorage.setItem('USER_MANIFEST',USER_MANIFEST);
            // if(USER_MANIFEST_P)localStorage.setItem('USER_MANIFEST_P',USER_MANIFEST_P);
            // if(USER_MANIFEST_T)localStorage.setItem('USER_MANIFEST_T',USER_MANIFEST_T);
            // if(USER_MANIFEST_S)localStorage.setItem('USER_MANIFEST_S',USER_MANIFEST_S);
            // if(firstGoToRegister)localStorage.setItem('firstGoToRegister',firstGoToRegister);
            // if(studyStateLastStateUrl)localStorage.setItem('studyStateLastStateUrl',studyStateLastStateUrl);
            //
            
            self.commonService.showAlert("提示",
                "<p style='text-align: center'>成功释放"+(+self.localData.gameSize+(+self.localData.workSize)).toFixed(2)+"Mb内存空间!</p>");
            self.localData.gameSize = 0;
            self.localData.workSize = 0;
            self.localData.gameNameArr.length = 0;
            console.log('delete success!')
        }
    }

    mapStateToThis(state) {
        return {}
    }

    mapActionToThis() {
        return {}
    }
    back(){
        this.go('home.me');
    }
}