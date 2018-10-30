/**
 * Created by ww on 2017/12/13.
 */
import {Inject, View, Directive, select} from './../../module';

@View('micro_lecture_video_page', {
    url: '/micro_lecture_video_page/:tagId/:isUnitStepOneRight',
    cache:false,
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope'
        , '$rootScope'
        , '$state'
        , '$stateParams'
        , '$ngRedux'
        , 'commonService'
        , 'microlectureService'
    ]
})

class MicroLectureVideoPageCtrl {
    $ngRedux;
    $stateParams;
    commonService;
    microlectureService;
    initCtrl = false;
    dataLoading = false;
    isMobile = !this.commonService.isPC();
    isUnitStepOneRight = this.$stateParams.isUnitStepOneRight;
    video = {
        showKeyboard:false,
        showOption:false,
        videoSrcPath:'http://www.xuexihappy.com/static/video/weike/1.mp4',
        text:'应用题（2）例1',
        questionArr: [
                {
                    startTime:40,
                    type:1,
                    answer:0,
                    option:["A","B","C"],
                    backTime:19,
                    hansAnswered:false,
                    answerRight:false,
                    reAnswerCount:0,
                },
                {
                    startTime:49,
                    type:2,
                    answer:8,
                    backTime:19,
                    hansAnswered:false,
                    answerRight:false,
                    reAnswerCount:0,
                }
        ],
        pauseArr:[
            {
                startTime:10,
                paused:false,
                type:1
            }
        ]
    };
/*
    //questionType:1=>选择; 2=>填空
    //pauseType:1=>开场白; 2=>读题暂停; 3=>讲解暂停
    defaultOptionArr = {
        question:[
            {
                "startTime": 40,
                "type": 1,
                "answer": 0,
                "option": [
                    "A",
                    "B",
                    "C"
                ],
                "backTime": 19
            },
            {
                "startTime": 49,
                "type": 2,
                "answer": 8,
                "backTime": 19
            },
            {
                "startTime": 72,
                "type": 1,
                "answer": 2,
                "option": [
                    "A",
                    "B",
                    "C"
                ],
                "backTime": 51
            },
            {
                "startTime": 88,
                "type": 2,
                "answer": 40,
                "backTime": 51
            }
        ],
        pause:[
            {
                startTime:5,
                paused:false,
                type:1
            },
            {
                startTime:20,
                paused:false,
                type:2
            }
        ]
    };

*/
    landscapeListener;

    @select(state=>state.profile_user_auth.user.name) userName;
    constructor(){
        this.getScope().$on('videoCanPlay',()=>{
            this.isVideoCanPlay = true;
        })
    }

    configDataPipe() {
        this.dataPipe
            .when(()=>!this.initCtrl&&!this.dataLoading)
            .then(()=> {
                this.dataLoading = true;
                this.microlectureService.getVideoConfigData({
                    tag:this.$stateParams.tagId,
                    type:'vedio'
                }).then((res)=>{
                    if(res){
                        try{
                            this.video.videoSrcPath = res.solution;
                            this.video.text = res.vedioName;

                            let config = JSON.parse(res.config);
                            this.video.questionArr = config.question;
                            this.video.pauseArr = config.pause;

                            this.video.questionArr.forEach((question)=>{
                                question.hansAnswered = false;
                                question.answerRight = false;
                                question.reAnswerCount = 0;
                            });
                            this.video.pauseArr.forEach((pause)=>{
                                pause.paused = false;
                            });
                        }catch (error){
                            this.commonService.alertDialog('视频配置错误',3000);
                            this.back(true);
                            return;
                        }
                    }else {
                        this.commonService.alertDialog('请检查您的网络',3000);
                        this.back(true);
                        return;
                    }

                    this.initCtrl = true;
                    this.dataLoading = false;
                });
            })
    }

    onAfterEnterView(){
        this.landscapeListener = ()=> {
            let clientWidth = document.documentElement.clientWidth;
            let clientHeight =  document.documentElement.clientHeight;
            let width = clientWidth > clientHeight ? clientWidth : clientHeight;
            let height = clientWidth < clientHeight ? clientWidth : clientHeight;
            let $bodyDom =  $('body');
            let angle = 0;
            try{
                if('orientation' in window){
                    angle = window.orientation;
                }else if('orientation' in screen){
                    if(typeof screen.orientation == "string"){
                        angle = screen.orientation.indexOf('landscape')!=-1?90:0;
                    }else if(typeof screen.orientation == "object"){
                        angle = screen.orientation.angle;
                    }
                }
            }catch (e){}
            if (angle%180 === 0) {
                $bodyDom.width(width);
                $bodyDom.height(height);
                $bodyDom.css('left',  height+'px');
                $bodyDom.css('transform' , 'rotate(90deg)');
                $bodyDom.css('-webkit-transform' , 'rotate(90deg)');
                $bodyDom.css('-webkit-transform-origin' , '0 0');
                $bodyDom.css('transform-origin' , '0 0');
                $bodyDom.css('position' , 'relative');
            }else {
                $bodyDom.css({
                    'width':'initial',
                    'height':'initial',
                    'transform':'initial',
                    '-webkit-transform':'initial',
                    'transform-origin':'initial',
                    '-webkit-transform-origin':'initial',
                    'left':'initial',
                    'position':'initial',
                })
            }
        };
        if(this.isMobile){
            this.landscapeListener();
            window.addEventListener("orientationchange",this.landscapeListener, false);
        }
    }

    onBeforeLeaveView() {
        if(this.isMobile){
            window.removeEventListener("orientationchange",this.landscapeListener,false);
            let $bodyDom =  $('body');
            $bodyDom.css({
                'width':'initial',
                'height':'initial',
                'transform':'initial',
                '-webkit-transform':'initial',
                'transform-origin':'initial',
                '-webkit-transform-origin':'initial',
                'left':'initial',
                'position':'initial',
            })
        }
    }

    back(isEnd) {
        //播放结束后点击返回|直接返回
        if(isEnd){
            this.go('micro_example_detail');
        }
        else {
            this.getScope().$broadcast('alert_back_popup');
        }
    }

    showVideoPopup(){
        this.isShowBackPopup = true;
    }
    hideVideoPopup(){
        this.isShowBackPopup = false;
    }



    /**
     * 视频交互完成，保存本次学习正确交互的个数
     * @param rightNum
     */
    interactionOverCallback(rightNum){
        //保存交互正确数
        this.microlectureService.saveInteractionInfo({
            questionGroupId:this.$stateParams.tagId,
            passProgress:rightNum,
            totalProgress:this.video.questionArr.length
        }).then((res)=>{
            if(!res){
                this.commonService.alertDialog('微课学习情况保存失败~');
            }
        });
    }

}
export default MicroLectureVideoPageCtrl;