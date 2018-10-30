/**
 * Created by Administrator on 2018/4/2.
 */

export default


angular.module("teachingBoard", [])
	.directive('teachingBoard', ['uuid4', 'commonService','$timeout','serverInterface',function (uuid4,commonService,$timeout,serverInterface) {
		return {
			restrict: 'A',
			scope: {
				strokeColor:'@',
				isDrawing:'=',
				onLineInfo:'=',
				isPeerOnLine:'=',
				onLineStatusInfo:'=',
				loginName:'=',
			},
			template:`<canvas class="show-board"></canvas><canvas class="draw-board"></canvas>`,
			replace: false,
			link: function ($scope, $elem, $attrs, ctrl) {
				let offsetSize = {
						x: 32,
						y: 44
					},
					questionImgDom = $scope.questionImgDom = $('<img id="0"/>');
				let strokeList  = $scope.strokeList = [];
				let drawingStroke = $scope.drawingStroke  = {
					id: '',
					data: [],
					rect: {
						x: 0,
						y: 0,
						width: 0,
						height: 0
					}
				}; //笔画列表;
				let dataVerificationTimer = 0, isSendDataRightNow = false;
				const SEND_DATA_TYPE = {
					DRAWING:"drawing",
					MODIFY_QUESTION_IMG:"modify_question_img",
					DELETE:"delete",
					PUSH_ALL_STROKE:"push_all_stroke",
					DRAW_COMPLETE:"draw_complete",
					DATA_VERIFICATION:"data_verification",
				};
				const MESSAGE_SRC = {
					SERVER:1, //来自服务器的数据
				};
				const PEER_STATUS = {
					DEFAULT:0, //第一个进入房间
					ON_LINE:1, //对方在线
					OFF_LINE:2, //对方掉线
				};
				// 打开一个 web socket
				
				let canvas = $elem.find('.draw-board').get(0),
					showBoard = $elem.find('.show-board').get(0);
				let context = canvas.getContext('2d'),
					showContext = showBoard.getContext('2d');
				
				let drawing = false;
				let isCloseBySelf = false;
				let isTouch = !!('ontouchstart' in window);
				let printStart = 'mousedown',
					printMove = 'mousemove',
					printEnd = 'mouseup';
				if (isTouch) {
					printStart = 'touchstart';
					printMove = 'touchmove';
					printEnd = 'touchend';
				}
				
				canvas.addEventListener(printStart, onMouseDown, false);
				canvas.addEventListener(printEnd, onMouseUp, false);
				canvas.addEventListener('mouseout', onMouseUp, false);
				canvas.addEventListener(printMove, throttle(onMouseMove, 10), false);
				
				window.addEventListener('resize', onResize, false);
				onResize();

				let socket = undefined;
				function reconnect() {
					$scope.onLineStatusInfo = '连接中';
					console.log('连接中');
					if(socket){
						socket.close();
					}
					
					let onLineInfoNum = +$scope.onLineInfo.match(/\d+/);
					let loginNameNum = +$scope.loginName.match(/\d+/);
					let onLine = onLineInfoNum>loginNameNum? `${$scope.onLineInfo}-${$scope.loginName}`:`${$scope.loginName}-${$scope.onLineInfo}`;
					if(onLineInfoNum == loginNameNum){
							onLine = $scope.onLineInfo.match(/T/gi) ?`${$scope.onLineInfo}-${$scope.loginName}`:`${$scope.loginName}-${$scope.onLineInfo}`;
					}
					
					let url = `${serverInterface.ON_LINE_WS}/${onLine}`;
					socket = window.ws = new WebSocket(url);
					console.log(url);
					socket.onopen = function () {
						$scope.$apply(()=>{
							$scope.onLineStatusInfo = '已连接';
						},$scope);
						
						console.log("加入房间中...");
					};
					
					socket.onmessage = function (evt) {
						isSendDataRightNow = false;
						let data = JSON.parse(evt.data);
						
						if(data.src == MESSAGE_SRC.SERVER){
							$scope.isPeerOnLine = data.code == PEER_STATUS.ON_LINE;
							commonService.alertDialog(data.message,2000);
							if($scope.isPeerOnLine){
								console.log(`send:===========> peer join`);
								console.log(`type${SEND_DATA_TYPE.DATA_VERIFICATION}`);
								console.log(`strokeIds${strokeList.reduce((pre,next)=>{pre.push(next.id);return pre},[])}`);
								console.log(`imgId${questionImgDom.attr('id')}`);
								console.log(`send:===========`);
								
								socket.send(JSON.stringify({
									type: SEND_DATA_TYPE.DATA_VERIFICATION,
									strokeIds:strokeList.reduce((pre,next)=>{pre.push(next.id);return pre},[]),
									imgId:questionImgDom.attr('id')
								}));
							}
							if(data.code == PEER_STATUS.OFF_LINE){
								clearInterval(dataVerificationTimer);
							}
							console.log("服务器数据已接收...",evt.data);
							return
						}
						try {
							if (data.payload) {
								let payload = JSON.parse(data.payload);
								console.log("接收数据...",payload.type);
								switch (payload.type) {
									case SEND_DATA_TYPE.MODIFY_QUESTION_IMG:
										drawQuestionImg(payload.data,payload.id,payload.heightRate);
										break;
									case SEND_DATA_TYPE.DRAWING:
										if(!drawing){
												onDrawingEvent(payload.data);
												checkStrokeDataSynchronization(payload.strokeIds);
										}
										break;
									case SEND_DATA_TYPE.DELETE:
										deleteStroke(payload.data,false);
										checkStrokeDataSynchronization(payload.strokeIds);
										break;
									case SEND_DATA_TYPE.PUSH_ALL_STROKE:
										pushAllStroke(payload.data);
										break;
									case SEND_DATA_TYPE.DRAW_COMPLETE:
										drawComplete();
										checkStrokeDataSynchronization(payload.strokeIds);
										break;
									case SEND_DATA_TYPE.DATA_VERIFICATION:
										if(payload.pushData && payload.pushData.length){
											payload.pushData.forEach((item)=>{
												let hasItem = strokeList.find((stroke)=>{return stroke.id == item.id});
												if(!hasItem){
													strokeList.push(item);
												}
											});
										
											reDrawStroke();
										}
										
										if(payload.pullIds && payload.pullIds.length){
											let pushData = [];
											payload.pullIds.forEach((id)=>{
												pushData.push(strokeList.find((stroke)=>{return stroke.id == id}));
											});
											console.log(`send:===========>on message`);
											console.log(`type${SEND_DATA_TYPE.DATA_VERIFICATION}`);
											console.log(`pushData${pushData}`);
											console.log(`send:===========`);
											
											socket.send(JSON.stringify({
												type: SEND_DATA_TYPE.DATA_VERIFICATION,
												pushData:pushData,
											}));
										}
										
										if(payload.strokeIds){
											checkStrokeDataSynchronization(payload.strokeIds);
										}
										
										if(payload.imgId){
											checkImgDataSynchronization(payload.imgId);
										}
										if(payload.imgData){
											questionImgDom.attr("src", payload.imgData).attr('id',payload.imgId);
											let timeId = setTimeout(()=> {
												reDrawStroke(payload.heightRate);
												clearTimeout(timeId);
											}, 0);
										}
										
										break;
								}
							}
						}catch (e){
							
						}
					};
					
					socket.onclose = function () {
						if(!isCloseBySelf) {
							let timer = $timeout(()=>{
								$timeout.cancel(timer);
								reconnect();
							},1000);
							if(dataVerificationTimer){
								clearInterval(dataVerificationTimer);
							}
						}
						// $scope.$apply(()=>{
							$scope.onLineStatusInfo = '连接中';
							console.log('连接中colse');
						// },$scope);
					};
					// setDataVerificationTimer();
					socket.onerror = function (){
						// $scope.$apply(()=>{
							$scope.onLineStatusInfo = '未连接';
							console.log('未连接error');
							
						// },$scope);
					}
				}
				$scope.$watch('onLineStatusInfo',()=>{});
				$scope.$watch('onLineInfo',(next, pre)=>{
					if(next && next !== pre){
						if(socket){
							socket.close();
							$scope.onLineStatusInfo = '连接中';
						}else {
							reconnect()
						}
					}
				},true);
				$scope.$on('upload-question-img', (e, data)=> {
					let domId = questionImgDom.attr('src',data).attr('id'),
						id = +domId ? ++domId:new Date().getTime(),
						originalWidth = questionImgDom.get(0).width,
						originalHeight = questionImgDom.get(0).height,
						heightRate = (originalHeight * canvas.width / originalWidth)/canvas.height;
					//更新试题图片到正在连接的客户端
					socket&&socket.send(JSON.stringify({
						type: SEND_DATA_TYPE.MODIFY_QUESTION_IMG,
						data: data,
						id:id,
						heightRate:heightRate
					}));
					drawQuestionImg(undefined,id,heightRate);
					
				});
				$scope.$on('close_teaching_board_socket',(e)=>{
					isCloseBySelf = true;
					socket&&socket.close();
				});
				// $scope.$on('reconnect_teaching_board_socket',(e)=>{
				// 	if(socket){
				// 		socket.close();
				// 		$scope.onLineStatusInfo = '连接中';
				// 	}else {
				// 		reconnect()
				// 	}
				// });
				
				$scope.$on('modal_close',(e)=>{
					reDrawStroke();
				});
				$scope.$on('$destroy',()=>{
					// if(dataVerificationTimer){
					// 	clearInterval(dataVerificationTimer);
					// }
				});
				function drawQuestionImg(data,id,heightRate) {
					if(data){
						questionImgDom.attr("src", data)
					}
					questionImgDom.attr('id',id);
					showContext.clearRect(0, 0, canvas.width, canvas.height);
					strokeList.length = 0;
					let timeId = setTimeout(()=> {
						showContext.drawImage(questionImgDom.get(0), 0, 0, canvas.width, heightRate*canvas.height);
						clearTimeout(timeId);
					}, 0);
				}
				
				function drawLine(emit,data,ctx) {
					if(emit) {
						socket && socket.readyState == socket.OPEN && socket.send(JSON.stringify({
							type: SEND_DATA_TYPE.DRAWING,
							data: drawingStroke,
							strokeIds:strokeList.reduce((pre,next)=>{pre.push(next.id);return pre},[])
						}));
						isSendDataRightNow = false;
						
					}
					if(!data){
						data = drawingStroke.data;
					}
					if(!ctx){
						context.clearRect(0, 0, canvas.width, canvas.height);
						ctx = context;
					}else {
						ctx.strokeStyle = $scope.strokeColor;
					}
					ctx.lineWidth = 3;
					ctx.lineJoin = ctx.lineCap = 'round';
					ctx.strokeStyle = drawingStroke.strokeColor;
					
					ctx.beginPath();
					if(data.length <=3){
						ctx.arc(data[0].x*canvas.width, data[0].y*canvas.height, ctx.lineWidth, 0, Math.PI * 2, !0);
						ctx.fill();
					}else {
						ctx.moveTo(data[0].x*canvas.width, data[0].y*canvas.height);
						let i,len;
						for (i = 1, len = data.length; i < len - 2; i++) {
							let c = (data[i].x*canvas.width + data[i + 1].x*canvas.width) / 2;
							let d = (data[i].y*canvas.height + data[i + 1].y*canvas.height) / 2;
							ctx.quadraticCurveTo(data[i].x*canvas.width, data[i].y*canvas.height, c, d);
						}
						ctx.quadraticCurveTo(
							data[i].x*canvas.width,
							data[i].y*canvas.height,
							data[i + 1].x*canvas.width,
							data[i + 1].y*canvas.height
						);
						ctx.stroke();
					}
					ctx.closePath();
				}
				
				function onMouseDown(e) {
					e.preventDefault();
					
					let pageX = isTouch ? e.changedTouches[0].pageX : e.clientX;
					let pageY = isTouch ? e.changedTouches[0].pageY : e.clientY;
					drawing = true;
					pageX -= e.target.getBoundingClientRect().left;
					pageY -= e.target.getBoundingClientRect().top;
					drawingStroke.data.length = 0;
					drawingStroke.strokeColor = !$scope.isDrawing?'red':$scope.strokeColor;
					drawingStroke.id = uuid4.generate();
					drawingStroke.rect = {
						x: pageX,
						y: pageY,
						width: 1,
						height: 1
					};
					drawingStroke.data.push(
						{x: (pageX - 1) / canvas.width, y: (pageY - 1) / canvas.height},
						{x: pageX / canvas.width, y: pageY / canvas.height},
						{x: (pageX + 1) / canvas.width, y: (pageY + 1) / canvas.height}
					)
				}
				
				function onMouseUp(e) {
					e.preventDefault();
					if (!drawing) {
						drawingStroke.data.length = 0;
						return;
					}
					drawing = false;
					context.clearRect(0, 0, canvas.width, canvas.height);
					if(!$scope.isDrawing){
						deleteStroke(drawingStroke,true);
					}else {
						strokeList.push({
							id:drawingStroke.id,
							strokeColor:drawingStroke.strokeColor,
							rect:Object.assign({},drawingStroke.rect),
							data:drawingStroke.data.slice(0)
						});
						drawLine(false,undefined,showContext);
						socket && socket.readyState == socket.OPEN && socket.send(JSON.stringify({
							type: SEND_DATA_TYPE.DRAW_COMPLETE,
							strokeIds:strokeList.reduce((pre,next)=>{pre.push(next.id);return pre},[])
						}));
						isSendDataRightNow = false;
						
					}
				}
				
				function onMouseMove(e) {
					e.preventDefault();
					if (!drawing) {
						return;
					}
					let pageX = isTouch ? e.changedTouches[0].pageX : e.clientX;
					let pageY = isTouch ? e.changedTouches[0].pageY : e.clientY;
					pageX -= e.target.getBoundingClientRect().left;
					pageY -= e.target.getBoundingClientRect().top;
					drawingStroke.data.push({x: pageX / canvas.width, y: pageY / canvas.height});
					
					if(pageX-drawingStroke.rect.x > 0){
						drawingStroke.rect.width = Math.max(pageX-drawingStroke.rect.x, drawingStroke.rect.width);
					}else {
						drawingStroke.rect.width += drawingStroke.rect.x -pageX;
					}
					if(pageY-drawingStroke.rect.y > 0){
						drawingStroke.rect.height = Math.max(pageY-drawingStroke.rect.y, drawingStroke.rect.height);
					}else {
						drawingStroke.rect.height += drawingStroke.rect.y -pageY;
					}
					
					
					drawingStroke.rect.x = Math.min(pageX,drawingStroke.rect.x);
					drawingStroke.rect.y = Math.min(pageY,drawingStroke.rect.y);
					drawLine($scope.isDrawing);
				}
				
				// limit the number of events per second
				function throttle(callback, delay) {
					var previousCall = new Date().getTime();
					return function () {
						var time = new Date().getTime();
						
						if ((time - previousCall) >= delay) {
							previousCall = time;
							callback.apply(null, arguments);
						}
					};
				}
				
				function onDrawingEvent(data) {
					drawingStroke = data;
					drawLine(false);
				}
				
				// make the canvas fill its parent
				function onResize() {
					canvas.width = showBoard.width = window.innerWidth - offsetSize.x;
					canvas.height = showBoard.height = 2 * window.innerHeight;
				}
				
				function deleteStroke(rect,emit) {
					let canDeleteStrokeList = [],rect1;
					//从服务器接收到删除的消息
					if(rect instanceof Array){
						rect.forEach((item)=>{
							let index = strokeList.findIndex((stroke)=>{return stroke.id == item.id});
							strokeList.splice(index,1);
						})
					}else {
						rect1 = rect;
						for(let i = strokeList.length-1;i>=0;i--){
							let rect2 = strokeList[i];
							let center1 = {
								y: rect1.rect.y + rect1.rect.height / 2,
								x: rect1.rect.x + rect1.rect.width / 2
							};
							let center2 = {
								y: rect2.rect.y + rect2.rect.height / 2,
								x: rect2.rect.x + rect2.rect.width / 2
							};
							if ((rect1.rect.width + rect2.rect.width) / 2 >= Math.abs(center1.x - center2.x)
								&& (rect1.rect.height + rect2.rect.height) / 2 >= Math.abs(center1.y - center2.y)) {
								
								strokeList.splice(i,1);
								canDeleteStrokeList.push(rect2);
							}
						}
						if(emit){
							socket&&socket.send(JSON.stringify({
								type: SEND_DATA_TYPE.DELETE,
								data: canDeleteStrokeList,
								strokeIds:strokeList.reduce((pre,next)=>{pre.push(next.id);return pre},[])
							}));
							isSendDataRightNow = false;
						}
					}
					
					reDrawStroke();
				}
				function reDrawStroke(heightRate) {
					let originalWidth = questionImgDom.get(0).width;
					let originalHeight = questionImgDom.get(0).height;
					if(!heightRate){
						heightRate = (originalHeight * canvas.width / originalWidth)/canvas.height;
					}
					showContext.clearRect(0, 0, canvas.width, canvas.height);
					showContext.drawImage(questionImgDom.get(0), 0, 0, canvas.width, heightRate*canvas.height);
					
					
					strokeList.forEach((stroke)=>{
						showContext.beginPath();
						showContext.lineWidth = 3;
						showContext.lineJoin = showContext.lineCap = 'round';
						showContext.strokeStyle = stroke.strokeColor || 'black';
						showContext.moveTo(stroke.data[0].x*canvas.width, stroke.data[0].y*canvas.height);
						let i,len;
						for (i = 1, len = stroke.data.length; i < len - 2; i++) {
							let c = (stroke.data[i].x*canvas.width + stroke.data[i + 1].x*canvas.width) / 2;
							let d = (stroke.data[i].y*canvas.height + stroke.data[i + 1].y*canvas.height) / 2;
							showContext.quadraticCurveTo(stroke.data[i].x*canvas.width, stroke.data[i].y*canvas.height, c, d);
						}
						showContext.quadraticCurveTo(
							stroke.data[i].x*canvas.width,
							stroke.data[i].y*canvas.height,
							stroke.data[i + 1].x*canvas.width,
							stroke.data[i + 1].y*canvas.height
						);
						showContext.stroke();
						showContext.closePath();
					});
				}
				
				function pushAllStroke(data){
					strokeList = data;
					reDrawStroke();
				}
				function drawComplete(){
					context.clearRect(0, 0, canvas.width, canvas.height);
					strokeList.push({
						id:drawingStroke.id,
						strokeColor:drawingStroke.strokeColor,
						rect:Object.assign({},drawingStroke.rect),
						data:drawingStroke.data.slice(0)
					});
					drawLine(false,undefined,showContext);
				}
				 
				function setDataVerificationTimer() {
					if(dataVerificationTimer){
						clearInterval(dataVerificationTimer);
					}
					dataVerificationTimer = setInterval(()=>{
						if(!isSendDataRightNow){
							isSendDataRightNow = true;
							return;
						}
						console.log('发送同步数据。。。。。。。');
						socket&&socket.send(JSON.stringify({
							type: SEND_DATA_TYPE.DATA_VERIFICATION,
							strokeIds:strokeList.reduce((pre,next)=>{pre.push(next.id);return pre},[]),
							imgId:questionImgDom.attr('id')
						}));
					},5000);
				}
				function checkStrokeDataSynchronization(getStrokeIds) {
					let pushData = [];
					strokeList.forEach((stroke)=>{
						let index = getStrokeIds.findIndex((item)=>{return item == stroke.id});
						if(index != -1){
							getStrokeIds.splice(index,1);
						}else {
							pushData.push(stroke);
						}
					});

					if(getStrokeIds.length || pushData.length){
						console.log(`send:===========> check stroke`);
						console.log(`type${SEND_DATA_TYPE.DATA_VERIFICATION}`);
						console.log(`pushData${pushData}`);
						console.log(`pullIds${getStrokeIds}`);
						console.log(`send:===========`);
						socket.send(JSON.stringify({
							type: SEND_DATA_TYPE.DATA_VERIFICATION,
							pushData:pushData,
							pullIds:getStrokeIds
						}));
					}
				}
				function checkImgDataSynchronization(getImgId) {
					let id = questionImgDom.attr('id'),
						data = {type: SEND_DATA_TYPE.DATA_VERIFICATION};
					if(getImgId != id){
						if(+id > +getImgId){
							let originalWidth = questionImgDom.get(0).width,
								originalHeight = questionImgDom.get(0).height,
								heightRate = (originalHeight * canvas.width / originalWidth)/canvas.height;
							
							data.imgData = questionImgDom.attr('src');
							data.heightRate = heightRate;
						}else {
							data.imgId = id;
						}
						socket.send(JSON.stringify(data));
					}
				}
			}
		};
	}]);