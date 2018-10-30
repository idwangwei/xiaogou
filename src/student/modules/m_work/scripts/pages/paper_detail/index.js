/**
 * Created by liangqinli on 2017/3/2.
 */
import {Inject, View, Directive, select} from '../../module';

@View('paper-detail', {
    url: '/paper-detail/:id/:title',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: ['$rootScope'
        , '$scope'
        , '$state'
        , '$ionicPopup'
        , '$ionicScrollDelegate'
        , '$ngRedux'
        , 'commonService'
        , 'mathPaperService']
})
class PaperDetail {
    constructor() {
        // super(arguments);
        /*this.showTips();*/
        this.initData();
    }

    initData() {
        this.isShowKAD = true;
        this.isIOS = this.commonService.judgeSYS() == 2;
        this.initCtrl = false;
        this.paper = [];
        this.retflag = false;
        this.isLoadingProcessing = false;
        this.paperId = this.getStateService().params.id;
        this.title = this.getStateService().params.title
        this.curPage = 1;
        this.moreFlag = true;
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
        this.isLoadingProcessing = true;
        if (!this.initCtrl) {
            this.initCtrl = true;
            this.getPaperList()
        }
    }

    parseQues(answerKey) {
        try {
            var allQuesInfo = JSON.parse(answerKey)[0];
        } catch (err) {
            console.error(err);
            return;
        }
        try {
            var inputList = []
            if (allQuesInfo.type === 'vertical') {
                allQuesInfo.scorePoints.forEach((scorePoint) => {
                    var inputBox = {};
                    inputBox.scorePointId = scorePoint.uuid;
                    inputBox.spList = [];
                    inputBox.type = 'vertical';
                    scorePoint.referInputBoxes.forEach((Q, index) => {
                        var sp = {};
                        sp.inputBoxUuid = Q.uuid;
                        sp.matrix = allQuesInfo.vfMatrix[index][Q.uuid];
                        inputBox.spList.push(sp);
                    })
                    inputList.push(inputBox);
                })
            }
            return inputList;
        } catch (err) {
            console.error('解析answerKey出错', err);
        }

    }

    getPaperList() {
        return this.getPaperDetail(this.paperId, this.curPage++).then((data) => {
            this.isLoadingProcessing = false;
            if (Object.prototype.toString.apply(data) == '[object Array]') {
                console.log(data);

                data.forEach((item) => {
                    item.inputList = this.parseQues(item.answerKey);
                })
                console.log(data);
                if (data.length < 15) this.moreFlag = false;
                this.paper = this.paper.concat(data);
            } else {
                this.curPage--;
                this.getScope().$broadcast('scroll.infiniteScrollComplete');
            }
            this.retflag = true;
        }).catch(err => {
            this.isLoadingProcessing = false;
            this.retflag = true;
            this.curPage--;
            console.error(err);
            this.getScope().$broadcast('scroll.infiniteScrollComplete');
        })
    }

    pullUpRefresh() {
        this.getPaperList().then(()=> this.getScope().$broadcast('scroll.infiniteScrollComplete'));
    }

    /**
     * 返回
     */
    back() {
        this.mathPaperService.organizePaperUrlFrom = 'paper-detail';
        history.back();
    };

    help() {
        this.$ionicPopup.alert({
            title: '如何增题删题？',
            template: '<p>1.先点击页脚的“编辑”会把作业拷贝到“编辑列表”，并开始对拷贝的试卷进行编辑</p>' +
            '<p>2.进入“编辑列表”，打开作业也可以编辑试卷</p>' +
            '<p>3.试题难度：基础＜精炼＜培优</p>',
            okText: '确定'
        });
    }

    /**
     * 获取该大题的中文题号和名称并返回
     * @param bigQ
     * @returns {*}
     */
    getBigQText(bigQ) {
        return this.mathPaperService.getBigQText(bigQ);
    }

    /**
     * 显示小题的知识点和难度
     * @param record
     * @returns {string}
     */
    showKnowledgeAndDifficulty(record) {
        let str1 = record.knowledge[0].content.replace(/^[a-z]\d+\./i, '');
        let str2 = record.difficulty < 40 ? '基础' : record.difficulty > 70 ? '拓展' : '变式'; //难度
        return str1 + ' - ' + str2;
    }

    /**
     * 滚动到顶部
     */
    scrollTop() {
        this.$ionicScrollDelegate.scrollTop(true);
    };

    /**
     * 显示/隐藏滚动到顶部的按钮
     */
    getScrollPosition() {
        if (this.$ionicScrollDelegate.getScrollPosition().top >= 250) {
            $('.scrollToTop').fadeIn();
        }
        else {
            $('.scrollToTop').fadeOut();
        }
    };


    mapStateToThis(state) {
        return {
            //userId:state.profile.userId,

        }
    }

    mapActionToThis() {
        return {
            /* addBackupWork: this.workChapterPaperService.addBackupWork.bind(this.workChapterPaperService)*/
            getPaperDetail: this.mathPaperService.getPaperDetail.bind(this.mathPaperService)
        }
    }
}