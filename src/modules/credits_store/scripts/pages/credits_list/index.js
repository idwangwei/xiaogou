/**
 * Created by qiyuexi on 2017/11/7.
 */
import {Inject, View, Directive, select} from 'ngDecorator/ng-decorator';

@Directive({
    selector: 'creditsList',
    template: require('./page.html'),
    styles: require('./style.less'),
    replace: true
})

@View('credits_list', {
    url: 'credits_list/:fromUrl',
    template: '<credits_list></credits_list>'
})

@Inject( '$scope', '$state','$ngRedux','creditsInfoService','$stateParams','$ionicHistory','$rootScope')
class CreditsListCtrl {
    @select(state=>state.teacher_credits_detail) score_all;
    onBeforeLeaveView() {
        this.creditsInfoService.cancelRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.creditsInfoService.cancelRequestList.length=0;
    }
    onAfterEnterView(){
        this.initData();
    }
    constructor(){
        this.score_list=[];//列表数据容器
        this.pageIndex=1;
        this.pageSize=10;
        this.isFinish=true;//是否没有数据了 默认没有


    }
    /*初始化页面*/
    initData(){
        this.pageIndex=1;
        this.isFinish=true;
        this.getScoreInfo();
        this.getTeaScoreList().then((data)=>{
            this.score_list=data;
            this.getScope().$broadcast('scroll.refreshComplete');//停止广播下拉
        });
    }
    /*下拉加载*/
    loadMore(){
        this.pageIndex++;
        this.getTeaScoreList().then((data)=>{
            console.log(data);
            this.score_list=this.score_list.concat(data);//初始化数据
            this.getScope().$broadcast('scroll.infiniteScrollComplete');//停止加载广播
        });
    }
    /*获取列表数据*/
    getTeaScoreList(){
        return this.creditsInfoService.fetchTeaScoreList({
            startIndex:this.pageIndex,
            size:this.pageSize,
        }).then((data)=>{
            if(data.length<this.pageSize){
                this.isFinish=true
            }else{
                this.isFinish=false
            }
            data.map((x)=>{
                x.subType=x.subType||0;
                x.detail=x.dateTime.split(" ")[0]+" "+x.detail;
                return x;
            })
            return data;
        });
    }
    /*获取积分信息*/
    getScoreInfo(){
        return this.creditsInfoService.fetchTeaScoreDetail({});
    }
   /* getStrLength(str) {
        return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
    }*/
    back() {
        if(this.$ionicHistory.backView()!==null){
            this.$ionicHistory.goBack()
        }else{
            if (this.$stateParams.fromUrl) {
                this.go(this.$stateParams.fromUrl)
            } else {
                this.go('home.work_list');
            }
        }
    }
    goCreditsStore(){
        this.go('credits_store');
    }
    goCreditsTask(){
        this.go('credits_store_task');
    }
}

export default CreditsListCtrl