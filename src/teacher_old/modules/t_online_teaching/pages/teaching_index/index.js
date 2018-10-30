/**
 * Created by ww on 2017/1/11.
 *
 */
import {View, select} from "./../../module";
import imgUploadModal from './img_upload_modal.html';

@View('online_teaching_index', {
	url: '/online_teaching_index/:onLine',
	styles: require('./index.less'),
	template: require('./index.html'),
	cache:false,
	inject: [
		'$state'
		, '$scope'
		, '$rootScope'
		, '$ngRedux'
		, '$ocLazyLoad'
		, '$ionicModal'
		,'commonService'
		,'$ionicLoading'
		, '$timeout'
	]
})
class OnlineTeachingIndexCtrl {
	$ocLazyLoad;
	$ionicModal;
	commonService;
	@select((state)=>state.profile_user_auth.user) user;
	@select((state)=>state.profile_user_auth.user.loginName) loginName;
	modal;
	selectQuestionImgSrc;
	isDrawing = true;
	onLineInfo = '';
	isPeerOnLine = false;
	selectPicName = "";
	constructor() {
		this.initData();
	}
	
	initData() {
		this.onLineStatusInfo = '未连接';
		this.onLineCount = '';
		this.modal = this.$ionicModal.fromTemplate(imgUploadModal, {
			scope: this.getScope()
		});
	}
	
	configDataPipe(){
		// this.dataPipe.when(()=>!this.onLineInfo && this.user)
		// 	.then(()=>{
		// 		this.onLineInfo = this.user.loginName;
		// 	})
	}
	
	
	onAfterEnterView() {
		console.log('enter view...............')
	}
	onBeforeLeaveView(){
		this.getScope().$broadcast('close_teaching_board_socket');
		console.log('leave view...............');
		this.modal.remove();
		
	}
		
	back() {
		this.go('home.me', 'back');
	}
	
	showImgUploadModal() {
		this.modal.show();
	}
	
	hideModal(redraw) {
		this.modal.hide();
		if(redraw)this.getScope().$broadcast('modal_close');
	}
	
	preview(file) {
		if(!file.value){return}
		this.selectPicName = file.value;
		let msg = "您可以上传png, jpg格式的图片";
		let filter = {
			"jpeg": "/9j/4",
			"png": "iVBORw"
		};
		let img = new Image(),
			canvas = document.createElement('canvas'),
			context = canvas.getContext('2d');
		
		let self = this;
		if (window.FileReader) {
			let filereader = new FileReader();
			filereader.onload =  (event) =>{
				let srcpath = event.target.result;
				if (!validateImg(srcpath)) {
					console.log("H5" + msg);
				} else {
					img.src = srcpath;
				}
			};
			this.$timeout(()=>{filereader.readAsDataURL(file.files[0]);},200);
				this.$ionicLoading.show({
						template: '图片加载中....',
				});
		} else {
			if (!/\.jpg$|\.png$/i.test(file.value)) {
				console.log("原生" + msg);
			} else {
				img.src = file.value;
			}
		}
		
		img.onload = function(){
				self.$ionicLoading.hide();
			// 图片原始尺寸
			let originWidth = this.width;
			let originHeight = this.height;
			// 最大尺寸限制
			let maxWidth = 1024;
			// 目标尺寸
			let targetWidth = originWidth, targetHeight = originHeight;
			// 图片尺寸超过1024x*的限制
			if (originWidth > maxWidth) {
				targetWidth = maxWidth;
				targetHeight = Math.round(maxWidth * (originHeight / originWidth));
			}
			
			// canvas对图片进行缩放
			canvas.width = targetWidth;
			canvas.height = targetHeight;
			// 清除画布
			context.clearRect(0, 0, targetWidth, targetHeight);
			// 图片压缩
			context.drawImage(img, 0, 0, targetWidth, targetHeight);
			// todo canvas转为blob并上传
			self.getScope().$apply(()=>{
				self.selectQuestionImgSrc = canvas.toDataURL('image/jpg',0.6);
			});
		};
		
		function validateImg(data) {
			console.log(data);
			var pos = data.indexOf(",") + 1;
			for (var e in filter) {
				if (data.indexOf(filter[e]) === pos) {
					return e;
				}
			}
			return null;
		}
	}

	uploadQuestionImg(){
			this.$ionicLoading.show({
					template: '图片同步中....',
			});
			this.$timeout(()=>{
					this.getScope().$broadcast('upload-question-img',this.selectQuestionImgSrc);
					this.hideModal();
					this.$ionicLoading.hide();
			},200);
	}
	changeDrawingType(){
		this.isDrawing = !this.isDrawing;
	}
	
	gotoOnlineTeachingIndexPage(){
		if(!this.onLineCount || !this.onLineCount.match(/^1\d{10}[TtSs]\d?$/)){
			this.commonService.alertDialog('请正确输入与你连线的账号',3000);
		}else {
			this.onLineInfo = this.onLineCount.toUpperCase();
			// this.getScope().$broadcast('reconnect_teaching_board_socket');
		}
	}
}
export default OnlineTeachingIndexCtrl