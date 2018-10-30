/**
 * Created by ww on 2017/12/19.
 */
import './style.less';
import _find from 'lodash.find';
import CanvasVideoPlayer from 'canvas-video-player';
import teacherRightAgain from "./../../../images/video/teacher_right_again.mp4";
import videoEnded from "./../../../images/video/teacher_end.mp4";
import './../../../images/video/teacher_poster.jpg';
export default function () {
    return {
        restrict: 'AE',
        scope: {
            videoConfig: '=',
            isUnitStepOneRight: '@',
            stateBack: '&',
            showVideoPopup: '&',
            interactionOverCallback: '&',
        },
        template: require('./page.html'),
        controller: ['$scope', '$rootScope', '$timeout', 'olympicMathMicrolectureFinalData', 'commonService', '$sce', ($scope, $rootScope, $timeout, olympicMathMicrolectureFinalData, commonService, $sce) => {
            $scope.$timeout = $timeout;
            $scope.isAndroid = commonService.isAndroid() || commonService.isPC();
            $scope.finalData = olympicMathMicrolectureFinalData;
            $scope.isShowMenuBar = true; //显示视频菜单栏flag
            // $scope.videoTotalTime = ''; //视频总时长
            // $scope.videoCurrentTime = ''; //视频播放的当前时间
            $scope.showMenuBarTimer = undefined; //视频菜单栏显示定时器
            // $scope.showAnsProcessBar = false; //显示做题正确时的问题正确条flag
            $scope.ansResultArr = []; //交互问题集合
            $scope.showRightAnimation = false; //显示做题正确的动画flag
            $scope.showWrongAnimation = false; //显示做题错误的动画flag
            $scope.showWrongConfirm = false; //显示做题错误弹出框flag
            $scope.showKeyboard = false; //显示做题键盘flag
            $scope.showOption = false; //显示做题选项flag
            $scope.showEndedConfirm = false; //显示视频播放完成提示框flag
            $scope.showContinueBtn = false; //视频暂停后显示的继续播放按钮flag
            $scope.isVideoPlay = false;
            $scope.teacherVideoEndedPlayTeachVideo = true; //教师视频播放完成后接着播放教学视频flag
            $scope.currentNeedAnsQuestion = $scope.videoConfig&&$scope.videoConfig.questionArr[0]; //当前需要回答的问题

            $scope.wrongVideo = [
                "video/teacher_wrong0.mp4"
                ,"video/teacher_wrong1.mp4"
                ,"video/teacher_wrong2.mp4"
                ,"video/teacher_wrong3.mp4"
                ,"video/teacher_wrong4.mp4"
                ,"video/teacher_wrong5.mp4"
                ,"video/teacher_wrong6.mp4"
            ]; //答错视频播放集
            $scope.rightVideo = [
                "video/teacher_right0.mp4"
                ,"video/teacher_right1.mp4"
                ,"video/teacher_right2.mp4"
                ,"video/teacher_right3.mp4"
                ,"video/teacher_right4.mp4"
                ,"video/teacher_right5.mp4"
                ,"video/teacher_right6.mp4"
                ,"video/teacher_right7.mp4"
                ,"video/teacher_right8.mp4"
            ]; //答对视频播放集
            $scope.continuousCorrect = 0; //连续正确数，达到两个就播放又答对的动画，然后清零

            //随机排序正确错误视频，然后依次循环播放
            let arrayShuffle = (arr)=>{
                for(let i = arr.length-1; i>=0; i--){
                    let randomIndex = Math.floor(Math.random()*(i+1));
                    let itemArrIndex = arr[randomIndex];
                    arr[randomIndex] = arr[i];
                    arr[i] = itemArrIndex;
                }
            };
            arrayShuffle($scope.wrongVideo);
            arrayShuffle($scope.rightVideo);
            $scope.wrongVideoPlayIndex = 0;
            $scope.rightVideoPlayIndex = 0;

            //根据视频交互问题数，获取做题正确时的问题正确条格数集合，作对一道题，显示一个正确格子
            for (let i = 0, len = $scope.videoConfig.questionArr.length; i < len; i++) {
                $scope.ansResultArr.push({ansRight: false})
            }


            $scope.playTeacherVideo = function () {
                $scope.$teacherCanvasVideo.show();
                $scope.$teacherCanvasVideo.play();
            };
            /**
             * 点击视频回调
             * @param $event
             */
            $scope.handleClick = ($event) => {
                // console.log('...........click video ele..........');
                $event.stopPropagation();
                if ($scope.videoEle.ended)return; //视频播放结束，不处理

                if ($scope.showMenuBarTimer) {
                    $timeout.cancel($scope.showMenuBarTimer)
                }
                $scope.isShowMenuBar = !$scope.isShowMenuBar;

                if ($scope.isShowMenuBar) {
                    $scope.showMenuBarTimer = $timeout(()=> {
                        $timeout.cancel($scope.showMenuBarTimer);
                        $scope.showMenuBarTimer = undefined;
                        $scope.isShowMenuBar = false;
                    }, 3000)
                }
            };

            /**
             * 格式化时间秒数
             * @param num
             * @returns {string}
             */
            $scope.formatSecondStr = (num)=> {
                let minute = Math.floor(num / 60),
                    second = num % 60;

                if (minute < 10)minute = `0${minute}`;
                if (second < 10)second = `0${second}`;
                return `${minute}：${second}`;
            };

            /**
             * 播放按钮点击处理
             * @param $event
             */
            $scope.playOrParseVideo = ($event)=> {
                $event.stopPropagation();

                if (!$scope.videoEle) {
                    return
                }

                //做题时不可以点击开始播放
                if ($scope.showKeyboard || $scope.showOption || !!$scope.showContinueBtn) {
                    return
                }

                if ((!$scope.isAndroid && !$scope.$canvasVideo.playing) || ($scope.isAndroid && $scope.$canvasVideo.paused)) {
                    $scope.$canvasVideo.play();
                } else {
                    $scope.$canvasVideo.pause();
                }



                $scope.isShowMenuBar = true;
                if ($scope.showMenuBarTimer) {
                    $timeout.cancel($scope.showMenuBarTimer)
                }
                $scope.showMenuBarTimer = $timeout(()=> {
                    $timeout.cancel($scope.showMenuBarTimer);
                    $scope.showMenuBarTimer = undefined;
                    $scope.isShowMenuBar = false;
                }, 3000)
            };

            /**
             * 键盘答案输入提交，选项提交回调
             */
            $scope.confirmQuestionAns = (answer)=> {
                let nextQuestion;
                //选择题答题完成处理,隐藏选项
                if (answer.type === $scope.finalData.ML_TYPE.SELECT) {
                    $scope.showOption = false;
                }
                //填空答题完成处理,隐藏键盘
                else if (answer.type === $scope.finalData.ML_TYPE.FILLBLANK) {
                    $scope.showKeyboard = false;
                }

                //正确显示正确动画
                $scope.isAnswerCorrect = +answer.value === $scope.currentNeedAnsQuestion.answer;
                if ($scope.isAnswerCorrect) {
                    $scope.currentNeedAnsQuestion.answerRight = true;
                    $scope.currentNeedAnsQuestion.hansAnswered = true;

                    //播放答题正确的老师视频
                    $scope.teacherVideoEndedPlayTeachVideo = true;
                    if($scope.currentNeedAnsQuestion.reAnswerCount == 1){
                        $scope.continuousCorrect++;
                    }
                    //首次连续答对
                    if($scope.continuousCorrect == 2){
                        $scope.$teacherCanvasVideo.video.children[0].src = teacherRightAgain;
                        $scope.continuousCorrect = 0;
                    }else {
                        $scope.$teacherCanvasVideo.video.children[0].src = $scope.videoUrl($rootScope.loadMicrolectureImg($scope.rightVideo[$scope.rightVideoPlayIndex]));
                        if ($scope.rightVideoPlayIndex < $scope.rightVideo.length-1) {
                            $scope.rightVideoPlayIndex++;
                        } else {
                            $scope.rightVideoPlayIndex = 0;
                        }
                    }
                    if(!$scope.isAndroid)$scope.$teacherCanvasVideo.audio.innerHTML = $scope.$teacherCanvasVideo.video.innerHTML;
                    $scope.$teacherCanvasVideo.video.onloadeddata= ()=>{
                        $scope.isShowMenuBar = false;
                        if($scope.showMenuBarTimer){
                            $scope.$timeout.cancel($scope.showMenuBarTimer);
                            $scope.showMenuBarTimer = undefined;
                        }
                        if($scope.isAndroid)$scope.$iframe.css('display','block');
                        $scope.$teacherCanvasVideo.ctx.clearRect(0,0,$scope.$teacherCanvasVideo.width, $scope.$teacherCanvasVideo.height);
                        $scope.$teacherCanvasVideo.video.currentTime = 0;
                        $scope.$teacherCanvasVideo.play();
                        $scope.$teacherCanvasVideo.video.onloadeddata = null;
                        $($scope.$teacherCanvasVideo.canvas).css('opacity','1');
                    };
                    $scope.$teacherCanvasVideo.video.load();
                    if(!$scope.isAndroid)$scope.$teacherCanvasVideo.audio.load();

                    nextQuestion = $scope.getCurrentNeedAnsQuestion();

                    //做题正确时的问题正确条点亮一格显示
                    let nextLight = _find($scope.ansResultArr, {ansRight: false}); //下一个需要点亮的进度格子
                    if (nextLight)nextLight.ansRight = true;
                    $scope.currentNeedAnsQuestion = nextQuestion;

                    //所有问题都答对之后保存视频学习情况
                    if (!$scope.currentNeedAnsQuestion) {
                        $scope.interactionOverCallback({
                            rightNum: $scope.getAllRightInteractionNums()
                        })
                    }
                }
                //错误显示错误动画
                else {
                    //播放答题错误的老师视频
                    $scope.teacherVideoEndedPlayTeachVideo = false;
                    $scope.$teacherCanvasVideo.video.children[0].src = $scope.videoUrl($rootScope.loadMicrolectureImg($scope.wrongVideo[$scope.wrongVideoPlayIndex]));
                    if ($scope.wrongVideoPlayIndex < $scope.wrongVideo.length-1) {
                        $scope.wrongVideoPlayIndex++;
                    } else {
                        $scope.wrongVideoPlayIndex = 0;
                    }

                    if(!$scope.isAndroid)$scope.$teacherCanvasVideo.audio.innerHTML = $scope.$teacherCanvasVideo.video.innerHTML;
                    $scope.$teacherCanvasVideo.video.onloadeddata = ()=>{
                        $scope.isShowMenuBar = false;
                        if($scope.showMenuBarTimer){
                            $scope.$timeout.cancel($scope.showMenuBarTimer);
                            $scope.showMenuBarTimer = undefined;
                        }
                        if($scope.isAndroid)$scope.$iframe.css('display','block');
                        $scope.$teacherCanvasVideo.ctx.clearRect(0,0,$scope.$teacherCanvasVideo.width, $scope.$teacherCanvasVideo.height);
                        $scope.$teacherCanvasVideo.video.currentTime = 0;
                        $scope.$teacherCanvasVideo.play();
                        $scope.$teacherCanvasVideo.video.onloadeddata = null;
                        $($scope.$teacherCanvasVideo.canvas).css('opacity','1');
                    };
                    $scope.$teacherCanvasVideo.video.load();
                    if(!$scope.isAndroid)$scope.$teacherCanvasVideo.audio.load();

                    // let wrongAnimationTimer = $timeout(()=> {
                    //     $timeout.cancel(wrongAnimationTimer);
                    //     $scope.showWrongConfirm = true;
                        // $scope.showWrongAnimation = false;
                        // $($scope.$teacherCanvasVideo.canvas).css('opacity','0');

                    // }, 4500);
                }
            };

            /**
             * 题目做错弹出框点击再看一次回调
             */
            $scope.handleBackBtn = ($event)=> {
                $event.stopPropagation();
                $timeout(()=> {
                    $scope.videoEle.currentTime = $scope.currentNeedAnsQuestion.backTime;
                    $scope.showWrongConfirm = false;

                    $scope.$canvasVideo.play();

                }, 100);
            };
            /**
             * 题目做错弹出框点击重新做回调
             */

            /**
             * 当前回答的问题结束，获取下次交互所在集合的下标，交互准备回答的下一个问题（每次交互可能有多个问题）
             * @returns needAnsQuestion: undefined undefined表示已经没有问题要回答了
             */
            $scope.getCurrentNeedAnsQuestion = ()=> {
                let needAnsQuestion = undefined;
                let result = _find($scope.videoConfig.questionArr, {hansAnswered: false});
                if (result) {
                    needAnsQuestion = result;
                }
                return needAnsQuestion
            };

            /**
             * 获取所有交互中的问题全部正确的交互数量
             * @returns {number}
             */
            $scope.getAllRightInteractionNums = ()=> {
                let rightNum = 0;
                $scope.ansResultArr.forEach((item)=> {
                    if (item.ansRight)rightNum++;
                });
                return rightNum;
            };

            $scope.continuePlayVideo = ($event)=>{
                $event.stopPropagation();
                $event.preventDefault();
                $scope.showContinueBtn = false;
                $scope.$canvasVideo.play();
            };

            /**
             * 信任视频url
             * @param url
             * @returns {*}
             */
            $scope.videoUrl = (url)=> {
                return $sce.trustAsResourceUrl(url);
            };

            $scope.getBtnImg = ()=> {
                let btnImg = 'video/m_menu_bar_play_btn.png';
                //ios显示暂停按钮
                if ($scope.$canvasVideo &&
                    ((!$scope.isAndroid&&$scope.$canvasVideo.playing)||($scope.isAndroid&&!$scope.$canvasVideo.paused))) {
                    btnImg = 'video/m_menu_bar_parse_btn.png';
                }

                return $rootScope.loadMicrolectureImg(btnImg);
            };

            /**
             * 重新播放
             */
            $scope.replayVideo = ()=> {
                $scope.videoEle.currentTime = 0;
                $scope.showEndedConfirm = false;

                //重置问题信息
                $scope.ansResultArr.forEach((item)=> {
                    item.ansRight = false;
                });
                $scope.videoConfig.questionArr.forEach((question)=> { //遍历每次交互中的所有问题
                    question.hansAnswered = false;
                    question.answerRight = false;
                    question.reAnswerCount = 0;
                });

                $scope.videoConfig.pauseArr.forEach((pause)=>{
                    pause.paused = false;
                });
                $scope.currentNeedAnsQuestion = $scope.videoConfig.questionArr[0];
                $scope.continuousCorrect = 0;
                $scope.$canvasVideo.play();

            };
            $scope.backUrl = ()=> {
                $scope.$teacherCanvasVideo.pause();
                $scope.$canvasVideo.pause();
                $scope.$teacherCanvasVideo.unbind();
                if(!$scope.isAndroid)$scope.$canvasVideo.unbind();
                $scope.stateBack({isEnd:true});
            };

            $scope.endedCallback = ()=> {
                //显示视频菜单栏
                $scope.isShowMenuBar = false;
                //隐藏所有的动画，弹窗，选项，键盘，
                $scope.showRightAnimation = false;
                $scope.showWrongAnimation = false;
                $scope.showWrongConfirm = false;
                $scope.showKeyboard = false;
                $scope.showOption = false;
                $scope.videoEle.currentTime = $scope.videoEle.duration - 1;
                $scope.$canvasVideo.pause();


                //视频讲解完毕，播放教师结束视频，再弹出结束框
                $scope.isVideoEnded = true;
                $scope.teacherVideoEndedPlayTeachVideo = false;
                $scope.$teacherCanvasVideo.video.children[0].src = videoEnded;
                if(!$scope.isAndroid)$scope.$teacherCanvasVideo.audio.innerHTML = $scope.$teacherCanvasVideo.video.innerHTML;
                $scope.$teacherCanvasVideo.video.onloadeddata = ()=>{
                    $scope.isShowMenuBar = false;
                    if($scope.showMenuBarTimer){
                        $scope.$timeout.cancel($scope.showMenuBarTimer);
                        $scope.showMenuBarTimer = undefined;
                    }
                    if($scope.isAndroid)$scope.$iframe.css('display','block');
                    $scope.$teacherCanvasVideo.ctx.clearRect(0,0,$scope.$teacherCanvasVideo.width, $scope.$teacherCanvasVideo.height);
                    $scope.$teacherCanvasVideo.video.currentTime = 0;
                    $scope.$teacherCanvasVideo.play();
                    $scope.$teacherCanvasVideo.video.onloadeddata = null;
                    $($scope.$teacherCanvasVideo.canvas).css('opacity','1');
    
                };
                $scope.$teacherCanvasVideo.video.load();
                if(!$scope.isAndroid)$scope.$teacherCanvasVideo.audio.load();

            };
            $scope.teacherVideoEndedCallBack = ()=>{
                $timeout(()=>{
                    $($scope.$teacherCanvasVideo.canvas).css('opacity','0');
                    $scope.$teacherCanvasVideo.pause();
                    if($scope.isAndroid)$scope.$iframe.css('display','none');
                    if($scope.teacherVideoEndedPlayTeachVideo){
                        $scope.$canvasVideo.play();
                    }
                    if(!$scope.teacherVideoEndedPlayTeachVideo && !$scope.isAnswerCorrect){
                        $scope.$apply(()=>{$scope.showWrongConfirm = true;});
                    }

                    if($scope.isVideoEnded){
                        $scope.$apply(()=>{
                            $scope.showEndedConfirm = true;
                        });
                        $scope.isVideoEnded = false;
                    }
                },300);
            };
            $scope.alertBackPopup = ()=>{
                $scope.$canvasVideo.pause();
                $($scope.$teacherCanvasVideo.canvas).css('opacity','0');
                $scope.$teacherCanvasVideo.pause();
                if($scope.isAndroid)$scope.$iframe.css('display','none');
                $scope.showVideoPopup();
            };
            $scope.$on('alert_back_popup',()=>{
                $scope.$canvasVideo.pause();
                $($scope.$teacherCanvasVideo.canvas).css('opacity','0');
                $scope.$teacherCanvasVideo.pause();
                if($scope.isAndroid)$scope.$iframe.css('display','none');
                $scope.$apply(()=>{
                    $scope.showVideoPopup();
                })
            });
        }],
        link: function ($scope, $elem, $attrs) {
            let $videoEle = $elem.find(".teach-video"),
                $videoCanvasEle = $elem.find(".teach-canvas"),
                $playBtn = $elem.find('.parse-play-btn');

            if($scope.isAndroid){
                $elem.append(`<iframe id="teacherVideoIframe" style="display:none;position: absolute;width: 100%;height: 100%;z-index: 100"
                        frameborder="0"></iframe>`
                );
                $(document.getElementById('teacherVideoIframe').contentWindow.document.body).append(
                    `
                    <video crossOrigin="anonymous" class="video js-video teacher-video" poster="./images/teacher_poster.jpg"
                           style="display:block;position: absolute;z-index: 200;width: 1px;height:1px" preload="metadata">
                        <source src="" type="video/mp4">
                    </video>
                    <div class="teacher-canvas-box" style="position: absolute;z-index: 90;bottom: 0;left: 0;right: 0;
                    display:flex;display:-webkit-flex;justify-content: center;-webkit-justify-content: center; align-items: flex-end; -webkit-align-items: flex-end;">
                        <canvas class="canvas js-canvas video-item-page teacher-canvas"
                                style="opacity: 0"></canvas>
                    </div>
                `
                );
                $videoEle.css('display','block');
                $videoCanvasEle.css('display','none');
            }
            $scope.videoEle = $videoEle.get(0);

            //加载完成视频的元数据，获取总时长
            $videoEle.on('loadedmetadata', (event)=> {
                let videoEle = event.currentTarget;
                // console.log('===========loadedmetadata');
                $scope.$apply(()=> {
                    $scope.videoTotalTime = $scope.formatSecondStr(Math.floor(videoEle.duration));
                    $scope.videoCurrentTime = $scope.formatSecondStr(Math.floor(videoEle.currentTime));
                });
                if (!$scope.$canvasVideo) {
                    if(!$scope.isAndroid)$scope.$canvasVideo = new CanvasVideoPlayer({
                        videoSelector: $videoEle[0],
                        canvasSelector: $videoCanvasEle[0],
                        autoplay: false,
                        audio: true,
                        resetOnLastFrame: false,
                        loop: false,
                        videoEndedCallback: $scope.endedCallback.bind($scope),

                    });
                    else $scope.$canvasVideo = $scope.videoEle;
                }
                if(!$scope.$teacherCanvasVideo){
                    let tvDom,tcDom;
                    if($scope.isAndroid){
                        let $iframe = $scope.$iframe = $(document.getElementById('teacherVideoIframe'));
                        let $iframeDom = $($iframe[0].contentWindow.document);
                        tvDom = $iframeDom.find('.teacher-video')[0];
                        tcDom = $iframeDom.find('.teacher-canvas')[0];
                    }else {
                        tvDom = $elem.find('.teacher-video')[0];
                        tcDom = $elem.find('.teacher-canvas')[0];
                    }

                    $scope.$teacherCanvasVideo = new CanvasVideoPlayer({
                        videoSelector: tvDom,
                        canvasSelector: tcDom,
                        autoplay: false,
                        audio: !$scope.isAndroid,
                        resetOnLastFrame: false,
                        loop: false,
                        isAndroidTeacherVideo:$scope.isAndroid,
                        videoEndedCallback: $scope.teacherVideoEndedCallBack.bind($scope)
                    });
                }
            });

            let canplayCallback = ()=>{
                console.log('video===========canplay');
                $playBtn.trigger('click');
                if($scope.isAndroid){
                    let timeupdateCallback = ()=>{
                    	if($scope.videoEle.currentTime>0.1){
							let timer = $scope.$timeout(()=>{
								$scope.$emit('videoCanPlay');
                                console.log('emit===========videoCanPlay');
                                $scope.$timeout.cancel(timer);
							},0);
							$videoEle.off("timeupdate", timeupdateCallback);
						}
                    };
                    let playingCallback = ()=>{
                        $videoEle.off("playing",playingCallback);
                        $videoEle.on("timeupdate", timeupdateCallback);
                    };

                    $videoEle.on("playing", playingCallback);
                }else {
                    let timer = $scope.$timeout(()=>{
                        $scope.$emit('videoCanPlay');
                        console.log('emit===========videoCanPlay');
                        $scope.$timeout.cancel(timer);
                    },0);
                }
                $videoEle.off('canplay',canplayCallback);
            };
            $videoEle.on("canplay", canplayCallback);


            //监听视频播放中：1.处理开始交互问题
            $videoEle.on('timeupdate', (event)=> {
                let videoEle = event.currentTarget;
                    //若当前播放时间是当前需要回答问题的时间点，暂停视频
                    // console.log(`videoEle.currentTime:${videoEle.currentTime}----startTime:${$scope.currentNeedAnsQuestion.startTime}`);
                    if ($scope.currentNeedAnsQuestion && videoEle.currentTime >= $scope.currentNeedAnsQuestion.startTime) {
                        $scope.$canvasVideo.pause();

                        $scope.$apply(()=> {
                            $scope.isVideoPlay = false;
                            //选择题显示选项
                            if ($scope.currentNeedAnsQuestion.type === $scope.finalData.ML_TYPE.SELECT) {
                                if(!$scope.showOption){
                                    $scope.showOption = true;
                                    $scope.currentNeedAnsQuestion.reAnswerCount++;
                                }
                            }
                            //填空题显示键盘
                            if ($scope.currentNeedAnsQuestion.type === $scope.finalData.ML_TYPE.FILLBLANK) {
                                if(!$scope.showKeyboard){
                                    $scope.showKeyboard = true;
                                    $scope.currentNeedAnsQuestion.reAnswerCount++;
                                }
                            }
                        });
                        // console.log('================',$scope.currentNeedAnsQuestion.reAnswerCount);
                        return;
                    }

                    //若当前播放时间是当前需要暂停的时间点，暂停视频
                    let currentTime = videoEle.currentTime;
                    let nextPause = _find($scope.videoConfig.pauseArr,{paused:false});
                    if(nextPause && currentTime>nextPause.startTime){
                        $scope.$canvasVideo.pause();
                        //老师独白
                        if(nextPause.type === 1){
                            $scope.teacherVideoEndedPlayTeachVideo = true;
                            $scope.$teacherCanvasVideo.video.children[0].src = $scope.$root.loadMicrolectureImg('video/teacher_prologue.mp4');
                            if(!$scope.isAndroid)$scope.$teacherCanvasVideo.audio.innerHTML = $scope.$teacherCanvasVideo.video.innerHTML;
                            $scope.$teacherCanvasVideo.video.onloadeddata = ()=>{
                                $scope.isShowMenuBar = false;
                                if($scope.showMenuBarTimer){
                                    $scope.$timeout.cancel($scope.showMenuBarTimer);
                                    $scope.showMenuBarTimer = undefined;
                                }
                                if($scope.isAndroid)$scope.$iframe.css('display','block');
                                $scope.$teacherCanvasVideo.ctx.clearRect(0,0,$scope.$teacherCanvasVideo.width, $scope.$teacherCanvasVideo.height);
                                $scope.$teacherCanvasVideo.video.currentTime = 0;
                                $scope.$teacherCanvasVideo.play();
                                $scope.$teacherCanvasVideo.video.onloadeddata = null;
                                $($scope.$teacherCanvasVideo.canvas).css('opacity','1');
    
                            };
                            $scope.$teacherCanvasVideo.video.load();
                            if(!$scope.isAndroid)$scope.$teacherCanvasVideo.audio.load();
    
                            $scope.$apply(()=> {
                                $scope.isVideoPlay = false;
                            });
                        }else {
                            $scope.$apply(()=> {
                                $scope.isVideoPlay = false;
                                $scope.showContinueBtn = nextPause.type;
                            });
                        }
                        nextPause.paused = true;
                    }
            });
            //缓冲加载显示loading
            $videoEle.on('waiting', (event)=> {
                console.log('video ===============waiting');
                if($scope.isAndroid){
                    $scope.$apply(()=> {
                        $scope.showLoading = true;
                        $scope.isVideoPlay = false;
                    });
                    
                }else {
                    $scope.showLoading = true;
                    $scope.isVideoPlay = false;
                }
            });
            
            if($scope.isAndroid){
                $videoEle.on('pause', (event)=> {
                    console.log('video ===============pause');
                    $scope.$apply(()=> {
                        $scope.isVideoPlay = false;
                    });
                    
                });
    
                //ios播放时不触发该事件
                $videoEle.on('playing', (event)=> {
                    console.log('video ===============playing');
                        $scope.$apply(()=> {
                            $scope.isVideoPlay = true;
                            $scope.showLoading = false;
                        });
                });
            }else {
                $($scope.videoEle).on('pause', (event)=> {
                    console.log('video ===============pause');
                    $scope.isVideoPlay = false;
                });
    
                //ios播放时不触发该事件
                $($scope.videoEle).on('playing', (event)=> {
                    console.log('video ===============playing');
                    $scope.isVideoPlay = true;
                    $scope.showLoading = false;
                });
            }
            
            

            //视频播放完成，显示菜单栏，便于退出
            $videoEle.on('ended', ()=> {
                $scope.$apply($scope.endedCallback);
            });

            $scope.$on('pauseMicroLectureVideo',()=>{
                $scope.$canvasVideo.pause();
                $($scope.$teacherCanvasVideo.canvas).css('opacity','0');
                $scope.$teacherCanvasVideo.pause();
                if($scope.isAndroid)$scope.$iframe.css('display','none');
            });

            $scope.$on('$destroy',()=>{
                $scope.$teacherCanvasVideo.pause();
                $scope.$canvasVideo.pause();
                $scope.$teacherCanvasVideo.unbind();
                $videoEle.off();
                if(!$scope.isAndroid)$scope.$canvasVideo.unbind();
                // console.log('video-item  destroy')
            });
        }
    };
}