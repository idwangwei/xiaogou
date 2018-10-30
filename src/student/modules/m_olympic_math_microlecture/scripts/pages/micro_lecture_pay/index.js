/**
 * Created by qiyuexi on 2017/12/20.
 */
import {Inject, View, Directive, select} from './../../module';

@View('micro_lecture_pay', {
    url: '/micro_lecture_pay',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope'
        ,'$state'
        ,'$ngRedux'
        ,'$stateParams'
        ,'$ionicHistory'
        ,'$rootScope'
        ,"microVipService"
        ,"$ionicPopup"
    ]
})

class MicroLectureCtrl {
    microVipService
    $ionicPopup
    @select(state=>state.micro_select_example_item) selectExampleItem;
    @select(state=>state.micro_vip_list) allVipList;
    @select(state => state.profile_user_auth.user.vips) vipInfo;
    @select(state => state.micro_pay_back_url) backUrl;
    onBeforeLeaveView() {
        this.microVipService.cancelRequestList.forEach(function (cancelDefer) {
         cancelDefer.resolve(true);
         });
         this.microVipService.cancelRequestList.length=0;
    }
    onAfterEnterView(){
        this.initData();
        this.initFn();
    }
    constructor(){
        this.resetVipList=[];
    }
    /*初始化页面*/
    initData(){
        this.vipNum=0;
        this.isLoadingProcessing=true;//loading动画指令
    }
    initFn(){
        this.getVipNum();
        this.fetchMicroVipList().then(()=>{
            this.setMicroVipList()
            this.isLoadingProcessing=false;
        });
    }
    getVipNum(){
        this.vipInfo.forEach((x, i)=> {
            if (x.hasOwnProperty('tinyClassKey')) this.vipNum = x.tinyClassKey;
        });
    }
    fetchMicroVipList(){
        return this.microVipService.fetchMicroVipList({
            category:"XN-WK"
        })
    }
    setMicroVipList(){
        this.resetVipList=[]
        this.allVipList.forEach((x,i)=>{
            let itm=Object.assign({},x);
            delete itm.desc;
            Object.assign(itm,JSON.parse(x.desc));
            itm.totalFee/=100;
            itm.num-=0;
            itm.giftNum-=0;
            itm.giftNumStr=itm.num;
            if(itm.num<10){
                itm.type=1
                itm.giftNumStr=itm.num;
            }else if(itm.num<50){
                itm.type=2
            }else{
                itm.type=3
            }
            this.resetVipList.push(itm)
        });
    }
    goToPay(x){
        this.$ionicPopup.alert({
            title: '确认支付',
            template: '<div style="text-align: center; width=100%;"><p>购买前必须告诉爸爸妈妈</p><p>不要擅自购买哦！</p></div>',
            buttons: [
                {text: '说过了，去支付'}
            ]
        }).then((res)=> {
            this.microVipService.selectMicroGoods(x);
            this.go('micro_lecture_weixin_pay');
        });
    }
    back() {
        this.go(this.backUrl);
    }
}

export default MicroLectureCtrl