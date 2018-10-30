/**
 * Created by Administrator on 2016/8/3.
 */
import _each from 'lodash.foreach';
import _find from 'lodash.find';
import _indexOf from 'lodash.indexof';
import _findIndex from 'lodash.findindex';
import {Inject, View, Directive, select} from '../../module';
const PAPER_INFO_HEIGHT = 35; //整卷信息的高度
@View('work_paper_edit', {
    url: '/work_paper_edit/:isAddedSmallQ/:firstSmallQIndex/:fromUrl/:paperId',
    template: require('./index.html'),
    styles: require('./index.less'),
    inject:[
        '$rootScope'
        ,'$scope'
        ,'$q'
        ,'$state'
        ,'$ionicPopup'
        ,'$ionicScrollDelegate'
        ,'$timeout'
        ,'$ngRedux'
        ,'finalData'
        ,'commonService'
        ,'workChapterPaperService'
        ,'uuid4'
        ,'ngLocalStore'
        ,'workManageService'
        ,"workStatisticsService"
    ]
})
class WorkPaperEditCtrl{
    constructor(){
        this.initData()
    }
    initData(){
        this.initCtrl = false;
        this.isIOS = this.commonService.judgeSYS()==2;
        this.paper = null;
        this.isLoadingProcessing = true; //加载试卷
        this.temp ={
            paperTitle:'',
            paperDesc:''
        }; //试卷编辑整卷设置信息
        //this.workSetBtnCanClick = true; //整卷设置按钮是否可以点击
        this.addBigQTitle = ""; //新增答题的标题
        this.editBigQData = {newIndex:null,title:''};
        this.editBigQList = [];

        this.allBigQTitle = [];
        this.editSmallQ = {bigQId:null,score:null};
        this.editSmallList = [];
        this.isPaperChanged = this.getStateService().params.isAddedSmallQ ||this.getStateService().params.fromUrl == 'work_paper_detail'; //试卷是否有更新
        this.isShowKAD = true; //是否显示小题的知识点和难度
        this.firstSmallQIndex = this.getStateService().params.firstSmallQIndex;

    }

    onReceiveProps() {
        this.ensurePageData().then(()=>{
                this.scrollToSmallQ();
            }
        )
    }

    ensurePageData(){
        if(this.getStateService().params.fromUrl != 'work_chapter_paper' && !this.initCtrl){
            this.initCtrl = true;
            return getPaperDataFromLocal.call(this).then(()=>{this.getAllBigQTitle()});

        }

        if(!this.initCtrl && !this.paper && this.selectPaperInfo){
            this.initCtrl = true;

            //向服务器获取试卷,失败则使用本地试卷
            return this.workChapterPaperService.fetchEditPaper(this.selectPaperInfo.id).then((data)=>{
                this.paper = data;
                this.getAllBigQTitle();
            },()=>{
                getPaperDataFromLocal.call(this).then(()=>{this.getAllBigQTitle()});
            });
        }

        let defer = this.$q.defer();
        defer.resolve();
        return defer.promise;

        /**
         * 获取保存在本地的试卷内容
         * @returns {*}
         */
        function getPaperDataFromLocal() {
            return this.ngLocalStore.paperStore.keys().then((keys)=>{
                let key = this.getRootScope().user.loginName+'/'+this.selectPaperInfo.id; //key
                let temp = this.ngLocalStore.getTempPaper(); //
                let index = _indexOf(keys,key);
                console.log('获取本地试卷内容开始');
                if(temp.id == key){
                    this.getScope().$apply(()=>{
                        this.paper = temp.data;
                    });
                }
                else if(index != -1){
                    let defer = this.$q.defer();
                    this.ngLocalStore.paperStore.getItem(key).then((paperData)=>{
                        this.getScope().$apply(()=>{
                            this.paper = paperData;
                            //设置试卷内容为tempPaper的值
                            this.workChapterPaperService.savePaperDataToLocal(this.paper,true);
                            console.log('获取本地试卷内容结束');
                            defer.resolve();
                        });
                    });
                    return defer.promise;
                }
            });
        }
    }


    /**
     * 整卷设置回调
     */
    workSet () {         //修改作业信息
        this.temp.paperTitle = this.paper.basic.title;
        this.temp.paperDesc = this.paper.basic.description;

        this.$ionicPopup.show({                  // 调用$ionicPopup弹出定制弹出框
            template: require('modules/t_boot/partials/common/work_set.html'),
            title: "整卷设置",
            scope: this.getScope(),
            buttons: [
                {
                    text: "<b>确定</b>",
                    type: "button-positive",
                    onTap:(e)=> {
                        //试卷名字为空,不允许用户关闭
                        if (!this.temp.paperTitle) {
                            e.preventDefault();
                            this.commonService.alertDialog("请填写作业标题", 2000);
                            return;
                        }
                        //试卷名称超出限制,不允许用户关闭
                        if (this.temp.paperTitle.length>100) {
                            e.preventDefault();
                            this.commonService.alertDialog("作业名称不能超过100个字符！", 2000);
                            return;
                        }
                        //this.workSetBtnCanClick = false;
                        this.paper.basic.title = this.temp.paperTitle;
                        this.paper.basic.description = this.temp.paperDesc;

                        this.paperChanged(this.paper);
                        //this.isPaperChanged = true;

                    }
                },
                {
                    text: "取消",
                    onTap:  (e) =>{
                        return;
                    }
                }
            ]
        });
    };

    /**
     * 添加一个大题
     */
    addBigQ() {
        this.$ionicPopup.show({  // 调用$ionicPopup弹出定制弹出框
            template: "<label>大题名称</label>"
            + "<input type='text' placeholder='(如:填空题)' ng-model='ctrl.addBigQTitle' style='border: 1px solid #999'>",
            title: "新增大题",
            scope: this.getScope(),
            buttons: [
                {
                    text: "<b>确定</b>",
                    type: "button-positive",
                    onTap:  (e)=> {
                        //新增的大题名称不能为空
                        if (!this.addBigQTitle) {
                            e.preventDefault();
                            this.commonService.alertDialog("大题名称不能为空！", 1500);
                            return;
                        }
                        //新增答题名称字数超限制
                        if (this.addBigQTitle.length > 100) {
                            e.preventDefault();
                            this.commonService.alertDialog("大题名称不能超过100个字符！", 2000);
                            return;
                        }
                        var data = {
                            id: this.uuid4.generate(),
                            qsList: [],
                            title: this.addBigQTitle,
                            score: 0,
                            seqNum:this.paper.qsTitles.length
                        };
                        this.paper.qsTitles.push(data);
                        this.paperChanged(this.paper);
                        this.getAllBigQTitle();
                        this.addBigQTitle = ""; //清空新增大题名称的记录
                        this.$ionicScrollDelegate.scrollBottom();
                    }
                },
                {
                    text: "取消",
                    onTap:  (e)=> {
                        return;
                    }
                }
            ]
        });
    }

    /**
     * 编辑选中的大题（设置名称题号）
     * @param
     * @param q 选中的大题
     * @param index 选中的题目的索引
     */
    editBigQ(q, index) {
        this.editBigQData.newIndex = q.seqNum;
        this.editBigQData.title = q.title;
        this.getBigNumList();

        this.$ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
            template: require("modules/t_boot/partials/common/work_set_big_question.html"),
            title: "大题设置",
            scope: this.getScope(),
            buttons: [
                {
                    text: "<b>确定</b>",
                    type: "button-positive",
                    onTap: (e)=> {
                        if (!this.editBigQData.title) {
                            e.preventDefault();
                            this.commonService.alertDialog("请填写大题名称！", 2000);
                            return;
                        }
                        if (this.editBigQData.title.length > 100) {
                            e.preventDefault();
                            this.commonService.alertDialog("大题名称不能超过100个字符！", 2000);
                            return;
                        }

                        //修改答题名称
                        q.title = this.editBigQData.title;

                        //修改答题序号:添加试题到新的节点，移除老节点，并初始化试题号
                        if(this.editBigQData.newIndex != q.seqNum){
                            this.paper.qsTitles.splice(index, 1);
                            this.paper.qsTitles.splice(this.editBigQData.newIndex, 0, q);
                            _each(this.paper.qsTitles,(v,i)=>{v.seqNum = i});

                            //定位到该大题的位置
                            this.$timeout(()=>{
                                let bigQElementArr = [].slice.call($('.qt-list'));
                                let relativeY = 0;
                                _find(bigQElementArr,(bigQTitleElement,i)=>{
                                    if(i == this.editBigQData.newIndex){
                                        relativeY = $(bigQTitleElement).position().top;
                                        return true;
                                    }
                                });
                                relativeY  -=  PAPER_INFO_HEIGHT;//减掉整卷信息的高度
                                this.$ionicScrollDelegate.scrollBy(0,relativeY);
                            },10)
                        }
                        this.getAllBigQTitle();
                        this.paperChanged(this.paper);
                    }
                },
                {
                    text: "取消",
                    onTap: function (e) {
                        return;
                    }
                }
            ]
        });
    }
    /**
     * 添加小题
     * @param index 大题下标
     */
    addSmallQ(index) {
        this.go('work_paper_points_edit',{bigQIndex:index});
    }
    /**
     * 移除选中的大题
     * @param bigQ 选中的题目
     */
    delBigQ(bigQ) {
        this.commonService.showConfirm('信息提示', '你确定要删除该大题吗？').then( (res)=> {
            if (res) {
                this.paper.qsTitles.splice(bigQ.seqNum, 1);
                this.paper.basic.score -= bigQ.score;
                _each(this.paper.qsTitles,(v,i)=>{v.seqNum = i});
                this.paperChanged(this.paper);
                this.getAllBigQTitle();
            }
        });
    }

    /**
     * 移除选中的小题
     * @param smallQ 选中的题目
     * @param bigQ 选中的题目所在的大题
     */
    delSmallQ(smallQ, bigQ) {
        this.commonService.showConfirm('信息提示', '你确定要删除该小题吗？').then( (res) =>{
            if (res) {
                this.paper.basic.score -= smallQ.score;
                bigQ.score -= smallQ.score;
                bigQ.qsList.splice(smallQ.seqNum, 1);
                _each(bigQ.qsList,(v,i)=>{v.seqNum = i});

                this.paperChanged(this.paper);
                //this.isPaperChanged = true;

            }
        });
    }
    /**
     * 编辑选中的小题题（设置分数，设置题号）
     * @param bigQ 选中小题所在的大题
     * @param smallQ 选中的小题
     */
    editQList(bigQ,smallQ) {
        this.editSmallQ.score = smallQ.score;
        this.editSmallQ.preBigQId = bigQ.id;
        this.editSmallQ.newBigQId = bigQ.id;
        this.editSmallQ.seqNum = +smallQ.seqNum;
        this.getSmallNumList(bigQ.id);

        this.$ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
            template: require('modules/t_boot/partials/common/work_set_small_question.html'),
            title: "小题设置",
            scope: this.getScope(),
            buttons: [
                {
                    text: "<b>确定</b>",
                    type: "button-positive",
                    onTap:  (e)=> {
                        if (!(new RegExp('^[1-9][0-9]?$')).test(this.editSmallQ.score)) {
                            this.commonService.alertDialog("当前输入的小题分数格式不正确！范围为1-99", 2000);
                            e.preventDefault();
                            return;
                        }

                        //没有任何变化
                        if(this.editSmallQ.score == smallQ.score
                            && this.editSmallQ.preBigQId == this.editSmallQ.newBigQId
                            && this.editSmallQ.seqNum == smallQ.seqNum
                        ){return}

                        //重置大题和试卷的分数
                        if(this.editSmallQ.newBigQId == this.editSmallQ.preBigQId){
                            //分数
                            if(this.editSmallQ.score != smallQ.score){
                                bigQ.score += this.editSmallQ.score - smallQ.score;
                                this.paper.basic.score += this.editSmallQ.score - smallQ.score;
                                smallQ.score = this.editSmallQ.score;
                            }
                            //小题排序排序
                            if(this.editSmallQ.seqNum != smallQ.seqNum){
                                bigQ.qsList.splice(smallQ.seqNum,1);
                                bigQ.qsList.splice(this.editSmallQ.seqNum,0,smallQ);
                                _each(bigQ.qsList,(v,i)=>{v.seqNum = i});
                            }
                        }
                        else{
                            let newBigQ = _find(this.paper.qsTitles,{id:this.editSmallQ.newBigQId});
                            //分数
                            bigQ.score -= smallQ.score;
                            newBigQ.score += this.editSmallQ.score;
                            this.paper.basic.score += this.editSmallQ.score - smallQ.score;
                            smallQ.score = this.editSmallQ.score;
                            //排序
                            bigQ.qsList.splice(smallQ.seqNum,1);
                            _each(bigQ.qsList,(v,i)=>{v.seqNum = i});
                            newBigQ.qsList.splice(this.editSmallQ.seqNum,0,smallQ);
                            _each(newBigQ.qsList,(v,i)=>{v.seqNum = i});
                        }

                        this.paperChanged(this.paper);
                        //this.isPaperChanged = true;

                    }
                },
                {
                    text: "取消",
                    onTap:  (e) =>{}
                }
            ]
        });
    }

    /**
     * 显示小题的知识点和难度
     * @param record
     * @returns {string}
     */
    showKnowledgeAndDifficulty(record){
        // let str1 = record.knowledge[0].code.match(/-(\w+)$/)[1]; //知识点
        let str1 = record.knowledge[0].content.replace(/^[a-z]\d+\./i,'');
        let str2 = record.difficulty < 40 ?　'基础':record.difficulty > 70 ?　'拓展':'变式'; //难度
        return str1 +' - '+str2;
    }


    /**
     * 滚动到顶部
     */
    scrollTop () {
        this.$ionicScrollDelegate.scrollTop(true);
    };
    /**
     * 显示/隐藏滚动到顶部的按钮
     */
    getScrollPosition () {
        if (this.$ionicScrollDelegate.getScrollPosition().top>= 250) {
            $('.scrollToTop').fadeIn();
        }
        else {
            $('.scrollToTop').fadeOut();
        }
    };
    help () {
        this.$ionicPopup.alert({
            title: '如何增题删题？',
            template: '<p>1.点击题目上方的“移除小题”就可以移除</p>' +
            '<p>2.点击“新增小题”，就可根据知识点从“题库”中选题加入</p>' +
            '<p>3.新增的大题将默认为作业的最后一个大题</p>' +
            '<p>4.大题设置可以更改大题的顺序</p>' +
            '<p>5.小题设置可以更改小题分数及顺序</p>',
            okText: '确定'
        });
    };
    back () {
        if(this.isPaperChanged){
            this.$ionicPopup.show({
                template: "<p style='text-align: center'>当前试卷编辑未保存，确定放弃编辑并退出吗？</p>",
                title: "温馨提示",
                scope: this.getScope(),
                buttons: [
                    {
                        text: "<b>确定</b>",
                        type: "button-positive",
                        onTap:  (e) =>{
                            this.go('work_chapter_paper',{chapterId:this.selectedUnit.unitId});
                        }
                    },
                    {
                        text: "取消",
                        onTap: (e) =>{
                            return;
                        }
                    }
                ]
            });
        }
        else {
            this.go('work_chapter_paper',{chapterId:this.selectedUnit.unitId});
        }
    };
    /**
     * 试卷内容变更，保存到本地
     * @param paper
     */
    paperChanged(paper){
        this.isPaperChanged = true;

        //更新temp中的试卷内容
        // this.workChapterPaperService.savePaperDataToLocal(paper,true);
    }

    /**
     * 返回答题的 题号+名称
     * @param bigQ
     * @returns {*}
     */
    getBigQText(bigQ){
        return this.workChapterPaperService.getBigQText(bigQ);
    }
    /**
     * 获取所有大题的id,题号+名称,小题数 集合
     */
    getAllBigQTitle(){
        console.log('解析大题号和大题标题');
        if(!this.paper){console.error('试卷为空')}

        //试卷获取完毕
        this.isLoadingProcessing = false;
        this.allBigQTitle.length = 0;
        //获取所有大题题号+名称的文字,小题数
        _each(this.paper.qsTitles,(bigQ)=>{
            this.allBigQTitle.push({
                id:bigQ.id,
                title:this.commonService.convertToChinese(+bigQ.seqNum + 1) + '、' + bigQ.title,
                smallQNum:bigQ.qsList.length

            })
        })
    }
    //根据大题号获取小题号集合
    getSmallNumList  (newBigQId) {
        this.editSmallList.length = 0;
        let bigQ = _find(this.paper.qsTitles,{id:newBigQId});
        let smallQLen = bigQ && bigQ.qsList.length;
        let i;
        if(this.editSmallQ.preBigQId == this.editSmallQ.newBigQId){
            for(i=0;i<smallQLen;i++){
                this.editSmallList.push({seqNum:i});
            }
        }
        else{
            for(i=0;i<=smallQLen;i++){
                this.editSmallList.push({seqNum:i});
            }
        }
    };
    /**
     * 判断试卷是否有新增题目 并且提示应该设置分数
     * */
    scrollToSmallQ(){
        if(this.isPaperChanged && this.firstSmallQIndex){
            var relativeY = $('#' + this.firstSmallQIndex).position().top;
            relativeY  -=  PAPER_INFO_HEIGHT;//减掉整卷信息的高度
            this.$ionicScrollDelegate.scrollBy(0,relativeY);
        }
    }
    //获取大题题号集合
    getBigNumList  () {
        this.editBigQList.length = 0;
        for(let i=0,len = this.paper.qsTitles.length; i<len; i++){
            this.editBigQList.push({
                seqNum:i,
                textNum:this.commonService.convertToChinese(i + 1)
            });
        }
    };



    /**
     * 点击考点回调,进入考点展示页面
     */
    testPoints(){
        this.go('work_paper_points_detail');
    }

    /**
     * 检查编辑试卷的名称是否与该课时试卷名称重复
     * @returns {boolean}
     */
    checkPaperNameRepeat(){
        let chapterWithMinePaperList = this.$ngRedux.getState().wr_chapter_with_paperlist.mine || [];
        let chapterWithTeachPaperList = this.$ngRedux.getState().wr_chapter_with_paperlist.paperList || [];
        let mineList = chapterWithMinePaperList[this.selectedUnit.unitId] || [];
        let teachList = chapterWithTeachPaperList[this.selectedUnit.unitId] || [];

        //当前试卷名称在教材试卷类列表，编辑列表（除去自己）中是否重复
        return _findIndex(teachList,{title:this.paper.basic.title}) != -1 ||
            _findIndex(mineList.filter((v)=>{return v.id!=this.paper.basic.id}),{title:this.paper.basic.title}) != -1;

    }
    /**
     * 检查该编辑的试卷是否在编辑列表中
     * @returns {boolean}
     */
    checkPaperInMineList(){
        let chapterWithMinePaperList = this.$ngRedux.getState().wr_chapter_with_paperlist.mine || [];
        let mineList = chapterWithMinePaperList[this.selectedUnit.unitId] || [];
        return _findIndex(mineList,{id:this.paper.basic.id}) != -1;
    }
    /**
     * 检查试卷的更改
     */
    saveEditToServer(){
        let defer = this.$q.defer();
        //点击保存按钮,并且试卷没有更新,提示不能保存
        if(!this.isPaperChanged){
            this.$ionicPopup.alert({
                title:'信息提示',
                template:'<p style="text-align: center">试卷没有修改，不需要保存</p>'
            }).then(()=>{defer.reject()});
            return defer.promise;
        }
        //检查试卷为空
        if(!this.paper.qsTitles.length){
            this.$ionicPopup.alert({
                title:'信息提示',
                template:'<p style="text-align: center">试卷不能为空</p>'
            }).then(()=>{defer.reject()});
            return defer.promise;
        }

        //有大题为空,提示不能保存
        if(_find(this.paper.qsTitles,(v)=>{return v.qsList.length == 0})){
            this.$ionicPopup.alert({
                title:'信息提示',
                template:'<p style="text-align: center">试卷大题不能为空</p>'
            }).then(()=>{defer.reject()});
            return defer.promise;
        }

        //有小题的分数为0,提示不能保存
        let zeroSmallQ = _find(this.paper.qsTitles,(v1)=>{
            return _find(v1.qsList,(v2)=>{
                return v2.score == 0;
            })
        });
        if(zeroSmallQ){
            this.$ionicPopup.alert({
                title:'信息提示',
                template:'<p style="text-align: center">试卷中的小题分数不能为0</p>'
            }).then(()=>{defer.reject()});
            return defer.promise;
        }

        let paperInfo={
            id:this.paper.basic.id,
            rawObj:JSON.stringify(this.paper)
        };
        this.savePaper({favoritePapers:JSON.stringify(paperInfo)}).then((res)=>{
            if(res)this.isPaperChanged = false;
            defer.resolve(res);
        });

        return defer.promise;
    }
    /**
     * 保存对试卷的编辑
     * @param goPaperListPage 点击"保存"按钮，成功后返回到试卷列表页面
     */
    saveEdit(){
        //判断试卷名称是否重复
        if(this.checkPaperNameRepeat()){
            this.$ionicPopup.alert({
                title:'信息提示',
                template:'<p style="text-align: center">试卷名称与该课时中存在的试卷有重复，请点击试卷最上方的“整卷设置”修改</p>'
            }).then(()=>{
                this.$ionicScrollDelegate.scrollTop(true); //页面滚动到顶部
            });
            return;
        }

        //该试卷在编辑试卷列表中存在，直接更新
        if(this.checkPaperInMineList()){
            this.saveEditToServer().then((res)=>{
                if(res)this.go('work_chapter_paper',{chapterId:this.selectedUnit.unitId,from:'work_paper_edit'});
            });
        }
        //如果该编辑试卷是最新的一张试卷，服务器新生成一个编辑试卷
        else {
            this.addBackupWork(this.selectedUnit.unitId, this.paper).then((data)=>{
                if(!data) return;
                this.saveEditToServer().then((res)=>{
                    if(res)this.go('work_chapter_paper',{chapterId:this.selectedUnit.unitId,from:'work_paper_edit'});
                });
            })
        }
    }
    /**
     * 发布编辑好的试卷
     */
    workPub(){
        //试卷修改了没有保存，则先保存再发布
        if(this.isPaperChanged){
            //判断试卷名称重复
            if(this.checkPaperNameRepeat()){
                this.$ionicPopup.alert({
                    title:'信息提示',
                    template:'<p style="text-align: center">试卷名称与该课时中存在的试卷有重复，请点击试卷最上方的“整卷设置”修改</p>',
                }).then(()=>{
                    this.$ionicScrollDelegate.scrollTop(true); //页面滚动到顶部
                });
                return;
            }

            //该试卷存在于编辑试卷列表中
            if(this.checkPaperInMineList()){
                this.saveEditToServer().then((res)=>{
                    if(res) enterPubPage.call(this);
                });
            }
            //新增的一张编辑过的试卷
            else {
                this.addBackupWork(this.selectedUnit.unitId, this.paper).then((data)=>{
                    if(!data) return;
                    this.saveEditToServer().then((res)=>{
                        if(res) enterPubPage.call(this);
                    });
                })
            }
        }
        //试卷无更新，直接发布
        else {
            enterPubPage.call(this);
        }

        /**
         * 进入试卷发布页面
         */
        function enterPubPage(){
            //有大题为空,提示不能发布
            if(_find(this.paper.qsTitles,function(v){return v.qsList.length == 0})){
                return this.$ionicPopup.alert({
                    title:'信息提示',
                    template:'<p style="text-align: center">试卷大题不能为空</p>'
                });
            }


            //小题数超过建议值弹出提示
            // let smallQCount = 0;
            // _each(this.paper.qsTitles,(v,i)=>{smallQCount+=v.qsList.length});
            // if (smallQCount > this.finalData.WORK_QUESTION_MAX_COUNT) {
            //     this.$ionicPopup.alert({
            //         title: '警告',
            //         template: '<p style="color:red">题量有可能过大!</p>' +
            //         '<p>建议：一般单次作业以10到30分钟为宜。请老师根据本班情况斟酌。</p>' +
            //         '<p>想了解如何增删试题，请回到作业页面，点击右上角的"?"。</p>',
            //         okText: '确定'
            //     });
            // }

            //进入作业发布页面
            this.workManageService.backupWork.id= this.paper.basic.id;
            this.workManageService.backupWork.name= this.paper.basic.title;
            this.workManageService.libWork.name=this.paper.basic.title;
            this.workManageService.libWork.type=this.paper.basic.type;
            this.go("work_pub", {from: 'work_paper_edit'});
        }
    }

    /**
     * 打印试卷
     */
    paperPrint(){
        this.commonService.print();
    }

    goQFeedbackPage (questionId){
        this.workStatisticsService.workDetailState.lastStateUrl = this.getStateService().current.name;
        this.workStatisticsService.workDetailState.lastStateParams = this.getStateService().params;
        this.workStatisticsService.QInfo.questionId = questionId;
        this.workStatisticsService.QInfo.paperId = this.selectPaperInfo.id;
        this.getStateService().go('q_feedback');
    }

    /**
     * 检查当前作业是否为暑假作业或者寒假作业，是的话，给予提示
     */
    holidayHomeworkCheck() {
        var reg = new RegExp(/.*[暑|寒].*[期|假].*作.*业/g);
        if (reg.test(this.selectPaperInfo.title)) {
            this.$ionicPopup.alert({
                title: '温馨提示',
                template: '<p style="font-size:16px">' + (this.selectPaperInfo.title || "作业") + '由智算365自动发布' + '</p>',
                okText: '确定'
            });
            return true;
        }
    }


    mapStateToThis(state) {
        return {
            selectPaperInfo:state.wr_selected_paper,
            selectedUnit:state.wr_selected_unit,

        }
    }
    mapActionToThis() {
        return {
            savePaper:this.workChapterPaperService.savePaper.bind(this.workChapterPaperService),
            addBackupWork: this.workChapterPaperService.addBackupWork.bind(this.workChapterPaperService)
        }
    }
}
export default WorkPaperEditCtrl;