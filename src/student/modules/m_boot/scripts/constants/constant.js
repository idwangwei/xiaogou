/**
 * Created by 彭建伦 on 2015/7/13.
 */
import  constants from './index';
import  buildCfg from 'default';

var backend = buildCfg.backend + '/door' || '192.168.0.161:9090/door';
var img_server = buildCfg.img_server || '192.168.0.161';

//学生端接口列表，需要sharding的接口，请添加到常量needShardingUrlList列表中
var urlMap = {
    ON_LINE_WS: "ws://www.xuexihappy.com:18765",
    IMG_SERVER: img_server,
    REFER_ANS_IMG_SERVER: 'www.xuexihappy.com:92',
    CLZ_IP: "http://" + backend,//课堂网络ip
    CLZ_WEB_SOCKET: 'ws://' + backend + '/ws?role=C&type=exam',//课堂websocket
    CLOUD_IP: "http://" + backend,   //云端网络ip

    BASE: "door",//连接后端接口的标志字符串

    GET_SESSION_ID: '/vc/getSID',//获取session id
    CHECK_ISVALID_SESSION: '/checkIsValidOfSession',
    LOGIN: '/login/student',  //登录
    LOGOUT: '/student/logout', //退出
    GET_CLASSES: '/class/pGetStuClasses',//获取学生参加的班级
    GET_ALL_GRADES: '/teacher/getAllGradeClass',//获取所有年级
    GET_UNIT: '/qb/ptag/getTextbooks',//获取标签
    GET_VALIDATE_IMAGE: '/rc',//获取图片验证码
    VALIDATE_IMAGE_V_CODE: '/vc/validateImgVC',//验证图形验证码
    PAPER_LIST: '/qbu/api/student/paperList',//学生获取老师下发的作业
    GET_CLAZZ_STUDENT_LIST: '/class/listStudentByClassId',//获取教师的班级列表
    PAPER_GET: '/qbu/api/paper/get',//根据作业id获取作业
    OLYMPIC_MATH_PAPER_GET: '/qus/api/autoTraining/get',//根据作业id获取作业
    SCORE_POINT_LIST: 'json/scorePointList.json',//查询某个作业的作业明细
    POST_ANSWER: '/qbu/api/student/postAnswer',//学生保存试题
    OLYMPIC_MATH_POST_ANSWER: '/qus/api/autoTraining/postAnswer',//学生保存试题
    PAPER_SUBMIT: '/qbu/api/student/submit',//学生提交作业
    SUBMIT_PAPER_AND_ANS: '/qbu/api/student/postAnswerSubmit',//学生提交作业（包含提交答案）
    OLYMPIC_MATH_SUBMIT_PAPER_AND_ANS: '/qus/api/autoTraining/postAnswerSubmit',//学生提交作业（包含提交答案）
    GET_Q_BY_ID: '/qb/question/get', //根据试题id获取试题详细信息
    GET_Q_REFER_ANSWER: '/qb/paper/getQReferAnswer',//获取输入框答案
    GET_Q_REFER_ANSWER_FOR_BOOKMARK: '/qbu/api/bookMark/referenceAnswer',//获取输入框答案针对我的收藏
    DELETE_SELF_TRAIN_WORK: '/qus/api/autoTraining/remove',//删除自主训练的作业
    //GET_WORK_LIST:'json/workList.json', //作业列表
    GET_WORK_LIST: '/qbu/api/simpleStatics/paperHistory', //获取普通|口算作业列表
    GET_FINAL_ACCESS_WORK_LIST: '/competition/student/paperHistory', //获取期末测评作业列表
    GET_OLYMPIC_MATH_WORK_LIST: '/qus/api/autoTraining/paperHistory', //作业列表
    GET_PAPER_STATUS:'/qbu/api/paper/getStatus', //获取作业状态
    GET_OLYMPIC_MATH_PAPER_STATUS:'/qus/api/autoTraining/getStatus', //获取作业状态
    GET_FINAL_ACCESS_PAPER_STATUS:'/competition/paper/status', //获取期末测评作业状态
    GET_FINISH_VACATION_MESSAGE: "/qbu/api/schedule/newFinishVacationMessage",//获取暑假作业最新情况
    GET_CLAZZ_STUDY_STATISC: "/qbu/api/studyStatistics/student/classDetail",//根据班级id获取班级的学情
    GET_CLAZZ_STUDY_STATISC_NEW: "/qbu/api/studyStatistics/student/eachClassDetail",//根据班级id获取班级的学情
    GET_GAME_BY_ID: 'json/gameTaskDetail.json',//根据id获取游戏信息
    IS_REPLAY: '',//判断是否可以重玩,超级用户可以重玩

    POST_Q_FEEDBACK: '/um/feedback/question/save',  //提交试题报错
    POST_Q_FEEDBACK_REMOVE_Q: '/qbu/api/deliver/mvQuestion',  //提交试题报错--移除试题

    GET_Q_REFER_ANSWER_FOR_NEW: '/dqb/question/getQReferAnswer',//获取输入框答案针对新增小题
    GET_Q_REFER_ANSWER_SAVANT: '/qbu/api/paper/excellentAnswer',//获取学霸的解答
    GET_Q_REFER_ANSWER_SAVANT_SELF_TRAIN: '/qus/api/autoTraining/excellentAnswer',//获取学霸的解答

    GET_OLYMPIC_MATH_VIPS: '/vip/mathematicalOlympiadVipService',//获取奥数vip

    GET_ERROR_Q_RECORDS: '/qbu/api/paper/getQuestionList',//获取试题的错误记录。

    GET_GOODS_MENUS:'/vip/goodsMenus',//获取商品列表
    GET_GROUP_BUYING_GOODS_MENUS:'/vip/groupBuyingGoodsMenus',//获取团购商品列表
    GET_GROUP_BUYING_ORDER:"/vip/groupBuyingOrder",//团购下单
    GROUP_BUYING_ORDER:"/vip/groupBuyingOrderQuery",//团购订单查询
    XLY_BUYING_ORDER:"/vip/xlyOrderQuery",//训练营订单查询

    GET_TEXTBOOK_LIST: '/qb/ptag/getTextbooks',//获取所有教材列表
    GET_TEXTBOOK_LIST_V2: '/dqb/tag/getBooks_v2',//获取所有教材列表-新
    GET_TEXTBOOK_CHAPTER: '/qb/ptag/allSubTagNodes',//获取指定教材的章节和单元
    FETCH_HOME_DIAGNOSE:'/qbu/api/customization/grade/statistics',//获取主页的诊断信息。
    FETCH_UNIT_DIAGNOSE:'/qbu/api/customization/chapter/statistics',//获取单元的诊断信息。
    FETCH_CHAPTER_DIAGNOSE:'/qbu/api/customization/unit/statistics',//获取诊断的诊断信息。
    FETCH_QUESTION_NEW:'/qbu/api/customization/newDiagnoseQuestion',//获取单元下的试题免费。
    FETCH_QUESTION_NEW_VIP:'/qbu/api/vip/customization/newQuestion',//获取单元下的试题vip。
    FETCH_DIAGNOSE_Q_ERROR_RECORDS:'/qbu/api/customization/error/questionList',//获取试题的错误记录。
    FETCH_DIAGNOSE_REPORT:'/qbu/api/customization/knowledge/statistics',//获取知识点下的诊断报告。

    FETCH_UNIT_KNOWLEDGE_DIAGNOSE:'/qbu/api/customization/knowledge/statistics',//获取单元下的子知识点的诊断信息。
    FETCH_UNIT_Q_RECORDS:'/qbu/api/customization/historyQuestionList',//获取单元下的做题记录。
    FETCH_UNIT_Q_ERROR_RECORDS:'/qbu/api/customization/lastReworkQuestionDetail',//获取试题的错误记录。
    FETCH_UNIT_NEW_QUESTION:'/qbu/api/customization/newDiagnoseQuestion',//获取单元下的新试题。
    FETCH_UNIT_NEW_QUESTION_AUTHORITY :'/qbu/api/customization/newQuestion',//获取单元下的新试题(um需要拦截的地址)。
    FETCH_UNIT_ERROR_QUESTION:'/qbu/api/customization/lastReworkQuestion',//获取单元下的改错试题。
    UNIT_SUBMIT_Q:'/qbu/api/customization/postQuestionAnswer',//提交试题。



    GET_WORK_DATA: '/qbu/api/student/paperListAvailable',
    GET_GAME_DATA: '/game/rest/knowledge/canPlayGame', //获取游戏列表  //todo game_list已经独立出来 但是看见home_server还在用
    GET_ACHIEVEMENT: '/um/appraise/student/statistic', //获取成就
    GET_TROPHY_RANK: '/qbu/api/rankList/goldenCupList', //获取作业奖杯排行数据
    GET_APPRAISE_DATA_P: '/um/appraise/detail/parent',//家长端获取评价
    GET_APPRAISE_DATA_T: '/um/appraise/detail/teacher',//获取评价数据
    GET_APPRAISE_DATA:  '/um/appraise/detail/student',//获取评价数据
    WORK_DETAIL_Q_LIST: 'json/',
    S_CONFIRM_APPRAISE: '/um/appraise/saveOrUpdate/student',//学生保存评价
    GET_PLAY_GAME_MAP: 'json/playGameMap.json', //玩游戏前获取游戏参数配置
    POST_FEEDBACK:'/um/feedback/suggestion/save',  //提交问题反馈
    // GET_PLAY_GAME:'/game/rest/knowledge/getPlayGame',//获取玩游戏返回的游戏结算
    // IS_GAME_CAN_PLAY:'/game/rest/knowledge/isGameCanPlay',      //判断这个游戏是否被老师修改
    GET_STU_INFO:'/um/userInfo', //获取学生信息
    GET_USER_LIST_BY_PHONE:'/um/userBaseInfo', //通过手机号码获取相关账号
    GET_GAME_STAR_RANK:'/game/rest/statistics/starInClass',      //获取玩家在班级中的游戏星星排行
    GET_FIGHTER_RANK:'/RapidCalculation/statistics/classMedal',      //获取玩家在班级中的斗士排行
    GET_FEATURE_SWITCH:"/um/featureSwitch/get",//获取log开关

    WXPAY_ORDER_CREATE : "/vip/order", //微信支付创建订单
    WXPAY_ORDER_QUERY : "/vip/orderQuery", //微信支付查询订单
    ORDERFREEGOODS:"/vip/orderFreeGoods",//免费商品
    GET_ALL_VIPS_INFO:"/vip/getVip",//获取所有的vip信息


    STUDENT_RC_INFO: '/RapidCalculation/statistics/studentGradeInClass', //获取速算个人统计信息
    GET_RC_LEVELS_NAME: '/RapidCalculation/statistics/levelName',   //获取速算关卡信息

    GET_WORK_REAL_TIME_CAST: '/qbu/api/rankList/realTimeCast',//获取实时播报数据

    GET_GROWING_RECORD_LABEL:  '/lifeRecord/upload/allRecordLabel', //获取上传内容的标签
    GET_GROWING_RECORD_TYPE:  '/lifeRecord/upload/allRecordType', //获取上传内容的类型

    GET_GROWING_RECORD_STATUS:  '/lifeRecord/upload/allRecordStatus', //获取上传内容哪些人可见
    UPLOAD_GROWING_RECORD :  '/lifeRecord/upload/growUpRecord', //上传成长记录
    GROWING_GET_SELF_RECORDS :  '/lifeRecord/exhibition/selfRecord', //查看自己的历史发布
    DELETE_GROWING_RECORD :  '/lifeRecord/upload/delRecord', //删除自己分享的一些记录
    GET_GROWING_IMPEACH_TYPE :  '/lifeRecord/impeach/allImpeachType', //获取举报理由
    GROWING_SEND_FLOWER :  '/lifeRecord/flower/grant', //送花
    GROWING_CANCEL_SEND_FLOWER :  '/lifeRecord/flower/countermand', //取消送花
    GROWING_SEND_PRAISE :  '/lifeRecord/praise/grant', //点赞
    GROWING_CANCEL_SEND_PRAISE :  '/lifeRecord/praise/countermand', //点赞

    GROWING_GET_ALL_CLASSMATES_RECORDS :  '/lifeRecord/exhibition/allClassmates', //查看全班的发布
    GROWING_GET_ONE_CLASSMATE_RECORDS :  '/lifeRecord/exhibition/oneClassmate', //查看某一个指定同学的发布
    GROWING_GET_IMPEACH_REASON :  '/lifeRecord/impeach/allImpeachType', //举报理由
    GROWING_IMPEACH_CLASSMATE:  '/lifeRecord/impeach/grant', //举报
    GROWING_GET_CAN_PUBLISH_FLAG:  '/lifeRecord/exhibition/canpublish', //举报
    GROWING_GET_ALL_RECORDS:  '/lifeRecord/exhibition/recentClassmates', //获取朋友圈信息

    GET_WINTER_BROADCAST_DATA:"/ms/api/schedule/newFinishVacationMessage", //获取寒假作业的广播数据
    GET_TRAINING_PETS_MASTER: '/ms/api/customization/newMaster',

    GET_PAY_DETAIL:'/vip/orders',//获取支付明细
    GET_COMPETITION_PAPER_INFO: '/qbu/api/race/student/getCompetitionPaper', //获取竞赛试卷基本信息
    GET_REWARD_INFO:"/credits/user/base",//获取用户的积分信息

    LEVEL_NAME_LIST:'/credits/user/listTitle',//称号列表
    CHANGE_USER_HEAD:'/credits/user/update',//修改称号和用户头像
    WORK_REPORT_PAPER_ANALYSIS:'/qbu/api/paper/analysis',//作业报告的试卷分析
    GET_TRAINING_CAMP_INFO:'/vip/xlyBase', //获取学霸训练营数据
    GET_TRAINING_CAMP_REWARD:'/vip/xlyReward',//领取学霸训练营奖励
    GET_XLY_GOODS:'/vip/xlyGoods',//获取训练营商品列表

    YEAR_CARD_VERIFY_THE_INVITEES:'/vip/xlyIsJoined', //学霸驯宠记年卡验证邀请人账号
    WXPAY_XLY_ORDER_QUERY:"/vip/xlyOrderQuery", //查询训练营的支付订单结果
    FETCH_XLY_GOODS_INFO:"/vip/xlyGoods" , //获取训练营商品信息
    FETCH_XLY_VIP_GOODS_INFO:"/vip/comboGoods" , //获取训练营推广商品信息
    WXPAY_XLY_ORDER_CREATE:'/vip/xlyOrder', //创建训练营支付订单
    DIAGNOSE_RANKING_INFO:'/ms/api/trainPet/Champion',//获取驯宠争霸信息
    DIAGNOSE_CHAMPION_GET_CREDITS:'/ms/api/trainPet/userAddCredits',//霸主获取能量

    PET_GET_ALL_PET:'/pet/getAll',//获取所有的宠物和蛋
    PET_HATCH_PET:'/pet/createPet',//孵化一个宠物
    PET_BUY_FOOD:'/pet/buyFood',//能量兑换食物道具
    PET_FEED_PET:'/pet/feed',//喂养宠物
    PET_GET_GOODS:'/pet/knowledgeFood', //获取食物奖励
    GET_PET_SHARE_REWARD:'/pet/shareAward', //获取宠物分享成功奖励
    GET_TEACHER_MSG:'/um/nf/student/notify',//获取教师端发送的信息
    GET_LAST_TOP_FIVE:"/ms/api/trainPet/top", //获取前日和昨日的前五名
    OPEN_INCREASE_SCORE_KNOWLEDGE:'/vip/openResource', //使用考点特权打开指定知识点
    BARGAIN_CREATE:"/bargain/saveItem",//创建砍价的任务
    BARGAIN_GET_STATUS:"/bargain/status",//获取商品的砍价状态 决定进入到哪里
    BARGAIN_GET_DETAIL:"/bargain/invitor/getAll",//获取砍价的详情
    MONITOR_GET_INFO:"/um/trGroup/area/assessment/advertisement",//获取测评广告信息
    LIVE_GET_INFO:"/video/live/advertisement",//获取直播广告信息
};
constants.constant('serverInterface', urlMap);
/**
 *访问后台数据url接口地址(含json数据测试)
 */
constants.constant('mockInterface', {
    GET_CLASS_GAME_LIST: 'json/class_game.json'//获取课堂游戏列表
});
/**
 * 改卷页面中，圈选得分点的图片的路径配置
 */
constants.constant('circleImgPathMap', {
    CIRCLE_IMG_0: '../../bootImages/circle_img/circle_icon0.svg',
    CIRCLE_IMG_1: '../../bootImages/circle_img/circle_icon1.svg',
    CIRCLE_IMG_2: '../../bootImages/circle_img/circle_icon2.svg',
    CIRCLE_IMG_3: '../../bootImages/circle_img/circle_icon3.svg',
    CIRCLE_IMG_4: '../../bootImages/circle_img/circle_icon4.svg',
    CIRCLE_IMG_5: '../../bootImages/circle_img/circle_icon5.svg',
    CIRCLE_IMG_6: '../../bootImages/circle_img/circle_icon6.svg',
    CIRCLE_IMG_7: '../../bootImages/circle_img/circle_icon7.svg',
    CIRCLE_IMG_8: '../../bootImages/circle_img/circle_icon8.svg',
    CIRCLE_IMG_9: '../../bootImages/circle_img/circle_icon9.svg'
});
/**
 * css样式常量map
 */
constants.constant('cssMap', {
    /**
     * bg_color 背景颜色常量
     */
    BG_COLOR_LIGHT: "bg-light",
    BG_COLOR_STABLE: "bg-stable",
    BG_COLOR_POSITIVE: "bg-positive",
    BG_COLOR_CALM: "bg-calm",
    BG_COLOR_BALANCED: "bg-balanced",
    BG_COLOR_ENERGIZED: "bg-energized",
    BG_COLOR_ASSERTIVE: "bg-assertive",
    BG_COLOR_ROYAL: "bg-royal",
    BG_COLOR_DARK: "bg-dark",
    /**
     * bg_color_array 背景颜色数组常量
     */
    BG_COLOR_ARRAY: ["bg-positive", "bg-calm", "bg-balanced", "bg-energized", "bg-assertive", "bg-royal", "bg-dark"],
    /**
     * blok 块样式
     */
    PASS_BLOK: "pass-block"

});
/**
 * 数据常量
 */
constants.constant('finalData', {
    HTTPS_URL_REG: new RegExp("(login)|(register)|(um\/userBaseInfo)|(vip)"),//匹配需要加https请求的url
    HTTPS_EXCLUDE_161_REG: new RegExp("192.168.0.161"),//匹配需要排除加https请求的url
    CATEGORY:2, //类型默认家庭 1代表课堂
    ADORABLE_PET_TOTAL_COUNT:5,//萌宠总个数
    GAME_SHARDING_SPILT:'__',//游戏sharding分割线
    BUSINESS_TYPE:{
        QBU:'qbu',
        QBU_DIAGNOSE:'customization',//诊断
        QBU_RANK_LIST:'rankList',//奖杯排行
        QBU_REFER_ANS:'excellentAnswer',//学霸解答
        GAME:'game',
        RC:'RapidCalculation', //速算
        COMPETITION:"/competition",//期末测评

    },
    WORK_TYPE:{
        SUMMER_WORK:4, //暑假作业
        WINTER_WORK:5,  //寒假作业
        MATCH_WORK:8,  //比赛作业
        ORAL_WORK: 11, //手写输入口算作业
        ORAL_WORK_KEYBOARD: 10, //键盘输入口算作业
        FINAL_ACCESS:13, //期末测评
        WINTER_CAMP_WORK:14, //寒假新知堂作业
        WINTER_CAMP_ORAl_CALC_WORK:15, //寒假新知堂口算作业
        AREA_EVALUATION:16, //区域测评
        LIVE:17, //直播课程练习题
        PERSONAL_QB:21, //个人题库作业
    },
    DIAGNOSE_BTN_TYPE:{
        Q_CORRECT:1,// 1-单题改错
        NOT_START:2,//2-未做题（未做题）
        TEST_AGAIN:3,//做一题（再做一题，完成测试）
        PERSONAL_TAILOR:4,//4-不牢固（挑战一下)
        MASTER_GOOD:5//5-掌握的不错;
    },
    TYPE_PARENT: "P", //家长类型
    TYPE_TEACHER: "T", //老师类型
    CHECK_STATUS_AUDIT: 0,//审核中
    CHECK_STATUS_PASS: 1,//通过
    CHECK_STATUS_REFUSE: -1,//拒绝
    CHECK_STATUS_IGNORE: -2,//忽略
    WORK_TYPE_HOMEWORK: 1,//作业
    WORK_TYPE_QUESTION: 2,//试题
    POINT_DIGIT: 1,//当前小数位数
    PATTERN_POSITIVE_INT: new RegExp("^[0-9]*[1-9][0-9]*$"),//正整数
    Q_NUM_ARRAY: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],//题号数组映射
    ANSWER_SPLIT_FLAG: "#",//学生答案分割
    BIG_Q_SORT_FIELD: "seqNum",//大题排序字段
    SMALL_Q_SORT_FIELD: "seqNum",//学生答案分割
    CORRECT_Q_ERROR_EXP_NULL: 10007,//列式为空
    CORRECT_Q_ERROR_ANS_NULL: 10009,//答语为空
    STRIP_Q_PART_RIGHT: 20001,//拖式半对
    STU_F_IMG:"person/student-f.png",//女学生头像
    STU_M_IMG:"person/student-m.png",//男学生头像
    PARENT_F_IMG:"person/parent-f.png",//女家长头像
    PARENT_M_IMG:"person/parent-m.png",//男家长头像
    TEACHER_F_IMG:"person/teacher-f.png",//女教师头像
    TEACHER_M_IMG:"person/teacher-m.png",//男教师头像
    DB_CONTACTS_S: "s_contacts_db",
    DB_MSG_S: "s_msg_db",
    JPUSH_MSG_EVENT: "receiveJpushMsg",
    VALIDATE_MSG_INFO: {
        userName: {
            required: '账号不能为空!'
        },
        realName: {
            required: '真实姓名不能为空!'
        },
        loginName: {
            required: '账号不能为空!'
        },
        studentName: {
            required: '学生姓名不能为空'
        },
        cellphone: {
            required: '手机号码不能为空!',
            pattern: '手机号码格式不正确!'
        },
        password: {
            required: '密码不能为空!'
        },
        confirmPass: {
            confirmPass: '两次输入的密码不一致！',
            required: '请再次输入密码'
        },
        vCode: {
            required: '验证码不能为空!'
        },
        telVC: {
            required: '手机短信验证码不能为空!'
        },
        answer1: {
            required: '第一个问题的答案不能为空!'
        },
        answer2: {
            required: '第二个问题的答案不能为空!'
        },
        answer3: {
            required: '第三个问题的答案不能为空!'
        }
    },
    PRAISE_TYPE_LIST: [//表扬类型
        {type: 1, text: '点赞', img: 'praise/thumbsup-ico-g.png',msg:'做的不错，给你点个赞!'},
        {type: 2, text:'鼓励奖',img:'praise/encourage.png',msg:'加油哦！'},
        {type: 3, text: '最佳作业奖', img: 'praise/best.png',msg:'这次作业你最棒!!'},
        {type: 4, text: '优秀作业奖', img: 'praise/good.png',msg:'做的非常好，继续加油哦!'},
        {type: 5, text: '突出进步奖', img: 'praise/amazing.png',msg:'这次你有很大进步!'},
        {type: 6, text: '老师评价语', img: 'praise/message-t.png'},
        {type: 7, text: '专注奖', img: 'praise/attentive.png',msg:'你今天学习很专心！再主动一点就好了!'},
        {type: 8, text: '主动奖', img: 'praise/positive.png',msg:'你今天学习很主动! 再专心一点就好了!'},
        {type: 9, text: '主动加专心奖', img: 'praise/a-p.png',msg:'你今天学习很棒！既主动又专心!'},
        {type: 10, text: '家长评价语', img: 'praise/message-p.png'},
        {type: 101, text: '学生评价语', img: 'praise/message-s.png'},
        {type: 102, text: '我今天作业不认真，下次改正', img: 'praise/message-s.png',msg:'我今天作业不认真，下次改正!'},
        {type: 103, text: '主动要求做作业的（主动学习奖）', img: 'praise/message-s.png',msg:'我今天学习很主动哦!'},
        {type: 104, text: '做得又快又好（专心学习奖）', img: 'praise/message-s.png',msg:'我今天学习很专心哦!'},
        {type: 105, text: '主动又专心（主动+专心学习奖）', img: 'praise/message-s.png',msg:'我今天学习做到了主动又专心!!'}
    ],
    PRAISE_MAP: {
        3:{text:'最佳作业',img:'praise/best_120.png',bgColor:{background:"#FA9F98"},id:1},       //id用来显示块儿的顺序
        8: {text: '主动奖', img: 'praise/positive_120.png',bgColor:{background:"#EB8DDB"},id:2},
        4: {text: '优秀作业奖', img: 'praise/good_120.png',bgColor:{background:"#F2B782"},id:3},
        7: {text: '专注奖', img: 'praise/attentive_120.png',bgColor:{background:"#8798DA"},id:4},
        5: {text: '突出进步奖', img: 'praise/amazing_120.png',bgColor:{background:"#DF7E62"},id:5},
        9: {text: '主动加专心奖', img: 'praise/a-p_120.png',bgColor:{background:"#79D98A"},id:6},
        1: {text:'点赞',img:'praise/thumbsup_120.png',bgColor:{background:"#EFC665"},id:7},
        2:{text:'鼓励奖',img:'praise/encourage_120.png',bgColor:{background:"#FAAFAF"},id:8}
    },
    //todo GAME_NUM  game_list已经独立出来 game_level还在用
    GAME_NUM: {

        "11" : [
            "aa0NumCounting"
            , "comparison"
            , "location"
            , "rule"
            , "complexcomparison"
            , "aa5", "aa5addsub"
        ]
        , "12" : [
            "aa8Classification"
            , "aa10", "aa10addsubwithin20"
            , "aa12", "aa12GraphicsSolid"
            ,"aa13", "aa13timer"
            , "aa21", "aa21Position"
        ]
        , "13" : [
            "aa11", "aa11absubwithin20"
            , "aa14CountingWithin100"
            , "aa17", "aa17addsubwithin100"
            , "aa18 ", "aa18GraphicsPlane"
        ]
        , "14" : [
            "aa19", "AA19AddsubWithin100"
            , "aa20AddsubExe"
            , "aa22AddsubExe"
            , "aa23AddsubExe"
        ]
        , "21" : [
            "ab1", "ab1Fishing"
            , "ab2", "ab2Shopping"
            , "ab3", "ab3Farm"
            , "ab4", "ab4TranslationSymmetry"
        ]
        , "22" : [
            "ab5", "ab5Multiplication1"
            , "ab6", "ab6Measure"
            , "ab7", "ab7DivisionConcept"
            , "ab8", "ab8Multiplication2"
        ]
        , "23" : [
            "ab9", "ab9Division"
            , "ab10", "ab10SnowmanPageant"
            , "ab11", "ab11Direction"
            , "ab12a", "ab12aNumber"
            , "ab12b", "ab12bNumber"
        ]
        , "24" : [
            "ab15", "ab15GraphicsAbstract"
            , "ab13", "ab13Measure"
            , "ab16", "ab16Time"
            , "ab17", "ab17InvestigationRecording"
            , "ab14a", "ab14aAddSub"
            , "ab14b", "ab14bAddSub"
        ]
        , "31" : [
            "ac1", "ac1HybridOperation"
            , "ac3", "ac3IslandArmy"
            , "ac4", "ac4Island"
            , "ac5", "ac5Perimeter"
        ]
        , "32" : [
            "ac6a", "ac6aMul"
            , "ac6b", "ac6bMul"
            , "ac7", "ac7Date"
            , "ac8", "ac8Decimal"
        ]
        , "33" : [
            "ac9a", "ac9aDivision"
            , "ac9b", "ac9bDivision"
            , "ac10", "ac10Circus"
            , "ac11", "ac11SeabedTreasures"
        ]
        , "34" : [
            "ac12", "ac12Quality"
            , "ac13", "ac13EgyptAdventure"
            , "ac14", "ac14NinjaShop"
            , "ac15"
            , "ac19", "ac19i10eChosen", "ac19i10eGame"
        ]
    },
    WORK_STATUS : {
        NOT_STARTED: 0,
        NOT_CORRECTED: 1,
        NOT_CHECKED: 2,
        CHECKED: 3
    },
    URL_FROM : {
        OLYMPIC_MATH: 'olympic_math',//来自奥数
        OLYMPIC_MATH_T: 'olympic_math_t',//来自老师布置的奥数
        OLYMPIC_MATH_S: 'olympic_math_s',//来自学生布置的奥数
        ORAL_WORK: 'oral_work', //来自口算作业
        FINAL_ACCESS:'final_access', //来自期末测评
        AREA_EVALUATION:'area_evaluation', //来自期末测评
    },
    QUESTION_ANS_SAVE_TO_LOCAL_LIMIT:1, //本地存储小题答案数, >=该数上传服务器
    IS_COME_FROM_GAME:'IS_COME_FROM_GAME',//从游戏推出后初始化作业端进入游戏列表路由|速算路由
    OLYMPIC_SELF_TRANCE_FREE_LESSON:0,//index从0开始，大于该值的需要付费
    OLYMPIC_FROM_TEACHER_FREE:86001, //教师端发布的奥数作业，学生端需要激活的flag
    COMPETITION_PAPER_COUNT_DOWN_TIME:'competition_paper_count_down_time', //保存在localStorage中竞赛试卷做题试卷倒计时
    XLY_GOODS_TYPE:{
        AS:'as', //奥数
        GL:'gl', //游戏单个地图包
        GLS:'gls', //游戏地图包合集
        XC:'xc', //驯宠记
        TF:'tf', //提分
    },
    //公众号二维码图片地址
    GONG_ZHONG_HAO_QRIMG_URL:'http://cdn.allere.static.xuexiv.com/static/img/gongzhonghao_qr2.png'
});

/**
 * 需要添加sharding的接口集合
 */
constants.constant('needShardingUrlList', [
    urlMap.PAPER_LIST
    ,urlMap.PAPER_GET
    ,urlMap.POST_ANSWER
    ,urlMap.PAPER_SUBMIT
    ,urlMap.SUBMIT_PAPER_AND_ANS
    ,urlMap.GET_Q_REFER_ANSWER_FOR_BOOKMARK
    ,urlMap.GET_WORK_LIST
    ,urlMap.GET_FINAL_ACCESS_WORK_LIST
    ,urlMap.GET_PAPER_STATUS
    ,urlMap.GET_FINISH_VACATION_MESSAGE
    ,urlMap.GET_CLAZZ_STUDY_STATISC
    ,urlMap.GET_CLAZZ_STUDY_STATISC_NEW
    ,urlMap.POST_Q_FEEDBACK_REMOVE_Q
    ,urlMap.GET_Q_REFER_ANSWER_SAVANT
    ,urlMap.GET_ERROR_Q_RECORDS
    ,urlMap.FETCH_HOME_DIAGNOSE
    ,urlMap.FETCH_UNIT_DIAGNOSE
    ,urlMap.FETCH_CHAPTER_DIAGNOSE
    ,urlMap.FETCH_QUESTION_NEW
    ,urlMap.FETCH_QUESTION_NEW_VIP
    ,urlMap.FETCH_DIAGNOSE_Q_ERROR_RECORDS
    ,urlMap.FETCH_DIAGNOSE_REPORT
    ,urlMap.FETCH_UNIT_KNOWLEDGE_DIAGNOSE
    ,urlMap.FETCH_UNIT_Q_RECORDS
    ,urlMap.FETCH_UNIT_Q_ERROR_RECORDS
    ,urlMap.FETCH_UNIT_NEW_QUESTION
    ,urlMap.FETCH_UNIT_NEW_QUESTION_AUTHORITY
    ,urlMap.FETCH_UNIT_ERROR_QUESTION
    ,urlMap.UNIT_SUBMIT_Q
    ,urlMap.GET_WORK_DATA
    ,urlMap.GET_TROPHY_RANK
    ,urlMap.GET_WORK_REAL_TIME_CAST
    ,urlMap.GET_GAME_DATA
    // ,urlMap.GET_PLAY_GAME
    // ,urlMap.IS_GAME_CAN_PLAY
    ,urlMap.GET_GAME_STAR_RANK
    // ,urlMap.GET_GAME_REAL_TIME_CAST
    ,urlMap.GET_FIGHTER_RANK
    ,urlMap.STUDENT_RC_INFO
    ,urlMap.GET_RC_LEVELS_NAME
    // ,urlMap.GET_SUSUAN_REAL_TIME_CAST
    ,urlMap.GET_COMPETITION_PAPER_INFO
    ,urlMap.WORK_REPORT_PAPER_ANALYSIS
    ,'/game/rest/mlcg/levelScence'// 游戏地图包 获取游戏包的关卡信息
    ,'/game/rest/mlcg/openBox' // 游戏地图包 打开一个宝箱
    ,'/game/rest/mlcg/mainScence'// 游戏地图包 获取主页面数据
    ,'/game/rest/mlcg/ownedCard' // 游戏地图包 获取图集信息
    ,urlMap.GET_FINAL_ACCESS_PAPER_STATUS
]);
