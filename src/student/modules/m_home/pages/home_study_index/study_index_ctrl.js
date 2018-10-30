/**
 * Created by ww on 2017/1/11.
 *
 */
import {View} from "./../../module";
import _find from 'lodash.find';
import _forEach from 'lodash.foreach';

@View('home.study_index', {
		url: '/study_index',
		styles: require('./study_index.less'),
		views: {
				"study_index": {
						template: require('./study_index.html')
				}
		},
		inject: [
				'$state'
				, '$scope'
				, '$rootScope'
				, '$ngRedux'
				, '$timeout'
				, 'commonService'
				, 'homeInfoService'
				, '$ionicSlideBoxDelegate'
				, 'olympicMathService'
				, 'profileService'
				, '$ionicModal'
				// , 'finalSprintService'
				, 'finalData'
				, '$ocLazyLoad'
				, '$interval'
				, '$ionicScrollDelegate'
				, 'monitorService'
		]
})
class StudyIndexCtrl {
		$ocLazyLoad;
		$interval;
		$ionicScrollDelegate;
		monitorService
		
		constructor() {
				this.registerSlideEvent();
		}
		
		initData() {
				
				this.initCtrl = false;
				this.isIos = this.commonService.judgeSYS() === 2;
				this.isWin = this.commonService.judgeSYS() === 3;
				this.screenWidth = window.innerWidth;
				this.getRootScope().winterBroadcastLoading = false;
				this.getRootScope().winterBroadcastData = [];
				this.imgIsGrayscale = !_find(this.$ngRedux.getState().profile_user_auth.user.vips,
					(v) => v.diagnose && v.diagnose >= 1
				);
				this.currentlevelName = "";
				this.currentlevelImg = "";
				this.liveStartTime = "";
		}
		
		getLiveInfo() {
				this.monitorService.fetchLiveAdInfo().then((data)=> {
						this.liveStartTime = data.showTime;
				})
		}
		
		/*
		 slide点击逻辑
		 为2时复制多出来的点不动
		 */
		registerSlideEvent() {
				let _self = this;
				$(document).off("click", ".slide-mark").on("click", ".slide-mark", function () {
						let mark = $(this).data("mark");
						_self.clickActivePage(mark);
						_self.getRootScope().$digest();
						_self.getScope().$digest();
				})
		}
		
		getProgressWidth() {
				let widthPre = (Number(this.rewardBase.experience) / Number(this.rewardBase.levelUp)).toFixed(2) * 100;
				if (widthPre > 100) widthPre = 100;
				return widthPre;
		}
		
		getAvator() {
				if (this.rewardBase.avator == 'default') return 1;
				return this.rewardBase.avator || 1;
		}
		
		mapStateToThis(state) {
				let vips = state.profile_user_auth.user.vips, isXlyVip = false;
				let showOlympicMath = state.profile_user_auth.hasCheckedOlympicChangeAd;
				// let showOlympicMath = true;
				vips && vips.forEach((item) => {
						if (item.hasOwnProperty('xly')) {
								isXlyVip = item['xly'];
						}
						if (item.hasOwnProperty('mathematicalOlympiad')) {
								_forEach(item['mathematicalOlympiad'], (v, k)=> {
										if (v > -1) {
												showOlympicMath = showOlympicMath === false;
										}
								})
						}
				});
				return {
						nameList: state.level_name_list.levelNameList,
						levelAnalyzeData: state.level_name_list.levelAnalyzeData,
						rewardBase: state.user_reward_base,
						// group: state.level_name_list_group.group,
						name: state.profile_user_auth.user.name,
						loginName: state.profile_user_auth.user.loginName,
						clazzList: state.profile_clazz.clazzList,
						passClazzList: state.profile_clazz.passClazzList,
						selfStudyClazzList: state.profile_clazz.selfStudyClazzList,
						hasOralCalculation: state.profile_user_auth.user.config && state.profile_user_auth.user.config.oc,
						isXlyVip: isXlyVip,
						hasFinalAccess: state.profile_user_auth.user.config && state.profile_user_auth.user.config.competition,
						hasAreaEvaluation: state.profile_user_auth.user.config && state.profile_user_auth.user.config.areaTeachingResearch,
						hasMonitor: state.profile_user_auth.user.config && state.profile_user_auth.user.config.areaAssessmentAdvertisement,
						hasChildrenDay: state.profile_user_auth.user.config && state.profile_user_auth.user.config.childrenAdvertisement,
						// showOlympicMath:state.profile_user_auth.user.config && state.profile_user_auth.user.config.oc
						showOlympicMath: showOlympicMath,
						isShowHolidayWork: state.profile_user_auth.user.config && state.profile_user_auth.user.config.vacation,
						userConfig: state.profile_user_auth.user.config
				}
		}
		
		mapActionToThis() {
				let his = this.homeInfoService;
				let olympicMathService = this.olympicMathService;
				let profileService = this.profileService;
				return {
						changeClazz: his.changeTrophyClazz.bind(his),
						changeUrlFromForStore: olympicMathService.changeUrlFromForStore.bind(olympicMathService),
						getRewardInfoServer: profileService.getRewardInfoServer.bind(profileService)
				}
		}
		
		onReceiveProps() {
				this.ensurePageData();
		}
		
		ensurePageData() {
				if ((this.passClazzList || this.clazzList || this.selfStudyClazzList) && !this.initCtrl) {
						this.initCtrl = true;
						this.showOlypicMath = !!_find(this.passClazzList, {'grade': 3}) || !!_find(this.clazzList, {'grade': 3}) || !!_find(this.selfStudyClazzList, {'grade': 3});
				}
		}
		
		onAfterEnterView() {
				this.getLiveInfo();
				this.commonService.setLocalStorage('studyStateLastStateUrl', 'home.study_index');
				if (!this.commonService.getLocalStorage('childrenDayAd' + this.loginName) && this.hasChildrenDay) {
						this.getRootScope().showChildDayAd = true;
						this.commonService.setLocalStorage('childrenDayAd' + this.loginName, true)
				}
				this.$ionicSlideBoxDelegate.$getByHandle('winter-holidays-box').update();
				this.$ionicSlideBoxDelegate.$getByHandle('winter-holidays-box').stop();
				let timeId = this.$timeout(() => {
						this.$ionicSlideBoxDelegate.$getByHandle('winter-holidays-box').start();
						this.$timeout.cancel(timeId);
				}, 300000);
				this.$ocLazyLoad.load("m_live");
				this.$ocLazyLoad.load("m_olympic_math_microlecture");
				this.$ocLazyLoad.load("m_holiday_work");
				this.$ocLazyLoad.load("m_question_every_day");
				this.$ocLazyLoad.load("m_oral_calculation");
				this.$ocLazyLoad.load("m_final_sprint");
				this.$ocLazyLoad.load("m_game_map");
				this.$ocLazyLoad.load("m_math_game");
				this.$ocLazyLoad.load("m_compute");
				this.$ocLazyLoad.load("m_reward");
				this.$ocLazyLoad.load("m_diagnose");
				this.$ocLazyLoad.load("m_me");
				this.$ocLazyLoad.load("m_diagnose_pk");
				this.$ocLazyLoad.load("m_user_auth");
				this.$ocLazyLoad.load("m_work");
				this.$ocLazyLoad.load("m_pet_page");
				this.$ocLazyLoad.load("m_winter_camp");
				this.$ocLazyLoad.load("m_improve");
				if (this.isXlyVip)this.$ocLazyLoad.load("m_xly");
				if (this.showOlympicMath)this.$ocLazyLoad.load("m_olympic_math_home");
		}
		
		//===========顶部轮播操作处理=========================
		/**
		 * 显示寒假作业广告
		 */
		showWinterAd() {
				this.getRootScope().showWinterWorkFlag = true;
		}
		
		/**
		 * 显示寒假作业直播
		 */
		showWinterBroadcast() {
				this.getRootScope().showWinterBroadcast = true;
				this.getRootScope().winterBroadcastLoading = true;
				this.homeInfoService.fetchWinterBroadcastData().then((res) => {
						this.getRootScope().winterBroadcastLoading = false;
						
						if (!res) {
								this.getRootScope().winterBroadcastData = "error";
						} else {
								this.getRootScope().winterBroadcastData = res.list;
						}
						
				}, () => {
						this.getRootScope().winterBroadcastLoading = false;
						this.getRootScope().winterBroadcastData = "error";
				})
		}
		
		/**
		 * 显示竞赛广告
		 */
		showCompetitionAd() {
				this.getRootScope().showCompetitionAdFlag = true;
				this.getRootScope().isShowSeeBtnFlag = true;
		}
		
		/**
		 * 点击轮播图片
		 */
		clickActivePage(type) {
				switch (type) {
						case "monitor":
								this.getRootScope().showMonitorAd = true;
								break;
						case "microlecture":
								this.getRootScope().showOlympicMathMicrolectureAd = true;
								break;
						case "winter-camp":
								this.getRootScope().showWinterCampAd = true;
								break;
						case "winter-holidays":
								this.showWinterBroadcast();
								break;
						case "finalSprint":
								this.getRootScope().finalSprintAdFlag = true;
								break;
						case "live":
								this.getRootScope().showLiveAd = true;
								// this.goToLive();
								break;
						case "holidayWork":
								this.showHolidayHomeworkAd();
								break;
				}
		}
		
		showHomeDiagnoseAds() {
				this.getRootScope().showGameAdDialogFlag = false;
				this.getRootScope().showDiagnoseAdDialogFlag = true;
				this.getRootScope().firstShowDignoseAdDialog = true;
				this.getRootScope().showXLYAdDialogFlag = false;
		}
		
		showRewardStuAd() {
				this.getRootScope().showRewardStuAd = true;
		}
		
		showHolidayHomeworkAd() {
				this.getRootScope().isShowHolidayHomeworkAdFlag = true;
		}
		
		showOralCalculationAd() {
				this.getRootScope().showDiagnoseAdDialogFlag = false;
				this.getRootScope().firstShowDignoseAdDialog = false;
				this.getRootScope().showWinterBroadcast = false;
				// this.getRootScope().showOralCalculationGuideFlag = true;
		}
		
		//===========内容列表操作处理=========================
		/**
		 * 去作业页面
		 */
		goToWorkPage() {
				// this.$ocLazyLoad.load("m_work").then(()=>{
				this.changeUrlFromForStore('work_list');
				this.go('home.work_list', 'forward', {fromUrl: 'work_list'});
				// });
		}
		
		/*去区域测评*/
		goToAEWorkList() {
				// this.$ocLazyLoad.load("m_work").then(()=>{
				this.changeUrlFromForStore('area_evaluation');
				this.go('home.work_list', 'forward', {fromUrl: 'area_evaluation'});
				// });
		}
		
		goToQED(){
				this.changeUrlFromForStore('question_every_day_list');
				this.go('home.question_every_day_list', 'forward', {fromUrl: 'question_every_day_list'});
		}
		
		goToOralCalculation() {
				// this.$ocLazyLoad.load("m_oral_calculation").then(() => {
				this.changeUrlFromForStore('oral_work');
				this.go('home.oral_calculation_work_list', 'forward', {fromUrl: 'oral_work'});
				// });
		}
		
		/**
		 * 去游戏页面
		 */
		goToGamePage() {
				// this.$ocLazyLoad.load("m_math_game").then(() => {
				this.go('home.game_list', 'forward');
				// });
		}
		
		/**
		 * 去速算页面
		 */
		goToComputePage() {
				// this.$ocLazyLoad.load("m_compute").then(()=>{
				this.go('home.compute', 'forward');
				// });
				
		}
		
		/**
		 * 去诊断页面
		 */
		goToDiagnosePage(isIncreaseScore) {
				// this.$ocLazyLoad.load("m_diagnose").then(() => {
				this.go('home.diagnose02', 'forward', {isIncreaseScore: isIncreaseScore});
				
				// });
		}
		
		/**
		 * 去奥数主页页面
		 */
		goToOlympicMathPage() {
				// if (!this.showOlypicMath) {
				//     this.commonService.showAlert('温馨提示', '<p>奥数现阶段只开通了三年级上册内容</p>').then(() => {
				//         this.go('home.olympic_math_home', 'forward');
				//     });
				// } else {
				//     this.go('home.olympic_math_home', 'forward');
				// }
				
				this.getRootScope().showOlypicMathChagneAd = true;
		}
		
		gotoOlympicMathMicrolecture() {
				this.go("home.micro_unit_list");
		}
		
		goToGameGoodsSelect() {
				// this.$ocLazyLoad.load("m_game_map").then(() => {
				this.go('game_map_scene');
				// });
		}
		
		/**
		 * 去期末冲刺页面
		 */
		goToFinalSprint() {
				// this.$ocLazyLoad.load("m_final_sprint").then(() => {
				/*清空当前周到state*/
				// this.finalSprintService.selectPaper({});
				this.changeUrlFromForStore('final_sprint');
				this.go('final_sprint_home');
				// });
		}
		
		goToXLY() {
				// this.$ocLazyLoad.load("m_xly").then(()=>{
				this.go('smart_training_camp');
				// });
				
		}
		
		/**
		 * 切换头像
		 */
		changeHead() {
				this.getRootScope().showChangeHeadFlag = true;
		}
		
		levelDialog() {
				this.getRootScope().showRewardDialogFlag = true;
				this.getRootScope().dialogType = 'level';
				this.getRewardInfoServer();
		}
		
		creditsDialog() {
				this.getRootScope().showRewardDialogFlag = true;
				this.getRootScope().dialogType = 'credits';
				this.getRewardInfoServer();
		}
		
		/**
		 * 去往称号列表页面
		 */
		gotoLevelName() {
				// this.$ocLazyLoad.load("m_reward").then(() => {
				this.getRewardInfoServer();
				this.go("reward_level_name", {backUrl: 'home.study_index'});
				// });
		}
		
		back() {
				if ($(".popup-showing").length > 0) return;
				if (this.getRootScope().showDiagnoseAdDialogFlag) {
						this.getRootScope().showDiagnoseAdDialogFlag = false;
				}
				else if (this.getRootScope().showRewardDialogFlag) {
						this.getRootScope().showRewardDialogFlag = false;
				}
				else if (this.getRootScope().showWinterCampAd) {
						this.getRootScope().showWinterCampAd = false;
				}
				else if (this.getRootScope().showOlympicMathMicrolectureAd) {
						this.getRootScope().showOlympicMathMicrolectureAd = false;
				}
				else if (this.getRootScope().showGameAdDialogFlag) {
						this.getRootScope().showGameAdDialogFlag = false;
				}
				else if (this.getRootScope().showWinterBroadcast) {
						this.getRootScope().showWinterBroadcast = false;
				}
				else if (this.getRootScope().showChangeHeadFlag) {
						this.getRootScope().showChangeHeadFlag = false;
				}
				else if (this.getRootScope().showMonitorAd) {
						this.getRootScope().showMonitorAd = false;
				}
				else if (this.getRootScope().finalSprintAdFlag) {
						this.getRootScope().finalSprintAdFlag = false;
						// window.localStorage.setItem('notfinalSprintAdFlag', this.loginName);
				}
				else if (this.getRootScope().isShowHolidayHomeworkAdFlag) {
						this.getRootScope().isShowHolidayHomeworkAdFlag = false;
				}
				else {
						return 'exit';
				}
				this.getRootScope().$digest();
		}
		
		/**
		 * 期末测评入口
		 */
		goToFinalAccess() {
				// this.$ocLazyLoad.load("m_work").then(() => {
				this.changeUrlFromForStore(this.finalData.URL_FROM.FINAL_ACCESS);
				this.go('home.work_list', 'forward', {fromUrl: this.finalData.URL_FROM.FINAL_ACCESS});
				// })
		}
		
		goToHolidayWorkList() {
				// this.$ocLazyLoad.load("m_holiday_work").then(() => {
				this.changeUrlFromForStore('work_list');
				this.go('holiday_work_list');
				// });
		}
		
		goToWinterCamp() {
				this.go('home.winter_camp_home');
		}
		
		goToLive() {
				this.go('home.live_home');
		}
		
		getScrollPosition() {
				if (this.$ionicScrollDelegate.getScrollPosition().top >= 50) {
						$('.slide-down-notice').hide();
				}
				else {
						$('.slide-down-notice').show();
				}
		};
		
		isShowArrow() {
				let outH = $('.study-index-file-content').innerHeight();
				let inH = $('.study-index-file-content .scroll').innerHeight();
				return !this.isWin && inH + 10 > outH;
		}
		
		showChildrenDayAd() {
				this.getRootScope().showChildDayAd = true;
		}
		
		goToXlyV2() {
				this.go('xly_vip_v2');
		}
}
