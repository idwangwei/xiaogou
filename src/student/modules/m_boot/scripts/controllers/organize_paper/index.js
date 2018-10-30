/**
 * Created by liangqinli on 2017/3/1.
 */
import BaseController from 'base_components/base_ctrl';
import './style.less';
import {MATH_PAPER_FAILED}
    from '../../redux/actiontypes/actiontypes'
import _values from 'lodash.values';
import _find from 'lodash.find';
import _each from 'lodash.foreach';
class OrganizePaper extends BaseController {
    constructor() {
        super(arguments);
    }
    initData(){
        this.quesNum = '';  //选择的值
        this.level = '';     //选择的值
        this.initCount = 0 ; //初始化次数
        this.getDataCount = 0; //请求数据次数
        this.retFlag = false;  //第一次拉取数据flag
        this.moreFlag = true;  //还有没有更多的数据
        this.isLoadingProcessing = false;
        this.list = [];
        this.selectedList = [];
        this.organizing = false;
        this.numOptions = [{
            name: '5道',
            value: '5'
        },{
            name: '10道',
            value: '10'
        }];
        this.levelOptions = [{
            name: '初级',
            value: 'a'
        },{
            name: '中级',
            value: 'b'
        },{
            name: '高级',
            value: 'c'
        }];
        this.convertToChinese = this.commonService.convertToChinese;
        this.selectOption = {name: '初级', value: 'a'};
        this.showDiaglog = true; //添加弹窗指令
        this.isVip = false;
    }
    initDataFlag(){
        this.$ionicScrollDelegate.$getByHandle('paperListScroll').scrollTop(false);
        this.moreFlag = true;
        this.retFlag = false;
    }
    onReceiveProps() {
        if(this.initCount == 0 ){
            this.initCount++;
            this.isLoadingProcessing = true;
            this.getMainInfo();
        }
    }
    getMainInfo(params){
        return this.getInfoData(params).then((data) => {
            this.retFlag = true;
            this.isLoadingProcessing = false;
            if(data){
                this.list = data;
            }
            this.isVip = this.checkUserIsVip();
        }).catch(error => {
            this.retFlag = true;
            this.isLoadingProcessing = false;
            this.list = [];
            this.$ngRedux.dispatch({type: MATH_PAPER_FAILED})
            this.getScope().$broadcast('scroll.refreshComplete');
            console.error(error);
        });
    }
    pullDownRefresh(){
        this.getMainInfo().then(()=> {
            this.selectedList.length = 0;
            this.getScope().$broadcast('scroll.refreshComplete');
        })
    }
    handleChangeLevel = (value, selectOption) => {
        this.selectOption = selectOption;
    };
    organizePaper(){
        if(this.selectedList.length == 0){
            this.commonService.alertDialog(`还没有选讲`, 1500);
            return;
        }
        if(this.organizing) return;
        this.organizing = true;

        var date = new Date();
        var tagIds = this.selectedList.map( item => item.id).join(','),
            chapters = this.selectedList.map( item => item.index + 1).join(','),
            name = `(${this.selectOption.name})练习${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        var params = {
            tagIds,
            quantity: this.quesNum,
            name,
            diffType: this.level
        }
        const template = `<div>
            <div style="font-weight: bold;">试卷名称</div>
            <div style="background-color: #e1e1d1; border-radius:5px;padding: 5px 10px;">${name}</div>
            <div style="font-weight: bold;">试卷范围</div>
            <div style="background-color: #e1e1d1; border-radius:5px;padding: 5px 10px;">第${chapters}讲</div>
       </div>`;

        this.mathPaperService.organizePaper(params).then((data)=>{
            if(data.code === 200){
                this.organizing = false;
                this.$ionicPopup.alert({
                    title: '组卷成功',
                    template,
                    okText: '去练习'
                }).then(() =>{
                    this.go("olympic_math_work_list", 'none', {
                        urlFrom:this.workStatisticsServices.routeInfo.urlFrom
                    });
                })
            }

        }).catch(err => {
            this.organizing = false;
            this.commonService.alertDialog(`组卷失败，请重试`, 1500);
            console.error(err);
        })
    }
    handleSelect(item){
        if(item.index > this.finalData.OLYMPIC_SELF_TRANCE_FREE_LESSON && !this.isVip){
            this.alertGotoPay();
            return
        }
        if(this.selectedList.length >= this.quesNum && !item.selected){
            this.commonService.alertDialog(`不能超过${this.quesNum}讲`, 1500);
            return;
        }
        item.selected = !item.selected;
        if(item.selected){
            this.selectedList.push(item);
        }else{
            let arr = this.selectedList;
            for(var i =0, len = arr.length; i<len; i++){
                if(item.id === arr[i].id){
                    arr.splice(i, 1);
                    break;
                }
            }
        }

    }

    back(){
        this.go("olympic_math_work_list", 'none', {
                urlFrom:this.workStatisticsServices.routeInfo.urlFrom
            });
    }
    goPaperDetail(id, title, index){
        //第一讲，免费试用，之后的内容需要付费
        if(index > this.finalData.OLYMPIC_SELF_TRANCE_FREE_LESSON && !this.isVip){
            this.alertGotoPay();
            return
        }
        this.go('paper-detail', {id, title});
    }
    handleChangeQuesNum= (val) => {
        console.log('handleChangeQuesNum' ,val);
        var len = this.selectedList.length;
        var num = Number(val);
        if(len > num){
            this.selectedList.splice(num, len - num).forEach( item => item.selected = false );
            this.$ionicScrollDelegate.$getByHandle('paperListScroll').scrollTop(false);
            this.commonService.alertDialog(`已移除最后面选择的${len - num}讲`, 1500);
        }
    };

    checkUserIsVip(){
        let isVip = false;
        angular.forEach(this.vips,(item)=>{
            if(item['mathematicalOlympiad'] && _find(_values(item['mathematicalOlympiad']),(v)=>{return v > -1})){
                return isVip = true;
            }
        });
        return isVip;
    }

    alertGotoPay(){
        this.getScope().$emit('diagnose.dialog.show',
            {
                showType: 'confirm',
                comeFrom: 'olympic-math',
                title: '温馨提示',
                content: '该内容需激活才可组卷练习，现在去激活?',
                confrimBtnText:'去激活',
                cancelBtnText:'再看看',
                confirmCallBack: ()=> {
                    this.go('wp_good_select', 'forward', {'urlFrom': 'organize-paper'})
                }
            }
        );
    }

    onBeforeLeaveView() {
        this.mathPaperService.organizePaperUrlFrom = '';
        this.showDiaglog = false;
    }
    onBeforeEnterView(){
        //如果不是从课时题目详情页返回，清空勾选的课时
        if(this.mathPaperService.organizePaperUrlFrom !== 'paper-detail'){
            _each(this.selectedList,(item)=>{
                item.selected = false;
            });
            this.selectedList.length = 0;
        }
    }
    onAfterEnterView() {
        this.showDiaglog = true;
    }

    mapStateToThis(state) {
        return {
            vips:state.profile_user_auth.user.vips
            /*appNumVersion: state.app_info.appVersion*/
        }
    }
    mapActionToThis(){
        return {
            getInfoData: this.mathPaperService.getInfoData.bind(this.mathPaperService)
        }
    }
}

OrganizePaper.$inject = [
    '$scope',
    '$rootScope',
    '$timeout',
    '$ionicHistory',
    '$ngRedux',
    'commonService',
    'profileService',
    '$ionicPopup',
    '$ionicSideMenuDelegate',
    '$state',
    '$ionicScrollDelegate',
    'serverInterface',
    '$ionicActionSheet',
    'mathPaperService',
    'workStatisticsServices',
    'finalData'

];
export default OrganizePaper;