/**
 * Created by 彭建伦 on 2015/7/13.
 */
import constants from "./index";
import buildCfg from "default";

var backend = buildCfg.backend + '/door' || '192.168.0.167:9081/door';
var img_server = buildCfg.img_server || '192.168.0.167';

//学生端接口列表，需要sharding的接口，请添加到常量needShardingUrlList列表中
var urlMap = {
    ON_LINE_WS: "ws://www.xuexihappy.com:18765",
    IMG_SERVER: img_server,
    CLZ_IP: "http://" + backend,  //课堂网络ip
    CLZ_WEB_SOCKET: 'ws://' + backend + '/ws',//课堂网络websocket
    CLOUD_IP: "http://" + backend,   //云端网络ip

    BASE: "door",//连接后端接口的标志字符串

    CHECK_ISVALID_SESSION: '/checkIsValidOfSession',
    GET_SESSION_ID: '/vc/getSID',//获取session id
    LOGIN: '/login/teacher',  //登录
//        LOGIN: 'json/login.json',  //登录
    LOGOUT: '/teacher/logout', //退出
    REGISTER: '/register/teacher',//注册
    GET_VALIDATE_IMAGE: '/rc',//获取图片验证码
    VALIDATE_IMAGE_V_CODE: '/vc/validateImgVC',//验证图形验证码
    APPLY_REFER_PHONE_V_CODE: '/vc/getTelVC',//请求手机验证码
    GET_CHANGING_DEV_VC: '/vc/getChangingDevVC',//跟换设备号请求手机验证码
    GET_QR_CODE: '/vc/getQRCode', //获取二维码
    ALLOW_DEVICE: '/teacher/allowDevice',//查看自己是否被允许登录
    ALLOW_CODE: '/teacher/allowQRCode',//扫描二维码并允许或者拒绝其它设备登录
    VALIDATE_REFER_PHONE_V_CODE: 'json/validateReferPhoneVCode.json',//验证手机验证码
    APPLY_REFER_PHONE_INFO: '/teacher/getPhone',//请求手机后四位
    APPLY_REFER_EMAIL_INFO: '/rest/applyReferEmailInfo',//请求邮箱后四位
    RESET_PASSWORD: '/teacher/resetPW',//重置密码
    APPLY_PHONE_PASSWORD_V_CODE: '/vc/getTelVCByLN',//请求手机验证码（密码找回专用）
    VALIDATE_SECURITY: 'json/validateSecurity.json',//验证密保答案
    SAVE_BASE_INFO: '/teacher/completeInfo',//保存用户基本信息
    GET_BASE_INFO: '/teacher/info',//获取用户基本信息
    //GET_PW_PRO_QUESTION:'json/pwPro.json',//获取密保信息
    GET_PW_PRO_QUESTION: '/teacher/getPwProQuestion',//获取密保信息
    SAVE_PW_PRO_QUESTION: '/teacher/savePwProAnswers',//保存密保信息

    RESET_TELEPHONE: '/um/teacher/resetTelephone',//保存密保信息

    CHECK_PW_PRO_QUESTION: '/teacher/validatePwProAnswers',//验证密保信息

    GET_USER_LIST_BY_PHONE:'/um/userBaseInfo', //通过手机号码获取相关账号

    /*----------------教研群功能 Start--------------------*/
    GET_TEACHER_GROUP: '/um/TGroup/teacher/getTGroupList',//普通教师获取教研群信息
    GET_T_GROUP_INFO: '/um/TGroup/teacher/getTGroupInfo',//根据教研群号获取该群的详细信息
    SUBMIT_T_GROUP_APPLICATION: '/um/TGroup/teacher/submitTGroupApplication',//申请教学群
    REMOVE_TEACHER_FROM_T_GROUP: '/um/TGroup/teacher/removeTeacherFromTGroup',//教师退出教学群
    T_CAN_CREATE_CLASS: '/um/TGroup/teacher/canTCreateClass',//教师能否创建班级
    GET_T_GROUP_LIST: '/um/trGroup/admin/getTrGroupList',//教研员获取所有的教研群
    GET_T_GROUP_DETAIL: '/um/trGroup/admin/getTrGroupDetail',//教研圈子级详情

    UPDATE_T_GROUP:"/um/TGroup/admin/updateTGroup",//修改群
    GET_APPLICATION_SCHOOL_LIST:"/um/TGroup/admin/getApplicationSchoolList",//申请学校列表
    UPDATE_GROUP_STATUS:"/um/TGroup/admin/gateStatus/update",//变更群的状态
    GET_APPLICATION_TEACHER_LIST:"/um/TGroup/admin/getApplicationTeacherList",//申请学校列表
    GET_PASSED_SCHOOL_LIST:"/um/TGroup/admin/getPassedSchoolList",//已批准教师所在的学校列表
    GET_PASSED_TEACHER_LIST:"/um/TGroup/admin/getPassedTeacherList",//已批准教师列表
    ACCEPT_OR_REJECT_APPLICATION:"/um/TGroup/admin/acceptOrRejectApplication",//允许或拒绝申请
    /*----------------教研群功能 End--------------------*/
    /*----------------诊断功能 Start--------------------*/
    FETCH_UNIT_DIAGNOSE:"/qbu/api/customization/teacher/studentList",//获取单元下的诊断信息
    FETCH_STUDENT_DIAGNOSE:"/qbu/api/customization/chapter/statistics",//获取单元下某个学生的诊断信息
    FETCH_UNIT_KNOWLEDGE_DIAGNOSE:"/qbu/api/customization/teacher/knowledge/statistics",//获取单元下的诊断信息
    FETCH_UNIT_Q_RECORDS:"/qbu/api/customization/teacher/historyQuestionList",//获取学生的做题记录信息
    /*----------------诊断功能 End--------------------*/


    CREATE_PAPER: '/qb/paper/create', //创建作业试卷
    GET_FAVORITES_Q_LIST: '/qbu/api/bookMark/list', //获取单题收藏夹下所有的试题
    GET_PAPER_INFO: '/qbu/api/bookMark/detail', //获取候选作业详情
    DEL_FAVORITES_Q_LIST: '/qbu/api/bookMark/delBySubjectIds', //删除单题收藏夹下所选的试题
    GET_P_DETAIL_Q_LIST: '/qb/paper/get', //获取某个作业下所有的试题
    //GET_P_DETAIL_Q_LIST:'json/favoritesQList.json', //获取某个作业下所有的试题
    GET_Q_BY_ID: '/qb/question/get', //根据试题id获取试题详细信息
    DEL_WORK: '/qbu/api/bookMark/del', //删除候选作业
    CHECK_WORK: '/qbu/api/bookMark/preCheck', //判断这个作业是否为空
    COPY: '/qbu/api/bookMark/copy',//复制作业

    /*----------------作业统计 Start--------------------*/
    PUBED_WORK_LIST: '/qbu/api/deliver/listMore',//获取教师的班级作业列表
    // PUBED_WORK_LIST: '/competition/teacher/listMore',//获取教师的班级作业列表
    WORK_STU_LIST: '/qbu/api/simpleStatics/rank',//作业学生列表接口
    // WORK_STU_LIST_FINAL_ACCESS: '/competition/simpleStatics/rank',//期末测评作业学生列表接口
    WORK_STU_LIST_FINAL_ACCESS: '/qbu/api/simpleStatics/rank',//期末测评作业学生列表接口

    WORK_STU_DETAIL: '/qb/paper/get',//某个学生的作业
    FETCH_EDIT_PAPER_DETAIL: '/pqb/api/paper/favorite/get',//获取最新版本的编辑试卷
    SAVE_APPRAISE: '/um/appraise/saveOrUpdate/teacher',//新增老师对学生的评价
    SELECT_APPRAISE_LIST: '/um/appraise/comment/teacher',//获取评价列表选择
    GET_APPRAISE_DATA: '/um/appraise/detail/teacher',//获取评价数据
    GET_APPRAISE_DATA_P: '/um/appraise/detail/parent',//获取评价数据
    GET_APPRAISE_DATA_S: '/um/appraise/detail/student',//获取评价数据
    EDIT_APPRAISE: '/qbu/api/appraise/mod',//修改评价

    LIST_MESSAGE_BY_SID: '/um/message/listMessageBySid',//查询评价功能


    GET_STUDENT_ANS: '/qbu/api/paper/get',//获取学生作业的答案
    GET_Q_REFER_ANSWER: '/qb/paper/getQReferAnswer',//获取输入框答案
    GET_Q_REFER_ANSWER_FOR_NEW: '/dqb/question/getQReferAnswer',//获取输入框答案针对新增小题
    GET_Q_REFER_ANSWER_SAVANT: '/qbu/api/paper/excellentAnswer',//获取学霸的解答

    ANALYSIS_PAPER: '/qbu/api/simpleStatics/analysisPaper',//整个paper统计
    ANALYSIS_PAPER_REPEAT: '/qbu/api/simpleStatics/analysisPaperRepeat',//整个paper统计 新接口
    PAPER_SUBMIT: '/qbu/api/deliver/deadline',//老师回收作业
    GET_ERROR_STU_Q: '/qbu/api/paper/getQ',//获取出错学生的试题

    GET_SCORE_DIST: '/qbu/api/simpleStatics/scoreDistribution', //获取成绩分布
    DEL_PUB_WORK: '/qbu/api/deliver/delete',
    ARCHIVED_PUB_WORK: '/qbu/api/deliver/archived',
    RE_DELIVER: "/qbu/api/deliver/reDo",
    GET_FINISH_VACATION_MESSAGE: "/qbu/api/schedule/newFinishVacationMessage",//获取暑假作业最新情况

    GET_CLAZZ_STUDY_STATISC: "/qbu/api/studyStatistics/teacher/classDetail",//根据班级id获取班级的学情
    GET_CLAZZ_STUDY_STATISC_NEW: "/qbu/api/studyStatistics/teacher/eachClassDetail",//根据班级id获取班级的学情
    //GET_UNIT_TEXT_POINTS:"/qb/tag/allSubTagNodes",//获取单元下所有的知识点
    GET_UNIT_TEXT_POINTS:"/dqb/tag/allSubTagNodes",//获取单元下所有的知识点

    /*----------------作业统计 End--------------------*/

    /*----------------游戏统计 Start--------------------*/
    PUBED_GAME_LIST: '/game/rest/pm/getCGCE',//获取已发布的游戏列表
    GAME_SUBMIT: '/game/rest/pm/us',//老师主动将某个游戏作业设置为过期或者无效
    /*----------------游戏统计 End--------------------*/

    SET_CLAZZ_STATUS: '/class/tUpdateClzStatus', //设置班级是否可以申请加入
    GET_CLAZZ_STATUS: '', //获取班级是否可以申请加入
    SELECT_CLAZZ_LIST: '/class/listByTeacher', //获取教师的班级列表
    GET_PUB_CLAZZ_LIST: '/class/listSimpleByTeacher', //发布时获取班级
    GET_CLAZZ_LIST: '/class/listByTeacher',
    GET_CLAZZ_STUDENT_LIST: '/class/listStudentByClassId',//获取教师的班级列表
    GET_LETTER_STUDENT_LIST: '/class/tGetLevelAR',//获取教师的班级学生列表
    LEVEL_CHANGE: '/class/modStuLevel',  //改变学生等级
    T_AUDIT: '/class/tAudit',//老师处理学生请求。
    GET_CLAZZ_STUDENT_LIST_BY_STATUS: '/class/tGetAR',//根据状态查看申请加入某班的学生列表（分页未做）
    GET_LOCATIONS: '/location/getLocations', //获取省市区
    GET_GRADE_CLAZZ: '/teacher/getAllGradeClass',//获取班级年级
    ADD_CLAZZ: '/class/create', //添加班级
    GET_BOOKS:'/dqb/qtag/getBooks', //添加班级时获取可选择的教材列表
    GET_BOOKS_V2:'/dqb/qtag/getBooks_v2', //添加班级时获取可选择的教材列表
    UPDATE_CLAZZ: '/class/modByTeacher',//修改班级
    GET_CLAZZ_INFO: '/class/getClassInfo',//获取班级详细信息
    // DELETE_CLAZZ: '/class/delByTeacher', //删除班级
    GET_STU_INFO: '/um/teacher/getStudent', //获取一个学生详情
    DELETE_STUDENT: '/um/class/pDelStuClass',//删除一个学生
    GET_LIB_LIST: '/qb/paper/list',//获取作业试卷库列表
    GET_LAB_LIST: '/qb/ptag/subTagNodes',//获取教材列表
    GET_TEXTBOOK_LIST: '/qb/ptag/getTextbooks',//获取所有教材列表
    GET_TEXTBOOK_LIST_V2: '/qb/ptag/getTextbooks_v2',//获取所有教材列表
    GET_TEXTBOOK_CHAPTER: '/qb/ptag/allSubTagNodes',//获取指定教材的章节和单元

    GET_UNIT_LIST: '/qb/ptag/qCount', //获取单元列表
    GET_PAPER_LIST: '/qb/paper/get',//获取一个作业试卷列表
    PUB_WORK: '/qbu/api/deliver/paperBatch',//发布一个单题或一个作业
    ADD_FAVORITE: '/qbu/api/bookMark/save',//加入收藏夹
    IS_IN_FAVORITE: '/qbu/api/bookMark/query', //查询是否加入收藏夹
    UPDATE_PAPER_INFO: '/qbu/api/bookMark/mod',//修改作业
    GET_GAME_INIT: '/gtb/tbg/getTextBooksOfTeacher',//获取到用户的所教的年级教材信息
    GET_GAME_BY_GRADE: '/gtb/tbg/getGamesOfTB',//根据教材获取到相关的游戏基本信息列表
    GET_LEVELS: '/gtb/tbg/getLevels',//根据游戏id获取游戏关卡
    PUB_GAME: '/game/rest/pm/publish',  //发布游戏
    GET_PUB_GAMES: '/game/rest/pm/getCGCEs',//根据班级id获取班级已发布游戏
    GET_PUB_GAME_LEVELS: '/game/rest/pm/getCGCEDetail', //获取发布游戏的关卡信息
    UPDATE_PUB_GAME: '/game/rest/pm/updateSeq',  //移动发布游戏的顺序
    DEL_PUB_GAME: '/game/rest/pm/notReallyDelete',//删除发布的游戏
    UPDATE_NEW_GAME_STATUS: '/game/rest/pm/updateNewGame',//变更新发布的游戏状态
    RESET_GAME: '/game/rest/pm/reset',   //重置游戏
    ISPUB_GAME: '/game/rest/pm/canPublish', //判断今天还可以发布游戏吗
    GET_GAME_STATS: '/game/rest/statistics/classLevel', //获取游戏统计
    GET_ERROR_BYCLASS: '/game/rest/statistics/errorClass', //获取班级错误统计
    GET_ERROR_BYSTU: '/game/rest/statistics/errorPerson',  //获取个人错误统计
    GET_HRD_QUESTION_ANS:'/game/rest/question/getHRDQuestionAns',//华容道游戏获取学生答案
    GET_GAME_CGCID: '/game/rest/knowledge/specialUserDefaultGameConfig',//获取gameCGCID
    POST_FEEDBACK: '/um/feedback/suggestion/save',  //提交问题反馈
    POST_Q_FEEDBACK: '/um/feedback/question/save',  //提交试题报错
    POST_Q_FEEDBACK_REMOVE_Q: '/qbu/api/deliver/mvQuestion' , //提交试题报错--移除试题

    GR_GET_TEXTBOOK_DETAIL:"/gtb/sc/getTextBookTree0",//获取游戏教材详情
    GT_GET_UNIT_GAME_LIST:"/gtb/tbg/getGamesOfTB", //获取单元下所有的游戏列表
    GET_SMALLQ_LIST_BY_KNOWLEDGE_ID:"/dqb/question/listByTeacher", //根据知识点id,获取相应小题集合
    //AUTO_GENERATE_PAPER:"/pqb/paper/autoCreate", //自动组卷
    AUTO_GENERATE_PAPER:"/pqb/api/paper/favorite/saveAuto", //自动组卷
    ADD_TEXTBOOK_PAPER_TO_MINE:"/pqb/api/paper/favorite/savePaper", //将教材试卷拷贝为编辑试卷
    FETCH_EDIT_PAPER_DATA:"/pqb/api/paper/favorite/get", //获取编辑试卷的具体内容
    FETCH_EDIT_PAPER_LIST:"/pqb/api/paper/favorites", //获取编辑试卷的列表
    MODIFY_EDIT_PAPER_DATA:"/pqb/api/paper/favorite/mod", //更新编辑试卷的内容
    GET_PAPER_CONDITION:"/dqb/paper/getCondition",//获取自动组卷的标准集合
    DELETE_MINE_PAPER:"/pqb/api/paper/favorite/del", //删除编辑的试卷
    GET_PARENT_POINT_LIST:"/dqb/tag/batchGet", //根据子级知识点列表获取父级知识点列表

    /*----------------速算统计 start--------------------*/
    GET_RAPID_CALC_COUNT: '/RapidCalculation/statistics/getClassStudentProgress',
    GET_RC_LEVELS_NAME: '/RapidCalculation/statistics/levelName',
    /*----------------速算统计 end--------------------*/
    /*----------------获取学生列表 start--------------------*/
    GET_STUDENT_LIST: '/um/class/listStudentByClassId',
    /*----------------获取学生列表 end--------------------*/
    GET_TROPHY_RANK: '/qbu/api/rankList/goldenCupList', //获取奖杯排行


    /*----------------错题集--------------------------*/
    GET_ERROR_INFO_BY_CHAPTER:'/qbu/api/errorCollection/teacher/chapter/errorQuestion', //根据教材章节获取班级的错题集信息
    GET_ERROR_QUESTION_DETAIL:'/qbu/api/errorCollection/teacher/unitId/questionList', //获取班级指定单元的错题
    GET_ERROR_STUDENT_LIST:'/qbu/api/errorCollection/teacher/error/studentList', //获取错题的学生详情列表
    GET_STUDENT_ERROR_INFO:'/qbu/api/errorCollection/teacher/error/studentQuestionList', //获取错题的学生试题错误明细
    GET_ERROR_PAPER_LIST:'/pqb/api/paper/favorite/errorList', //获取错题集中的重练试卷

    CREATE_ERROR_REDO_PAPER:'/qbu/api/errorCollection/teacher/saveErrorPaper', //错题集创建一张重练试卷

    GET_WINTER_BROADCAST_DATA:"/ms/api/schedule/newFinishVacationMessage", //获取寒假作业的广播数据
    GET_COMPETITION_PAPER_INFO_TEACHER: '/qbu/api/race/teacher/getCompetitionPaper', //教师端获取竞赛试卷基本信息


    GET_GAME_STAR_RANK:'/game/rest/statistics/starInClass',      //获取玩家在班级中的游戏星星排行
    GET_FIGHTER_RANK:'/RapidCalculation/statistics/classMedal',      //获取玩家在班级中的斗士排行
    GET_TEACHER_SHARE_INFO:'/um/userProxy/tFreeVipDetail',//获取教师邀请老师的信息
    GET_STU_WORK_REPORT:'/qbu/api/paper/analysis', //获取学生报告
    FETCH_DIAGNOSE_REPORT:'/qbu/api/customization/knowledge/statistics',//获取知识点下的诊断报告。
    SEND_MSG_TO_STU:'/um/nf/teacher/notify',//给学生发送消息。
    SET_AUTO_COMMENT:'/um/appraise/setAutoComment',//设置自动评价
    CANCEL_AUTO_COMMENT:'/um/appraise/setAutoCommentState',//关闭自动评价
    GET_AUTO_COMMENT:'/um/appraise/getAutoComment',//获取自动评价评语

    PRODUCE_ORAL_CALCULATION:'/pqb/api/paper/RapidCal/saveAuto',// 生成口算题

    GET_TR_GROUP_LIST: '/um/trGroup/admin/getTrGroupList',//教研员获取所有的教研群
    SET_BLANK_SCREEN:'/setBlankScreen', //设置黑屏
    GET_BLANK_SCREEN:'/getBlankScreen/teacher',//教师获取当前设置的黑屏状态：
    CHECK_CLASS_STU_NUM:'/rqb/paper/checkPermissionOfView',//检查班级人数是否大于10人
    GET_TEMP_PAPER_QUES:'/rqb/question/getQuestionListForTempPaper',//根据单元选择题数生成题目
    GET_MULTI_UNITS_PAPER:'/pqb/api/paper/multiUnits/saveAuto',//根据单元选择题数生成试卷
    DELETE_CLAZZ:'/teacher/group/delete',//删除班级
    COMPETITION_DISTRICT_AVERAGE:"/competition/district/average", //获取期末测评的学生（全国|全区）评价分
    GET_TEACHER_SCORE_LIST:'/credits/teacher/history',//获取教师积分列表
    GET_TEACHER_SCORE_DETAIL:'/credits/teacher/getCredits',//获取教师积分详情
    WORK_STATISTICS_PAPER_REPORT:'/qbu/api/simpleStatics/paperReport',// 教师或者家长通过分享链接来获取作业报告
    HOLIDAY_WORK_STATISTICS_PAPER_REPORT:'/qbu/api/vacation/simpleStatics/paperReport',// 教师或者家长通过分享链接来获取假期作业报告
};
constants.constant('serverInterface', urlMap);
/**
 * 访问后台数据url接口地址(含json数据测试)
 */
constants.constant('mockInterface', {
    GET_CLASS_GAME_LIST: 'json/class_game.json'//获取课堂游戏列表
});
/**
 * 改卷页面中，圈选得分点的图片的路径配置
 */
constants.constant('circleImgPathMap', {
    CIRCLE_IMG_0: '../../tImages/circle_img/circle_icon0.svg',
    CIRCLE_IMG_1: '../../tImages/circle_img/circle_icon1.svg',
    CIRCLE_IMG_2: '../../tImages/circle_img/circle_icon2.svg',
    CIRCLE_IMG_3: '../../tImages/circle_img/circle_icon3.svg',
    CIRCLE_IMG_4: '../../tImages/circle_img/circle_icon4.svg',
    CIRCLE_IMG_5: '../../tImages/circle_img/circle_icon5.svg',
    CIRCLE_IMG_6: '../../tImages/circle_img/circle_icon6.svg',
    CIRCLE_IMG_7: '../../tImages/circle_img/circle_icon7.svg',
    CIRCLE_IMG_8: '../../tImages/circle_img/circle_icon8.svg',
    CIRCLE_IMG_9: '../../tImages/circle_img/circle_icon9.svg'
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

    HTTPS_URL_REG: new RegExp("(login)|(register)|(um\/userBaseInfo)|(task\/teacher)|(credits\/teacher)"),//匹配需要加https请求的url
    HTTPS_EXCLUDE_161_REG: new RegExp("192.168.0.161"),//匹配需要排除加https请求的url
    PUB_CLAZZ_STATUS:{  //作业游戏发布状态
        PROCESSING:{
            CODE:1,
            MSG:'布置中...'
        },
        SUCCESS:{
            CODE:2,
            MSG:'布置成功'
        },
        FAIL:{
            CODE:3,
            MSG:'布置失败'
        }
    },
    DEVICE_TYPE: {       //设备类型，目前暂时用于无法判断客户端设备为手机还是平板，1为手机，2为平板，3为pc,4为其他
        ANDROID: 1,
        IPHONE: 1,
        IPAD: 2,
        WINDOWS: 3
    },
    WORK_TYPE:{
        SUMMER_WORK:4, //暑假作业
        WINTER_WORK:5,  //寒假作业
        MATCH_WORK:8, //比赛作业
        ORAL_WORK: 11, //手写输入口算作业
        ORAL_WORK_KEYBOARD: 10, //键盘输入口算作业
        FINAL_ACCESS: 13, //期末测评
        AREA_EVALUATION:16, //区域测评
        TEACHER_PERSONAL_QB:21 //教师个人题库发布的试卷
    },
    GAME_SHARDING_SPILT:'__',//试玩游戏，给jsessionId添加sharding的分隔符
    GAME_NO_CLAZZ:'000000',//试玩游戏，给jsessionId添加sharding的空班级id
    BUSINESS_TYPE:{
        QBU:'qbu',
        QBU_S:'qbu-s',
        QBU_DIAGNOSE:'customization',//诊断
        QBU_RANK_LIST:'rankList',//奖杯排行
        QBU_PUB_WORK:'deliver/paperBatch',
        QBU_REFER_ANS:'excellentAnswer',
        GAME:'game',
        STATS:'stats',
        PUB_GAME: '/game/rest/pm/publish',
        CAN_PUB_GAME: '/game/rest/pm/canPublish',
        RAPID_CALCULATION: {
            'TYPE': 'rc',
            'URL': 'RapidCalculation'
        },
        COMPETITION:"/competition",//期末测评

        // TEMPORARY_PAPER:"getTemporaryPaper",
        // GOLDEN_CUP_LIST:"goldenCupList"


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
    MONTH_REGEXP: new RegExp("/^(d{4})-(d{2})$/"),//日期校验 如2015-08
    ANSWER_SPLIT_FLAG: "#",//学生答案分割
    RESPONSE_CODE: [200, 601, 602, 603, 604, 605, 606, 607, 608, 609, 300, 6073],
    REQUEST_NOT_NEED_LOADING: ['/stats/class', '/stats/errorClass', '/stats/errorPerson', '/qbu/api/deliver/list'],
    BIG_Q_SORT_FIELD: "seqNum",//大题排序字段
    SMALL_Q_SORT_FIELD: "seqNum",//学生答案分割
    ENCOURAGE_FROM_PARENT: 1001,  //来自家长的鼓励
    ENCOURAGE_FROM_SELF: 1002,  //来自自身的鼓励
    ENCOURAGE_FROM_TEACHER: 1003,  //来自老师的鼓励
    CLASS_CONTROLL_FLAG: false,//课堂模式
    CORRECT_Q_ERROR_EXP_NULL: 10007,//列式为空
    CORRECT_Q_ERROR_ANS_NULL: 10009,//答语为空
    STRIP_Q_PART_RIGHT: 20001,//拖式半对
    MSG_COMFIRM_PAPER_WORK: 10000,
    MSG_P_CREATE_CLASS: 20000,
    ARCHIVED_STATUS: {//收藏的状态
        ARCHIVED: 1,
        UN_ARCHIVED: 0
    },
    WORK_QUESTION_MAX_COUNT: 15,
    STU_F_IMG: "person/student-f.png",//女学生头像
    STU_M_IMG: "person/student-m.png",//男学生头像
    PARENT_F_IMG: "person/parent-f.png",//女家长头像
    PARENT_M_IMG: "person/parent-m.png",//男家长头像
    TEACHER_F_IMG: "person/teacher-f.png",//女教师头像
    TEACHER_M_IMG: "person/teacher-m.png",//男教师头像

    DEVICE_SCREN_WIDTH: { //设备屏幕宽度
        SMALL: {
            MAX_WIDTH: 768,
            COL_COUNT: 2
        },
        MID: {
            MAX_WIDTH: 1200,
            COL_COUNT: 4
        },
        BIG: {
            MAX_WIDTH: 1920,
            COL_COUNT: 6
        }
    },

    DB_CONTACTS_T: "t_contacts_db",
    DB_MSG_T: "t_msg_db",
    PRAISE_TYPE_LIST: [//表扬类型
        {type: 1, text: '点赞', img: 'praise/thumbsup-ico-g.png', msg: '做的不错，给你点个赞!'},
        {type: 2, text: '鼓励奖', img: 'praise/encourage.png', msg: '加油哦！'},
        {type: 3, text: '最佳作业奖', img: 'praise/best.png', msg: '这次作业你最棒!!'},
        {type: 4, text: '优秀作业奖', img: 'praise/good.png', msg: '做的非常好，继续加油哦!'},
        {type: 5, text: '突出进步奖', img: 'praise/amazing.png', msg: '这次你有很大进步!'},
        {type: 6, text: '老师评价语', img: 'praise/message-t.png'},
        {type: 7, text: '专注奖', img: 'praise/attentive.png', msg: '你今天学习很专心！再主动一点就好了!'},
        {type: 8, text: '主动奖', img: 'praise/positive.png', msg: '你今天学习很主动! 再专心一点就好了!'},
        {type: 9, text: '主动加专心奖', img: 'praise/a-p.png', msg: '你今天学习很棒！既主动又专心!'},
        {type: 10, text: '家长评价语', img: 'praise/message-p.png'},
        {type: 101, text: '学生评价语', img: 'praise/message-s.png'},
        {type: 102, text: '我今天作业不认真，下次改正', img: 'praise/message-s.png', msg: '我今天作业不认真，下次改正!'},
        {type: 103, text: '主动要求做作业的（主动学习奖）', img: 'praise/message-s.png', msg: '我今天学习很主动哦!'},
        {type: 104, text: '做得又快又好（专心学习奖）', img: 'praise/message-s.png', msg: '我今天学习很专心哦!'},
        {type: 105, text: '主动又专心（主动+专心学习奖）', img: 'praise/message-s.png', msg: '我今天学习做到了主动又专心!!'}
    ],
    T_PRAISE_TYPE: {//老师评价类型在上面的数组的type
        FIRST: 1,
        END: 5,
        MSG_TYPE: 50
    },
    S_PRAISE_TYPE: {//老师评价类型在上面的数组的type
        FIRST: 101,
        END: 104,
        MSG_TYPE: 150
    },
    P_PRAISE_TYPE: {//家长评价类型在上面的数组的type
        FIRST: 201,
        END: 205,
        MSG_TYPE: 250
    },

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
        },
        iCode: {
            required: '老师邀请码不能为空!'
        },
        newPass:{
            required: '新密码不能为空!'
        }

    },
    Url: [
        {fromUrl: 'basic_info_manage', toUrl: 'home.clazz_manage'},
        {fromUrl: 'home', toUrl: 'clazz_backup_work'}
    ],
    GAME_NUM: {
        "11": [
            "aa0NumCounting"
            , "comparison"
            , "location"
            , "rule"
            , "complexcomparison"
            , "aa5", "aa5addsub"
        ]
        , "12": [
            "aa8Classification"
            , "aa10", "aa10addsubwithin20"
            , "aa12", "aa12GraphicsSolid"
            , "aa13", "aa13timer"
            , "aa21", "aa21Position"
        ]
        , "13": [
            "aa11", "aa11absubwithin20"
            , "aa14CountingWithin100"
            , "aa17", "aa17addsubwithin100"
            , "aa18 ", "aa18GraphicsPlane"
        ]
        , "14": [
            "aa19", "AA19AddsubWithin100"
            , "aa20AddsubExe"
            , "aa22AddsubExe"
            , "aa23AddsubExe"
        ]
        , "21": [
            "ab1", "ab1Fishing"
            , "ab2", "ab2Shopping"
            , "ab3", "ab3Farm"
            , "ab4", "ab4TranslationSymmetry"
        ]
        , "22": [
            "ab5", "ab5Multiplication1"
            , "ab6", "ab6Measure"
            , "ab7", "ab7DivisionConcept"
            , "ab8", "ab8Multiplication2"
        ]
        , "23": [
            "ab9", "ab9Division"
            , "ab10", "ab10SnowmanPageant"
            , "ab11", "ab11Direction"
            , "ab12a", "ab12aNumber"
            , "ab12b", "ab12bNumber"
        ]
        , "24": [
            "ab15", "ab15GraphicsAbstract"
            , "ab13", "ab13Measure"
            , "ab16", "ab16Time"
            , "ab17", "ab17InvestigationRecording"
            , "ab14a", "ab14aAddSub"
            , "ab14b", "ab14bAddSub"
        ]
        , "31": [
            "ac1", "ac1HybridOperation"
            , "ac3", "ac3IslandArmy"
            , "ac4", "ac4Island"
            , "ac5", "ac5Perimeter"
        ]
        , "32": [
            "ac6a", "ac6aMul"
            , "ac6b", "ac6bMul"
            , "ac7", "ac7Date"
            , "ac8", "ac8Decimal"
        ]
        , "33": [
            "ac9a", "ac9aDivision"
            , "ac9b", "ac9bDivision"
            , "ac10", "ac10Circus"
            , "ac11", "ac11SeabedTreasures"
        ]
        , "34": [
            "ac12", "ac12Quality"
            , "ac13", "ac13EgyptAdventure"
            , "ac14", "ac14NinjaShop"
            , "ac15"
            , "ac19", "ac19i10eChosen", "ac19i10eGame"
        ]
    },
    WORK_TIP_WORD:"布置作业请点击右上方的“布置”按钮",
    CLAZZ_TOOLS_ROUTE:'clazz_tool', //点击课堂工具bar,进入课堂工具列表页的页面router

    EQC_ERROR_TYPE_ITEMS: [
        {txt: '首次做', id: '0'},
        {txt: '当前情况', id: '1'},
    ], //错题集错题概述筛选条件(做错类型)
    EQC_ERROR_COUNT_ITEMS: ["0", "1", "10", "20", "30"], ////错题集错题概述筛选条件(做错人数)
    URL_FROM : {
        OLYMPIC_MATH: 'olympic_math',//来自奥数
        ORDINARY_WORK: 'ordinary_work',//来自普通作业
        OLYMPIC_MATH_T: 'olympic_math_t',//来自老师布置的奥数
        OLYMPIC_MATH_S: 'olympic_math_s'//来自学生布置的奥数
    },

    //公众号二维码图片地址
    GONG_ZHONG_HAO_QRIMG_URL:'http://cdn.allere.static.xuexiv.com/static/img/gongzhonghao_qr2.png',
    WEB_REGISTER_URL:'http://www.xuexiv.com/reg/#/home/'
});
/**
 * 试卷题目类型
 */
constants.constant('questionType',{
    FILL_BLANKS:"fillblanks",                  // 填空题     // 填空(fillblanks)   ，候选得分点类型<standalone, listSetItems, enumSetItems>
    VERTICAL_EXP_CALC:"vertical_exp_calc",     // 竖式计算(vertical-exp-calc)   ，候选得分点类型<vertical>
    VERTICAL_EXP_ERROR:"vertical-exp-error",   // 竖式改错(vertical-exp-error)  ，候选得分点类型<vertical>
    VERTICAL_EXP_BLANK:"vertical-exp-blank",   // 竖式填空(vertical-exp-blank)  ，候选得分点类型<vertical>
    OPTIONS:"options",                         // 选择(options)   ，候选得分点类型<standalone(仅适用单选), selection(单选或多项选择)>
    JUDGEMENT:"judgement",                     // 判断(judgement)  ，候选得分点类型<standalone>
    SOLVE_PROBLEM:"solve-problem",             // 解决问题(solve-problem)   ，候选得分点类型<application>
    SOLVE_VARIABLE:"solve-variable",           // 解方程(solve-variable)  ，候选得分点类型<variable-solve>
    PULL_EXP_CALC:"pull-exp-calc"              // 脱式计算(pull-exp-calc)  ，候选得分点类型<pull-exp>
});
constants.constant('sortConfig', {
    sortByList: [
        {code: 1, name: '得分'}
        , {code: 2, name: '用时'}
        , {code: 4, name: '改错后得分'}
        , {code: 6, name: '最近一次提交时间'}
    ],
    sortBy: window.localStorage.getItem('sortBy') || 1,//排序类型，默认为'得分'
    sortUpOrDown: [
        {
            type: 'down',
            name: '降序',
            selected: window.localStorage.getItem('sortOrder') == 'down'
        }, {
            type: 'up',
            name: '升序',
            selected: window.localStorage.getItem('sortOrder') != 'down'
        }
    ],
    sortOrder:window.localStorage.getItem('sortOrder') ||'up', //排列顺序，默认升序
    showGreenIcon: {//是否显示绿箭头，默认是
        flag: window.localStorage.getItem('showGreenIcon') == 'true'
    }
});
/**
 * 需要添加shardingId的接口集合
 */
constants.constant('needShardingUrlList',[
    //qub
    urlMap.FETCH_UNIT_DIAGNOSE,
    urlMap.FETCH_STUDENT_DIAGNOSE,
    urlMap.FETCH_UNIT_KNOWLEDGE_DIAGNOSE,
    urlMap.FETCH_UNIT_Q_RECORDS,
    urlMap.GET_FAVORITES_Q_LIST,
    urlMap.GET_PAPER_INFO,
    urlMap.DEL_FAVORITES_Q_LIST,
    urlMap.DEL_WORK,
    urlMap.CHECK_WORK,
    urlMap.COPY,
    urlMap.PUBED_WORK_LIST,
    urlMap.WORK_STU_LIST,
    urlMap.EDIT_APPRAISE,
    urlMap.GET_STUDENT_ANS,
    urlMap.GET_Q_REFER_ANSWER_FOR_NEW,
    urlMap.GET_Q_REFER_ANSWER_SAVANT,
    urlMap.ANALYSIS_PAPER,
    urlMap.ANALYSIS_PAPER_REPEAT,
    urlMap.PAPER_SUBMIT,
    urlMap.GET_ERROR_STU_Q,
    urlMap.GET_SCORE_DIST,
    urlMap.DEL_PUB_WORK,
    urlMap.ARCHIVED_PUB_WORK,
    urlMap.RE_DELIVER,
    urlMap.GET_FINISH_VACATION_MESSAGE,
    urlMap.GET_CLAZZ_STUDY_STATISC,
    urlMap.GET_CLAZZ_STUDY_STATISC_NEW,
    urlMap.PUB_WORK,
    urlMap.ADD_FAVORITE,
    urlMap.IS_IN_FAVORITE,
    urlMap.UPDATE_PAPER_INFO,
    urlMap.POST_Q_FEEDBACK_REMOVE_Q,
    urlMap.GET_TROPHY_RANK,
    urlMap.GET_ERROR_INFO_BY_CHAPTER,
    urlMap.GET_ERROR_QUESTION_DETAIL,
    urlMap.GET_ERROR_STUDENT_LIST,
    urlMap.GET_STUDENT_ERROR_INFO,
    urlMap.CREATE_ERROR_REDO_PAPER,
    //game
    urlMap.PUBED_GAME_LIST,
    urlMap.GAME_SUBMIT,
    urlMap.PUB_GAME,
    urlMap.ISPUB_GAME,
    urlMap.GET_PUB_GAMES,
    urlMap.GET_PUB_GAME_LEVELS,
    urlMap.UPDATE_PUB_GAME,
    urlMap.DEL_PUB_GAME,
    urlMap.UPDATE_NEW_GAME_STATUS,
    urlMap.RESET_GAME,
    urlMap.GET_GAME_STATS,
    urlMap.GET_ERROR_BYCLASS,
    urlMap.GET_ERROR_BYSTU,
    urlMap.GET_HRD_QUESTION_ANS,
    urlMap.GET_GAME_CGCID,
    //速算
    urlMap.GET_RAPID_CALC_COUNT,
    urlMap.GET_RC_LEVELS_NAME,
    urlMap.GET_COMPETITION_PAPER_INFO_TEACHER,

    //排行
    urlMap.GET_GAME_STAR_RANK,
    urlMap.GET_FEATURE_SWITCH,

    urlMap.GET_STU_WORK_REPORT,
    urlMap.FETCH_DIAGNOSE_REPORT,
    urlMap.WORK_STU_LIST_FINAL_ACCESS,
    // urlMap.COMPETITION_DISTRICT_AVERAGE
    "/qbu/api/area/deliver/listMore",
    "/qbu/api/simpleStatics/paperReport",
    urlMap.HOLIDAY_WORK_STATISTICS_PAPER_REPORT
]);