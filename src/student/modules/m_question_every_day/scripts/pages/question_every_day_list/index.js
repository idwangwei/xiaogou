/**
 * Author ww on 2018/1/5.
 * @description 每日一题作业列表
 */
import _find from 'lodash.find';
import {Inject, View, Directive, select} from './../../module';

@View('home.question_every_day_list', {
	url: '/question_every_day_list',
	views: {
		"study_index": {
			template: require('./page.html')
		}
	},
	styles: require('./style.less'),
	inject: ['$scope'
		, '$state'
		, '$stateParams'
		, 'workStatisticsServices'
		, 'commonService'
		, 'profileService'
		, '$ngRedux'
		, 'paperService'
		, '$timeout'
		, 'finalData'
		, '$ionicSideMenuDelegate'
		, '$ionicHistory'
		, '$interval'
		, '$rootScope'
		, 'questionEveryDayService'
		, '$ionicPopover']
})

class QuestionEveryDayListCtrl {
	paperService;
	commonService;
	profileService;
	$ionicPopover;
	questionEveryDayService;
	workStatisticsServices;
	@select(state=>state.profile_user_auth.user.userId) userId;
	@select(state=>state.fetch_question_every_day_list_processing) isLoading;
	@select(state=>state.wl_selected_clazz) selectedClazz;
	@select((state)=> {
		let clzId = state.wl_selected_clazz.id;
		return state.question_every_day_list_with_clazz[clzId];
		
	}) workList;
	@select((state)=> {
		let clazzList = state.profile_clazz.passClazzList;
		let newClazzList = [];
		if (clazzList && clazzList.length != 0) {
			clazzList.forEach((item)=> {
				if (item.type != 200) newClazzList.push(item);
			});
		}
		return newClazzList;
	}) clazzList;
	retFlag = false;
	
	constructor() {
		let systemTime = new Date();
		let fullYear = systemTime.getFullYear();
		let currentMonth = (systemTime.getMonth() + 1);
		currentMonth = currentMonth < 10 ? "0" + currentMonth : currentMonth;
		this.timeStr = fullYear + "-" + currentMonth;
		this.popoverTimeStr = this.timeStr;
		this.initFlags();
	}
	
	initFlags() {
		this.selectedTag = "all";
		this.initCtrl = false;
	}
	
	mapActionToThis() {
		return {
			changeClazz: this.workStatisticsServices.changeClazz,
			selectWork: this.paperService.selectWork,
		}
	}
	
	onBeforeEnterView() {
		let $scope = this.getScope();
		this.$ionicPopover.fromTemplateUrl('year-month-choose-popover.html', {
			scope: $scope
		}).then(function (popover) {
			$scope.popover = popover;
		});
		$scope.$on('popover.hidden', ()=> {
			if (this.timeStr != this.popoverTimeStr) {
				this.timeStr = this.popoverTimeStr;
				this.pullRefresh();
			}
		});
	}
	
	openPopover($event) {
		this.getScope().popover.show($event);
	}
	
	reduceNum(timeIndex) {
		let dateArr = this.popoverTimeStr.split("-");
		if (timeIndex == 0) {
			dateArr[0] = dateArr[0] - 1 < 2017 ? 2017 : dateArr[0] - 1
		} else {
			dateArr[1] = dateArr[1] - 1 < 1 ? 1 : dateArr[1] - 1
		}
		dateArr[1] = dateArr[1] < 10 ? "0" + dateArr[1] : dateArr[1];
		this.popoverTimeStr = dateArr.join("-")
	}
	
	addNum(timeIndex) {
		let dateArr = this.popoverTimeStr.split("-");
		let date = new Date();
		let currentYear = date.getFullYear();
		let currentMonth = date.getMonth() + 1;
		if (timeIndex == 0) {
			dateArr[0] = +dateArr[0] + 1 > currentYear ? currentYear : +dateArr[0] + 1
		}
		else if (currentYear == dateArr[0]) {
			dateArr[1] = +dateArr[1] + 1 > currentMonth ? currentMonth : +dateArr[1] + 1
		}
		else {
			dateArr[1] = +dateArr[1] + 1 > 12 ? 1 : +dateArr[1] + 1
		}
		dateArr[1] = dateArr[1] < 10 ? "0" + dateArr[1] : dateArr[1];
		this.popoverTimeStr = dateArr.join("-")
	}
	
	onBeforeLeaveView() {
		//离开当前页面时，cancel由所有当前页发起的请求
		this.questionEveryDayService.cancelRequestDeferList.forEach(function (cancelDefer) {
			cancelDefer.resolve(true);
		});
	}
	
	onAfterEnterView() {
		if (this.retFlag) {
			this.pullRefresh()
		}
	}
	
	back() {
		this.go('home.study_index');
		this.getRootScope().$injector.get('$ionicViewSwitcher').nextDirection('back');
	}
	
	configDataPipe() {
		this.dataPipe.when(()=>!this.initCtrl)
		  .then(()=> {
			  this.initCtrl = true;
			  this.ensureSelectedClazz(); //ctrl初始化时，刷新本地选择的班级信息，（修改班级后回到该页面选择的班级信息及时变更）
			  this.getRootScope().selectedClazz = this.selectedClazz;
			  this.pullRefresh();
		  })
	}
	
	
	/**
	 * 保证本地选择班级信息为修改后最新信息
	 */
	ensureSelectedClazz() {
		//确保选择的班级信息为最新班级列表中的信息
		if (this.clazzList && this.clazzList.length != 0) {
			let clazz,
			  currentSelectClazz = _find(this.clazzList, {type: 100});
			if (!currentSelectClazz) {
				clazz = this.clazzList[0];
			}
			else {
				clazz = currentSelectClazz;
			}
			this.changeClazz(clazz);
		}
	}
	
	
	/**
	 * 下拉刷新作业列表
	 */
	pullRefresh() {
		if (!this.isLoading && this.selectedClazz && this.selectedClazz.id) {
			this.questionEveryDayService.getListFromServer({
				userId: this.userId,
				code: "ASWK",
				page: 0,
				pageSize: 32,
				grade: this.selectedClazz.grade,
				time: this.timeStr.replace("-", "")
			}, this.selectedClazz.id, this.selectedClazz.grade).then((res)=> {
				this.getScope().$broadcast('scroll.refreshComplete');
				this.retFlag = true;
			});
		} else {
			this.getScope().$broadcast('scroll.refreshComplete');
			this.retFlag = true;
			
		}
	}
	
	getPaperStatusCallBack(param, col, $index, sysTime) {
		if (this.selectedWork.failMsg) {
			this.commonService.alertDialog(this.selectedWork.failMsg, 1500);
			return;
		}
		if (this.selectedWork.status == -1) {//表示该作业已经被老师删除
			this.commonService.showAlert('信息提示', '该作业已经被老师删除').then(function () {
				this.workList.splice($index, 1);
			});
			return;
		}
		
		//如果服务器时间小于该套时间的布置时间，则提示“改作业于param.publishTime开启”
		if (this.selectedWork.status == 1 && sysTime && this.selectedWork.publishTime) {
			let publishTime = this.selectedWork.publishTime.replace(/-/g, '/');
			if (Date.parse(publishTime) - sysTime > 0) {
				this.commonService.alertDialog(`作业开启时间还未到哦~`, 2000);
				return
			}
		}
		
		if (this.selectedWork.status < 3) {//1作业还没开始做,2作业部分完成，未提交的问题可以修改
			param = {
				paperId: col.paperInfo.paperId,
				paperInstanceId: col.paperInfo.instanceId,
				redoFlag: 'false', //是否是提交后再进入select_question做题
				urlFrom: 'holidayWorkList',
			};
			col.paperInfo.paperIndex = $index; //将该试卷在列表中的下标一起存入selectedWork中
			this.go("holiday_select_question", param); //返回做题
			return;
		}
		if (this.selectedWork.status == 3) {//作业已提交但未批改
			this.commonService.alertDialog("作业正在批改中", 1500);
			return;
		}
		col.paperInfo.paperIndex = $index; //将该试卷在列表中的下标一起存入当前试卷中
		this.go("holiday_work_detail", param);
	}
	
	
	selectedTagHandler(tagStr){
		this.selectedTag = tagStr;
	}
	ifShow(listItem){
		return this.selectedTag == 'all'
		  || (this.selectedTag == 'todo' && listItem.state == -1)
		  || (this.selectedTag == 'redo' && (listItem.state == 0||listItem.state == 1))
		  || (this.selectedTag == 'done' && listItem.state == 2)
	}
	
	gotoQuestionDetail(listItem){
		this.questionEveryDayService.changeSelectedWork({
			questionGroupId: listItem.questionGroupId,
			questionId: listItem.questionId,
			timeStr:listItem.timeStr
		});
		this.go('question_every_day_do_question');
	}
}

export default QuestionEveryDayListCtrl;





