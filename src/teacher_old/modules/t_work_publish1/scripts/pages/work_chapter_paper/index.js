/**
 * Created by Administrator on 2016/8/1.
 */

import _findIndex from 'lodash.findindex';
import {Inject, View, Directive, select} from '../../module';
@View('work_chapter_paper', {
    url: '/work_chapter_paper/:chapterId/:from',
    template: require('./index.html'),
    styles: require('./index.less'),
    inject:[
        '$scope'
        , '$rootScope'
        , '$state'
        , '$ngRedux'
        , 'ngLocalStore'
        , 'workChapterPaperService'
        , 'commonService'
        , '$ionicPopup'
    ]
})
class WorkChapterPaperCtrl {
    constructor() {
        this.initData();
    }

    initData() {
        this.mineList = [];
        this.firstLoadMore = true;
        this.isGetUnitPoints = false;
        this.isGetPaperList = false;
        this.isGetMinePaperList = false;
        this.canLoadMoreMine = false;
        this.getMinePaperList = false;
        this.isIos = this.commonService.judgeSYS() === 2;
        this.mineListOther = [];
    }

    onAfterEnterView(){
        this.getMineListOther();
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
        //获取整个单元的知识点列表
        if (!this.isGetUnitPoints && this.unitId) {
            this.isGetUnitPoints = true;
            this.getUnitPoints(this.unitId);
        }

        //向服务器获取该单元教材的试卷列表
        if (!this.isGetPaperList && this.unitId) {
            this.isGetPaperList = true;
            this.getPaperList(this.unitId);
        }

        if (!this.isGetMinePaperList && this.unitId) {
            this.isGetMinePaperList = true;
            this.getMinePaperList(this.unitId).then((data) => {
                this.getMinePaperList = true;
                this.canLoadMoreMine = data.canLoadMore;
                this.getMineListOther();
            })
        }
        this.guideFlag = this.commonService.getSimulationClazzLocalData();
    }
    onBeforeEnterView() {
        //页面缓存存在，从其他页面回到该页面会进入之前离开页面的分页列表

        //教材试卷编辑并保存回到该页面 || 教材试卷编辑并不知回到该页面，进入编辑列表分页
        if (currentPaperInMineList.call(this)) {
            $('.sub-title').removeClass('subheader-active');
            $('#mine .sub-title').addClass('subheader-active');
            this.getScope().subHeaderInfo.activeEle = 'mine';
        }

        //页面缓存存在，获取一次编辑列表
        if (this.isGetMinePaperList && this.getScope().subHeaderInfo.activeEle == 'mine') {
            this.getMinePaperList(this.unitId).then((data) => {
                this.canLoadMoreMine = data.canLoadMore;
                this.getMineListOther();
            })
        }

        //判断 从编辑页保存返回该页面|发布的试卷是否在编辑列表
        function currentPaperInMineList() {
            let state = this.$ngRedux.getState();
            let unitId = state.wr_selected_unit.unitId;
            let chapterWithMinePaperList = state.wr_chapter_with_paperlist.mine;
            let mineList = chapterWithMinePaperList[unitId];
            let paperInMine = _findIndex(mineList, {id: state.wr_selected_paper.id}) != -1;

            return this.getStateService().params.from === 'work_paper_edit' ||
                (this.getStateService().params.from === 'work_pub' && paperInMine)
        }
    }

    /**
     * 下拉刷新试卷列表
     */
    pullRefresh(mineOrList) {
        let promise = mineOrList === 'list' ? this.getPaperList(this.unitId) : this.getMinePaperList(this.unitId);
        promise.then(() => {
            // this.mineListOther = _find(this.mineList,(v)=> {return v.title.indexOf('口算') == -1});
            this.getMineListOther();
            this.getScope().$broadcast('scroll.refreshComplete');
        })
    }


    /**
     * 返回上一页
     */
    back() {
        this.go('work_paper_bank');
    }
    /**
     * 显示试卷具体内容
     * @param paper
     */
    showPaperDetail(paper) {
        this.selectPaper(paper);
        this.go('work_paper_detail', {id: paper.id})
    }

    /**
     * 显示试卷具体内容
     * @param paper
     */
    showMainPaperDetail(paper) {
        if(paper.title.indexOf('口算')>-1){
            this.commonService.showAlert('温馨提示', '<p style="text-align: center;width: 100%;margin: 0">口算试卷不支持编辑</p>');
            return;
        }
        this.selectPaper(paper);
        this.go('work_paper_edit', {fromUrl: 'work_chapter_paper', paperId: paper.id})
    }

    /**
     * 去自动组卷
     * @param state
     */
    generatePaper() {
        //屏蔽自动组卷
        this.commonService.showAlert('温馨提示', '<p style="text-align: center">暂未开放</p>');
    }

    /**
     * 显示整个单元的知识点列表
     */
    gotoUnitPoints() {
        this.go('work_unit_points_detail')
    }

    /**
     * 加载更多
     * @param mineOrList
     */
    loadMore() {
        if (this.mineList.length == 0 || this.firstLoadMore) {
            this.getMineListOther();
            this.firstLoadMore = false;
            return this.getScope().$broadcast('scroll.infiniteScrollComplete');
        }
        this.getMinePaperList(this.unitId, true).then((data) => {
            this.canLoadMoreMine = data.canLoadMore;
            this.getMineListOther();
            this.getScope().$broadcast('scroll.infiniteScrollComplete');
        })
    }

    /**
     * 删除我的编辑中的试卷
     * @param paperId
     */
    deleteMinePaper(paperId) {
        this.commonService.showConfirm('温馨提示', '删除该作业，在“编辑列表”中不会再显示').then((res) => {
            if (!res) {
                return
            }
            this.deletePaper(paperId, this.unitId).then((data) => {
                if (data.code === 200) {
                    this.commonService.showAlert('温馨提示', '删除成功');
                }
                else {
                    this.commonService.showAlert('温馨提示', '删除失败：' + data.msg);
                }
            })
        });
    }


    mapStateToThis(state) {
        let unitId = state.wr_selected_unit.unitId;
        let chapterWithPaperList = state.wr_chapter_with_paperlist.paperList;
        let chapterWithMinePaperList = state.wr_chapter_with_paperlist.mine;
        let needHideRapidList = state.wr_chapter_with_paperlist.needHideRapid || {};


        return {
            unitId: unitId,
            unitName: state.wr_selected_unit.unitName,
            isFirst: state.wr_selected_unit.isFirst,
            paperList: chapterWithPaperList[unitId],
            mineList: chapterWithMinePaperList[unitId],
            selectPaperInfo: state.wr_selected_paper,
            user: state.profile_user_auth.user,
            hasOralCalculation: state.profile_user_auth.user.config&&state.profile_user_auth.user.config.oc,
            needHideRapid:needHideRapidList[unitId],
        }
    }

    mapActionToThis() {
        return {
            selectPaper: this.workChapterPaperService.selectedDetailPaper.bind(this.workChapterPaperService),
            getPaperList: this.workChapterPaperService.getPaperList.bind(this.workChapterPaperService),
            getMinePaperList: this.workChapterPaperService.getMinePaperList.bind(this.workChapterPaperService),
            getUnitPoints: this.workChapterPaperService.getTextPointsByUnitId.bind(this.workChapterPaperService),
            deletePaper: this.workChapterPaperService.deletePaper.bind(this.workChapterPaperService)
        }
    }


    /**
     * TODO 作业列表第一个是口算则需引导定位第二个作业，上传时根据需求修改
     */
    getHighLightEle() {
        this.currentShowEle = $(".img-content").eq(2).parent();
    }

    gotoOralArithmeticPaper() {
        this.workChapterPaperService.oralCalculationTempQues.paperName = this.unitName+"-口算";
        this.go('assign_oral_arithmetic',{isFirst:this.isFirst});
    }

    getMineListOther(){
        this.mineListOther.length = 0;
        angular.forEach(this.mineList,(v,k)=>{
            if( v.title.indexOf('口算') == -1){
                this.mineListOther.push(angular.copy(v));
            }
        });
    }
}
export default WorkChapterPaperCtrl;