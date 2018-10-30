/**
 * Created by qiyuexi on 2018/3/7.
 */

import {Inject, View, Directive, select} from '../../module';

@View('area_evaluation_list', {
    url: '/area_evaluation_list',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$rootScope', '$scope', '$state', '$ionicPopup', '$timeout', '$ionicScrollDelegate', '$ngRedux', 'commonService', 'areaEvaluationService'
    ]
})
class areaEvaluationListCtrl {
    $ionicPopup;
    $ionicScrollDelegate;
    $timeout;
    commonService;
    areaEvaluationService;
    @select(state=>state.ae_paper_list) paperList;
    @select(state=>state.wl_selected_clazz.id) clazzId;
    constructor(){

    }
    initData() {
        this.getEvaluationList();
    }

    onAfterEnterView() {
        this.initData();
    }
    /**
     * 返回
     */
    back() {
        // this.go('work_chapter_paper', {chapterId: this.selectUnit.unitId});
        this.go('home.work_list');
    }
    getEvaluationList(){
        this.areaEvaluationService.getAEList({
            "filter":JSON.stringify({
                status:0,
                groupId:this.clazzId,
                areaAssessment:true,
                limitQuery:{
                    lastKey:"",
                    quantity:16
                },
                type:"16"
            })
        }).then((data)=>{
            if(data){
                console.log(data)
            }else{
                this.commonService.alertDialog("获取列表失败");
            }
        }).finally(()=>{
            this.getScope().$broadcast('scroll.refreshComplete');
        })
    }
    goDetail(item){
        this.areaEvaluationService.selectCurrentPaper({
            publishType:16,
            paperId:item.instanceId,
            paperName:item.subjects[0].subjectSymbol,
            isAE:true,
            paperType:item.type
        })
        this.go('area_evaluation_detail',{paperInstanceId:item.instanceId});
    }
}

export default areaEvaluationListCtrl;