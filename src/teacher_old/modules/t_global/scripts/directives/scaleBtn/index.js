/**
 * Created by ww on 2018/3/28.
 */
import './style.less';
export default function () {
	return {
		restrict: 'E',
		scope: true,
		replace: false,
		controller: ['$scope', '$compile', function ($scope, $compile) {
			this.scaleRate = 1;
			this.scaleBtnOn = false;
			this.$compile = $compile;
			this.startPoint = {x:0,y:0,translateX:0,translateY:0};
			this.originPoint = {x:0,y:0};
			let me = this;
			this.handleScale = function (e) {
				let cssVal;
				e.stopPropagation();
				if(me.scaleBtnOn){
					if(me.scaleRate<4){me.scaleRate++;}
					else{me.scaleRate = 4}
				}
				
				console.log('click');
				cssVal = `scale(${me.scaleRate})`;
				$scope.$viewPage.css('transform',cssVal);
				$scope.$viewPage.css('transform-origin',`${e.x}px ${e.y}px`);
				me.originPoint.x = e.x;
				me.originPoint.y = e.y;
				
			};
			this.handleMousemove = function (e) {
				e.stopPropagation();
				console.log('mousemove');
				let offsetX = (e.x - me.startPoint.x)/me.scaleRate + me.startPoint.translateX;
				let offsetY = (e.y - me.startPoint.y)/me.scaleRate + me.startPoint.translateY;
				
				//拖动边界处理
				if(offsetX > me.originPoint.x*((me.scaleRate-1)/me.scaleRate)){
					offsetX = me.originPoint.x*((me.scaleRate-1)/me.scaleRate);
				}
				if(offsetX < -(window.innerWidth-me.originPoint.x)*((me.scaleRate-1)/me.scaleRate)){
					offsetX = -(window.innerWidth-me.originPoint.x)*((me.scaleRate-1)/me.scaleRate)
				}
				if(offsetY > me.originPoint.y*((me.scaleRate-1)/me.scaleRate)){
					offsetY = me.originPoint.y*((me.scaleRate-1)/me.scaleRate);
				}
				if(offsetY < -(window.innerHeight-me.originPoint.y)*((me.scaleRate-1)/me.scaleRate)){
					offsetY = -(window.innerHeight-me.originPoint.y)*((me.scaleRate-1)/me.scaleRate)
				}
				
				
				
				$scope.$viewPage.css('transform',`scale(${me.scaleRate}) translate(${offsetX}px,${offsetY}px)`);
			};
			this.handleMousedown = function (e) {
				// e.stopPropagation();
				let transform = $scope.$viewPage.css('transform').match(/(-)?\d+/g);
				let translate = transform&&transform.splice(-2);
				me.startPoint.x = e.x;
				me.startPoint.y = e.y;
				if(translate){
					me.startPoint.translateX = +translate[0]/me.scaleRate;
					me.startPoint.translateY = +translate[1]/me.scaleRate;
				}
				console.log('mousedown');
				$scope.$viewPage.get(0).removeEventListener('mousemove',me.handleMousemove,true);
				$scope.$viewPage.get(0).addEventListener('mousemove',me.handleMousemove,true);
			};
			this.handleMouseup = function (e) {
				console.log('mouseup');
				$scope.$viewPage.get(0).removeEventListener('mousemove',me.handleMousemove,true);
			};
			this.handleMouseout = function (e) {
				console.log('mouseout');
				$scope.$viewPage.get(0).removeEventListener('mousemove',me.handleMousemove,true);
			}
		}],
		link: function ($scope, $element, $attrs, ctrl) {
			$scope.ctrl = ctrl;
			let $body = $('body'),
				$viewPage = $('body > ion-nav-view');
			let preDom = $('body > div.scale-btn-default');
			if(preDom.length){
				$body.remove(preDom);
			}
			let wrapBox = $('<div class="scale-btn-default"><span>{{ctrl.scaleBtnOn?"取消放大":"开启放大"}}</span></div>');
			
			$body.append(wrapBox);
			$scope.$viewPage = $viewPage;
			ctrl.$compile(wrapBox)($scope);
			wrapBox.on('click',(e)=>{
				let target = $(e.currentTarget);
				if(target.hasClass('scale-btn-click-on')){
					$scope.$apply(()=>{
						ctrl.scaleBtnOn = false;
					});
					target.removeClass('scale-btn-click-on');
					$viewPage.get(0).removeEventListener('click',ctrl.handleScale,true);
					$viewPage.css('transform','initial');
					$viewPage.css('cursor','initial');
					
					$viewPage.get(0).removeEventListener('mousedown',ctrl.handleMousedown,true);
					$viewPage.get(0).removeEventListener('mouseup',ctrl.handleMouseup,true);
					$viewPage.get(0).removeEventListener('mousemove',ctrl.handleMousemove,true);
					$viewPage.get(0).removeEventListener('mouseout',ctrl.handleMouseout,true);
					
				}
				else{
					$scope.$apply(()=>{
						ctrl.scaleBtnOn = true;
					});
					ctrl.scaleRate = 1;
					ctrl.startPoint.translateX = 0;
					ctrl.startPoint.translateY = 0;
					ctrl.originPoint.y = 0;
					ctrl.originPoint.x = 0;
					
					target.addClass('scale-btn-click-on');
					$viewPage.get(0).addEventListener('click',ctrl.handleScale,true);
					$viewPage.css('transform','initial');
					$viewPage.css('cursor','zoom-in');
					
					$viewPage.get(0).addEventListener('mousedown',ctrl.handleMousedown,true);
					$viewPage.get(0).addEventListener('mouseup',ctrl.handleMouseup,true);
					$viewPage.get(0).addEventListener('mouseout',ctrl.handleMouseout,true);
				}
			});
			
			
		}
	};
}
