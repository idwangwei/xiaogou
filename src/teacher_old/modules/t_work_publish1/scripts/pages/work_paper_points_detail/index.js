/**
 * Created by Administrator on 2016/8/3.
 */
import _each from 'lodash.foreach';
import _find from 'lodash.find';
import _sortby from 'lodash.sortby';
import {Inject, View, Directive, select} from '../../module';
const SUBHEADER_TEXT='考点题数分布';
@View('work_paper_points_detail', {
    url: '/work_paper_points_detail',
    template: require('./index.html'),
    styles: require('./index.less'),
    inject:[
        '$rootScope'
        ,'$scope'
        ,'$state'
        ,'$ionicHistory'
        ,'$ionicPopup'
        ,'$ionicScrollDelegate'
        ,'$ngRedux'
        ,'commonService'
        ,'ngLocalStore'
    ]
})
class WorkPaperPointsDetailCtrl{
    constructor(){
        this.initData();
    }
    initData(){
        this.subHeaderText = SUBHEADER_TEXT;
        this.initCtrl = false;
        this.pointsList = [];
        this.isIos = this.commonService.judgeSYS() === 2;
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData(){
        if(!this.initCtrl && this.pointsList.length == 0 ){
            let paperData = this.ngLocalStore.getTempPaper();
            this.parsePoints(paperData.data);
        }
    }


    back(){
        this.$ionicHistory.goBack();
    }
    help(){
        this.$ionicPopup.alert({
            title: '知识点信息',
            template: '<p>1.展示的信息为本试卷所包含的知识点。</p>' +
            '<p>2.知识点描述后的数字为本试卷中不同难度的题目数量。</p>',

            okText: '确定'
        });
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

    /**
     * 提出试卷中所有题目的知识点，对应单元知识点列表，返回层级结构的知识点列表数组
     */
    parsePoints(paperData){

        /**
         * 在单元知识点中列表中查找该小题知识点的父级知识点
         * @param point
         * @param difficulty
         * @returns {{id: *, text: *, isOpened: boolean, subTags: *[]}}
         */
        function findSmallQPointInUnitPoints(point,difficulty){
            let findSmallP = {};
            let findBigP = _find(this.selectUnitPoints,(bigP)=>{
                return findSmallP = _find(bigP.subTags,{id:point.id});
            });

            let smallP = {
                id: (findSmallP &&findSmallP.id) || "",
                text: (findSmallP&&findSmallP.text) || "",
                typesNum: {
                    base: 0,
                    general: 0,
                    hard: 0
                }
            };
            if(difficulty < 40){smallP.typesNum.base = 1}
            else if(difficulty >= 70){smallP.typesNum.hard = 1}
            else{smallP.typesNum.general = 1}

            return {
                id: (findBigP && findBigP.id) || "",
                text: (findBigP && findBigP.text) || "",
                isOpened: true,
                subTags: [smallP]
            }
        }

        /**
         * 将该小题的知识点添加进list中
         * @param findObj
         */
        function addPointToList(findObj){
            let bigP = _find(this.pointsList,{id:findObj.id});
            if(!bigP){
                this.pointsList.push(findObj);
            }
            else {
                let smallP = _find(bigP.subTags, {id: findObj.subTags[0].id});
                if(!smallP){bigP.subTags.push(findObj.subTags[0])}
                else{
                    smallP.typesNum.base += findObj.subTags[0].typesNum.base;
                    smallP.typesNum.general += findObj.subTags[0].typesNum.general;
                    smallP.typesNum.hard += findObj.subTags[0].typesNum.hard;
                }
            }
        }

        if(paperData && this.selectUnitPoints){
            //解析试卷小题中的知识点对应的父级知识点
            _each(paperData.qsTitles,(bigQ)=>{
                _each(bigQ.qsList,(smallQ)=>{
                    let point = smallQ.knowledge[0];
                    if(!point || !point.id){console.error('小题没有知识点');return}

                    let findObj = findSmallQPointInUnitPoints.call(this,point,smallQ.difficulty);
                    if(findObj.id){addPointToList.call(this,findObj)}
                    else{console.error('小题知识点在该单元知识点总列表中没有找到')}
                })
            });

            //子级知识点排序
            _each(this.pointsList,(point)=>{
                point.subTags = _sortby(point.subTags,'text');
            });
            //父级知识点排序
            this.pointsList = _sortby(this.pointsList,'text');
        }

        //没有单元知识点列表，综合测试单元
        if(paperData && !this.selectUnitPoints){

            //解析出试卷所有小题的知识点id集合，
            let childPointList = [];
            _each(paperData.qsTitles,(bigQ)=>{
                _each(bigQ.qsList,(smallQ)=>{
                    let point = smallQ.knowledge[0];
                    if(!point || !point.id){console.error('小题没有知识点');return}
                    childPointList.push(point.id);
                })
            });

            //解析出知识点对应的题数，难度，并排序
        }
    }



    mapStateToThis(state) {
        let unitPoints = state.wr_unit_points;
        let selectUnit = state.wr_selected_unit;
        let selectUnitPoints = unitPoints && unitPoints[selectUnit.unitId];
        let headerText = state.wr_selected_paper && state.wr_selected_paper.title;
        return {
            selectPaper:state.wr_selected_paper,
            unitPoints:state.wr_unit_points,
            selectUnit:state.wr_selected_unit,
            headerText:headerText,
            selectUnitPoints:selectUnitPoints
        }
    }
    mapActionToThis() {
        return {
        }
    }
}
export default WorkPaperPointsDetailCtrl;