/**
 * Created by qiyuexi on 2017/12/18.
 */
import {Inject, View, Directive, select} from './../../module';

@View('micro_example_list', {
    url: '/micro_example_list',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope'
        ,'$state'
        ,'$ngRedux'
        ,'$stateParams'
        ,'$ionicHistory'
        ,'$rootScope'
        ,"microUnitService"
        ,"microVipService"
        ,'$ionicPopup'
        ,'wxPayService'
        ,'$ionicScrollDelegate'
    ]
})

class MicroExampleList {
    $ionicPopup
    microVipService
    microUnitService
    wxPayService
    $ionicScrollDelegate
    @select(state=>state.micro_select_unit_item) selectUnitItem;
    @select(state=>state.micro_example_list) allExampleList;
    @select(state=>state.micro_select_example_item) selectExampleItem;
    @select(state => state.profile_user_auth.user.vips) vipInfo;
    onBeforeLeaveView() {
        this.microUnitService.cancelRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.microUnitService.cancelRequestList.length=0;
    }
    constructor(){
        this.resetExampleList=[];
        this.isPayModalShowFlag=false;
        this.isExpendModalShowFlag=false;
        this.introduce="";
    }
    onAfterEnterView(){
        this.initData();
        this.initFn();
    }
    mapActionToThis() {
        return {
            paySuccessModifyVips: this.wxPayService.paySuccessModifyVips.bind(this.wxPayService)
        }
    }
    /*初始化页面*/
    initData(){
        this.vipNum=0;
    }
    initFn(){
        this.getVipNum();
        this.paySuccessModifyVips().then(()=>{
            this.getVipNum();
        });//更新个数
        this.fetchMicroExampleList().then(()=>{
            this.setMicroExampleList()
        });
    }
    hidePayModal(){
        this.isPayModalShowFlag=false;
    }
    hideExpendModal(){
        this.isExpendModalShowFlag=false;
    }
    fetchMicroExampleList(){
        return this.microUnitService.fetchMicroExampleList({
            code:this.selectUnitItem.code
        }).then((data)=>{
          this.introduce=data.introduce;
        })
    }
    setMicroExampleList(){
        this.resetExampleList=[];
        this.allExampleList.forEach((x,i)=>{
            let itm=Object.assign({},x);
            itm.eighthTagName.match(/#(\d+)\s/);
            itm.num=RegExp.$1;
            itm.name=this.selectUnitItem.subtitle
            if(!itm.open){
                itm.stateMark=0
            }else{
                //state后端定义  1：第一步做过 2:已完成
                if(itm.state==2){
                    itm.stateMark=2;
                }else{
                    itm.stateMark=1;
                }
            }
            this.resetExampleList.push(itm);
        })
        this.resetExampleList.sort((a,b)=>{
            return a.seq_num-b.seq_num;
        })
        this.$ionicScrollDelegate.$getByHandle('micro_example_list').resize();
    }
    openResource(){
        return this.microVipService.openVipResource({
            type:'tinyClassKey',
            resourceId:this.selectExampleItem.groupId
        }).then(()=>{
            this.paySuccessModifyVips().then(()=>{
                this.getVipNum();
            });//更新个数
            this.go("micro_example_detail")
        }).catch((msg)=>{
            this.$ionicPopup.alert({
                title: '提示',
                template:msg
            });
        }).then(()=>{
            this.hideExpendModal();
        })
    }
    getVipNum(){
        this.vipInfo.forEach((x, i)=> {
            if (x.hasOwnProperty('tinyClassKey')) this.vipNum = x.tinyClassKey;
        });
    }
    /*去智导微课的详情步骤页面*/
    goToExampleDetail(v){
        let param={
            groupId:v.eighthTagId,
            groupName:v.name,
            num:v.num,
            starArr:v.starArr
        }
        this.microUnitService.selectMicroExampleItem(param);//储存起来
        //还未开启
        if(v.stateMark==0){
            //钥匙不够了
            if(this.vipNum<=0){
                this.isPayModalShowFlag=true;
            }else{
                this.isExpendModalShowFlag=true;
            }

            return
        }
        this.go("micro_example_detail")
    }
    /*去支付页面*/
    goToPay() {
        this.hidePayModal();
        this.microUnitService.savePayBackUrl("micro_example_list")
        this.go("micro_lecture_pay")
    }
    back() {
        if(this.isExpendModalShowFlag==true){
            this.isExpendModalShowFlag=false
        }else if(this.isPayModalShowFlag==true){
            this.isPayModalShowFlag=false;
        }else{
            this.go('home.micro_unit_list');
            return
        }
        this.getScope().$digest();
    }
}

export default MicroExampleList