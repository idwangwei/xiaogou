/**
 * Created by ZL on 2018/3/21.
 */
import {Inject, View, Directive, select} from '../../module';

@View('pub_to_stu_preview', {
    url: '/pub_to_stu_preview',
    cache: false,
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: ['$scope'
        , '$state'
        , '$ionicScrollDelegate'
        , '$rootScope'
        , '$ngRedux'
        , 'personalQBService'
        , 'workChapterPaperService'
        , 'commonService'
        , '$ionicPopup']
})
class pubToStuPreviewCtrl {
    $ionicScrollDelegate;
    personalQBService;
    workChapterPaperService;
    commonService;
    $ionicPopup;
    @select(state=>state.profile_user_auth.user) user;
    @select(state=>state.temp_make_paper.paperName) paperName;
    @select(state=>state.temp_make_paper.paper) paper;
    initCtrl = false;
    loadingFailFlag = false;
    selectQuesCount = 0;
    selectQuesIndexs = [];
    gotoPubButnFlag = true;
    fetchListDone = false;
    isEditFlag = false;

    constructor() {
        this.initData();
    }

    initData() {
        this.initCtrl = false;
    }

    initFlag() {
        this.selectQuesIndexs.length = 0;
        this.gotoPubButnFlag = true;
        this.fetchListDone = false;
    }

    onAfterEnterView() {
        this.initFlag();
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
        if (!this.initCtrl) {
            this.initCtrl = true;
            this.personalQBService.getQbQuestionList(this.user.userId, this.getQbQuestionListCallBack.bind(this));
        }
    }

    getQbQuestionListCallBack(quesList) {
        if (quesList) {
            this.fetchListDone = true;
            this.tempqslist = quesList;
            angular.forEach(this.tempqslist, (v, k)=> {
                let knowledgeName = this.showKnowledgeAndDifficulty(this.tempqslist[k]);
                this.tempqslist[k].knowledgeName = knowledgeName;
                if (this.tempqslist[k].referAnswer) this.tempqslist[k].referAnswer = JSON.parse(this.tempqslist[k].referAnswer);
            })
        } else {
            this.loadingFailFlag = true;
        }
    }

    reLoadQuesList() {
        this.initCtrl = false;
    }

    selectQbQues(ques, index) {
        if (this.selectQuesIndexs.indexOf(index) == -1) {
            this.selectQuesIndexs.push(index);
            if (ques.selected && !this.isEditFlag) this.selectQuesCount += 1;
        } else {
            if (ques.selected && !this.isEditFlag) this.selectQuesCount += 1;
            if (!ques.selected && !this.isEditFlag) this.selectQuesCount -= 1;
        }
        if (!this.isEditFlag && this.selectQuesCount < 0) this.selectQuesCount = 0;
    }

    /**
     * 显示小题的知识点和难度
     * @param record
     * @returns {string}
     */
    showKnowledgeAndDifficulty(record) {
        /*if ((typeof $event === 'undefined' ? 'undefined' : typeof($event)) === 'object' && $event.stopPropagation) {
         $event.stopPropagation();
         } else if (event && event.stopPropagation) {
         event.stopPropagation();
         }*/
        let str1 = record.qCapabilityMap.knowledge[0].content.replace(/^[a-z]\d+\./i, '');
        let str2 = record.integrateQuestionItem.difficulty < 40 ? '基础' : record.integrateQuestionItem.difficulty > 70 ? '拓展' : '变式'; //难度
        return str1 + ' - ' + str2;
    }

    /**
     * 滚动到顶部
     */
    scrollTop() {
        this.$ionicScrollDelegate.scrollTop(true);
    };

    back() {
        this.go('my_question_bank');
    }

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

    /**
     * 去发布
     */
    gotoPublishWorkPaper() {
        if (!this.gotoPubButnFlag) return;
        if (this.selectQuesCount <= 0) {
            this.commonService.showAlert('温馨提示', '请选择题目再布置');
            return;
        }
        this.gotoPubButnFlag = false;
        this.workChapterPaperService.checkClassStudentCount(false).then((data) => {
            if (data && data.code == 200) {
                if (data.normalPaperView) {
                    this.gotoPubButnFlag = true;
                    this.commonService.showAlert('温馨提示', data.normalPaperView || '老师所带的班级中，没有一个班级的人数是大于等于5，则不能够布置作业')
                } else {
                    this.changePaperName();
                }
            } else {
                this.commonService.alertDialog(data.msg || '班级校验失败');
            }

        });
    }

    /**
     * 修改试卷名
     */
    changePaperName() {
        let me = this;

        if (!this.paperName) {
            let currentDate = new Date();
            this.paperName = '教师题库出题试卷'
                + currentDate.getFullYear() + '-'
                + (Number(currentDate.getMonth()) + 1) + '-'
                + currentDate.getDate() + "-"
                + currentDate.getHours() + ':'
                + currentDate.getMinutes() + ':'
                + currentDate.getSeconds();
        }

        var refuseConfirm = this.$ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
            template: '<input ng-model="ctrl.paperName" />',
            title: "组卷练习",
            scope: this.getScope(),
            buttons: [
                {
                    text: "<b>确定</b>",
                    type: "button-positive",
                    onTap: e => {
                        if(!this.paperName) {
                            e.preventDefault();
                            this.commonService.alertDialog('作业名不能为空！');
                        }else{
                            me.personalQBService.changePaperName(this.paperName);//TODO 修改
                            return true;
                        }

                    }
                },
                {
                    text: "取消",
                    type: "",
                    onTap: function (e) {
                        me.gotoPubButnFlag = true;
                        return false;
                    }
                }

            ]
        });
        refuseConfirm.then(res => {
            if (res) {
                this.workPub();
            }
        });
    }


    /**
     * 布置作业
     */
    workPub() {
        let params = {};
        // params.uId = this.userId;
        // params.tagId = this.setParams[this.setParams.length - 1].tagId;
        params.paperName = this.paperName;
        let qIds = [];
        angular.forEach(this.tempqslist, (v, k) => {
            if (this.tempqslist[k].selected) {
                qIds.push(this.tempqslist[k].integrateQuestionItem.id);
            }

        });
        params.qIds = JSON.stringify(qIds);
        this.personalQBService.composePaper(params).then((data, msg) => {
            this.gotoPubButnFlag = true;
            if (data) {
                this.selectQuesIndexs.length = 0;
                this.goToPub();
            } else {
                this.commonService.showAlert('警告', msg || '组卷失败');
            }
        });
    };

    goToPub() {
        this.go("pub_paper_to_stu", {from: 'pub_to_stu_preview'});
    }

    gotoAddQues() {
        this.go("my_question_bank");
    }

    /**
     * 获取单元名
     */
    getChapterName(record) {
        let cnStrArr = record.qCapabilityMap.knowledge[0].code.split(/\.|\，/);
        let cnStr = "";
        let cnMarkStr = "";
        if (cnStrArr && cnStrArr.length > 1) {
            cnStr = cnStrArr.slice(1).join(',');
            cnMarkStr = cnStrArr[0].split('-').pop();
        }
        cnStr = cnStr.replace(/\-[a-zA-Z]\d+/g, '');
        cnStr = cnStr.replace(/\-[a-zA-Z]/g, '');
        cnStr = cnMarkStr + '.' + cnStr;
        return cnStr;
    }

    /**
     * 点击编辑
     * @returns {boolean}
     */
    paperEdit(type) {
        if (this.selectQuesIndexs.length > 0) {
            angular.forEach(this.selectQuesIndexs, (v, k)=> {
                this.tempqslist[v].selected = false;

            });
            this.selectQuesIndexs.length = 0;
        }

        if (type == 'edit') {
            this.isEditFlag = true;
        } else {
            this.isEditFlag = false;
        }
        this.selectQuesCount = 0;
    };

    /**
     *删除选中的题目
     */
    deleteSelectQues() { // deleteQuesFromTeacherQb

        let deleteQuesArr = [];
        let deleteQuesIndexArr = [];
        angular.forEach(this.tempqslist, (v, k) => {
            if (this.tempqslist[k].selected) {
                deleteQuesArr.push(this.tempqslist[k].integrateQuestionItem.id);
                deleteQuesIndexArr.push(k);
            }
        });
        if (deleteQuesArr.length <= 0) {
            this.commonService.alertDialog('请选择需要删除的题目');
            return;
        }
        this.commonService.showPopup({
            title: '提示',
            template: '<p style="text-align: center">确定要删除吗？</p>',
            buttons: [{
                text: '确定',
                type: 'button-positive',
                onTap: (e)=> {
                    this.personalQBService.deleteQuesFromTeacherQb(deleteQuesArr)
                        .then((data)=> {
                            if (data && data.code == 200) {
                                angular.forEach(this.selectQuesIndexs, (v, k)=> {
                                    this.tempqslist[v].selected = false;
                                });
                                this.selectQuesIndexs.length = 0;
                                this.commonService.alertDialog('删除成功！');
                                let preIndex = deleteQuesIndexArr[0]-1;
                                if(preIndex<0) preIndex = 0;
                                let height = $('.smallQContainer').eq(preIndex).height();
                                this.$ionicScrollDelegate.scrollBy(0,-height);
                                this.hideDeletedQues(deleteQuesIndexArr);
                            }
                        })
                }
            }, {
                text: '取消',
                type: 'button-default',
                onTap: (e)=> {
                    return;
                }
            }]
        });
    }

    /**
     * 隐藏已经删除的题目
     */
    hideDeletedQues(deleteQuesIndexArr) {
        let elems = $('.bigQContainer .smallQContainer');
        angular.forEach(deleteQuesIndexArr, (v, k)=> {
            elems.eq(v).hide();
        })
    }
}


export default pubToStuPreviewCtrl;