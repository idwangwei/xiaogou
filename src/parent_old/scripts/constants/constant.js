/**
 * Created by 彭建伦 on 2015/7/13.
 */

import  constants from './index';
import  buildCfg from 'default';

var backend = buildCfg.backend + '/door' || '192.168.0.161:9080/door';
var backendIp = 'http://' + backend;
var img_server = buildCfg.img_server || '192.168.0.161';
constants.constant('serverInterface', {
    BASE: backendIp,
    IMG_SERVER: img_server,
    GET_SESSION_ID: backendIp + '/vc/getSID',//获取session id
    CHECK_ISVALID_SESSION: backendIp + '/checkIsValidOfSession',
    LOGIN: backendIp + '/login/parent',  //登录
    LOGOUT: backendIp + '/parent/logout', //退出
    REGISTER: backendIp + '/register/parent',//家长注册
    REGISTER_WITH_CHILDREN:backendIp+'/register/createParentAndStudent',//家长注册，同时为学生注册
    GET_TEACHER_NAME_BY_CLASS_ID:backendIp+'/class/getTeacherName',//家长注册，校验当前输入的班级号是否正确。
    REGISTER_STUDENT: backendIp + '/register/pCreateS',//家长给学生注册
    GET_VALIDATE_IMAGE: backendIp + '/rc',//获取图片验证码
    VALIDATE_IMAGE_V_CODE: backendIp + '/vc/validateImgVC',//验证图形验证码
    APPLY_REFER_PHONE_V_CODE: backendIp + '/vc/getTelVC',//请求手机验证码
    CHANGE_DEVICE_PHONE_V_CODE: backendIp + '/vc/getChangingDevVC',//请求设备更换的手机验证码
    VALIDATE_REFER_PHONE_V_CODE: 'json/validateReferPhoneVCode.json',//验证手机验证码
    GET_QR_CODE: backendIp + '/vc/getQRCode', //获取二维码
    ALLOW_DEVICE: backendIp + '/parent/allowDevice',//查看自己是否被允许登录
    ALLOW_CODE: backendIp + '/parent/allowQRCode',//扫描二维码并允许或者拒绝其它设备登录
    VALIDATE_SECURITY: 'json/validateSecurity.json',//验证密保答案
    APPLY_EMAIL_VALIDATE: backendIp + '/rest/applyEmailValidate',//请求邮箱验证
    APPLY_PHONE_PASSWORD_V_CODE: backendIp + '/vc/getTelVCByLN',//请求手机验证码（密码找回专用）
    APPLY_REFER_PHONE_INFO: backendIp + '/parent/getPhone',//请求手机后四位
    APPLY_REFER_PHONE_INFO_CHILDREN: backendIp + '/parent/getPhoneAndChildren',//请求手机后四位以及学生信息
    APPLY_REFER_EMAIL_INFO: backendIp + '/rest/applyReferEmailInfo',//请求邮箱后四位
    RESET_PASSWORD: backendIp + '/parent/resetPW',//重置密码
    GET_PW_PRO_QUESTION: backendIp + '/parent/getPwProQuestion',//获取密保信息
    SAVE_PW_PRO_QUESTION: backendIp + '/parent/savePwProAnswers',//保存密保信息
    RESET_TELEPHONE: backendIp + '/parent/resetTelephone',//保存关联手机信息
    CHECK_PW_PRO_QUESTION: backendIp + '/parent/validatePwProAnswers',//验证密保信息
    RESET_PWD: backendIp + '/parent/resetChildPW',  //家长修改学生密码

    SAVE_BASE_INFO: backendIp + '/parent/completeInfo',//保存用户基本信息
    GET_BASE_INFO: backendIp + '/parent/info',//获取用户基本信息

    GET_USER_LIST_BY_PHONE:backendIp+'/um/userBaseInfo', //通过手机号码获取相关账号

    EDIT_STUDENT_BY_ID: backendIp + '/student/pUpdate',//根据学生id修改学生信息
    DEL_STUDENT_BY_ID: backendIp + '/student/pDelete',//根据学生id删除该学生
    P_CREATE_STU_CLASS: backendIp + '/class/pCreateStuClass',//家长为学生添加班级
    P_GET_STU_CLASS: backendIp + '/class/pGetStuClasses',//家长查询到该子女所参加的班级列表信息
    P_GET_STU_AND_CLASS: backendIp + '/um/parent/getStudentsAndClasses',//家长获取所有孩子，以及每个孩子所拥有的班级
    //P_GET_STU_CLASS:'json/stuClasses.json',//家长查询到该子女所参加的班级列表信息
    P_DEL_STU_CLASS: backendIp + '/class/pDelStuClass',//家长真实删除学生班级
    GET_CLASS_INFO: backendIp + '/class/getClassInfo',//家长查询班级ID的班级基本内容
    //GET_CLASS_INFO:'json/stuClassDetail.json',//家长查询班级ID的班级基本内容
    GET_STUDENT_LIST: backendIp + '/student/pList',//获取家长的学生列表
    //GET_STUDENT_LIST:'json/pList.json',
    GET_STUDENT_CLASSES: 'json/getStudentClasses.json',//获取学生已加入或者正在申请加入的班级
    //SEND_ADD_CLASS_APPLY: 'json/sendAddClassApply.json',//学生添加班级申请
    SEND_ADD_CLASS_APPLY: backendIp + '/class/pCreateStuClass',//学生添加班级申请

    GET_WORK_LIST: backendIp + '/qbu/api/simpleStatics/paperHistory', //作业列表
    GET_PAPER_STATUS:backendIp+'/qbu/api/paper/getStatus', //获取作业状态
    GET_FINAL_ACCESS_PAPER_STATUS:backendIp+'/competition/paper/status', //获取期末测评作业状态
    SELECT_APPRAISE_LIST: backendIp +'/um/appraise/comment/parent',//获取评价列表选择
    PAPER_GET: backendIp + '/qbu/api/paper/get',//根据作业id获取作业和学生答案
    GET_Q_REFER_ANSWER: backendIp+'/qb/paper/getQReferAnswer',//获取输入框答案
    GET_Q_REFER_ANSWER_FOR_NEW: backendIp+'/dqb/question/getQReferAnswer',//获取输入框答案针对新增小题
    GET_Q_REFER_ANSWER_FOR_BOOKMARK: backendIp+'/qbu/api/bookMark/referenceAnswer',//获取输入框答案针对我的收藏
    GET_Q_REFER_ANSWER_SAVANT: backendIp+'/qbu/api/paper/excellentAnswer',//获取学霸的解答

    GET_FINISH_VACATION_MESSAGE: backendIp+"/qbu/api/schedule/newFinishVacationMessage",//获取暑假作业最新情况

    GET_TOP_RANK_LIST: backendIp + '/qbu/api/simpleStatics/topRank',//获取排名

    PAPER_GET_DETAIL: backendIp + '/qb/paper/get',//根据作业id获取作业

    GET_MSG_LIST: 'json/message_list.json',     //消息列表
    GET_MSG_DETAIL: 'json/message_detail.json', //消息明细

    POST_Q_FEEDBACK: backendIp + '/um/feedback/question/save',  //提交试题报错
    POST_Q_FEEDBACK_REMOVE_Q:backendIp +  '/qbu/api/deliver/mvQuestion',  //提交试题报错--移除试题

    SAVE_SECOND_P: backendIp + '/register/pCreateSG',//家长邀请第二监护人
    GET_SECOND_P_INFO: backendIp + '/parent/guardians',//家长邀请第二监护人
    DELETE_SECOND_P: backendIp + '/register/pDeleteSG', //删除第二监护人
 
    P_CONFIRM_APPRAISE: backendIp + '/um/appraise/saveOrUpdate/parent',//家长端评价
    GET_APPRAISE_DATA: backendIp + '/um/appraise/detail/parent',//家长端获取评价
    GET_APPRAISE_DATA_T: backendIp + '/um/appraise/detail/teacher',//获取评价数据
    GET_APPRAISE_DATA_S: backendIp + '/um/appraise/detail/student',//获取评价数据

    GET_GAME_DATA: backendIp + '/game/rest/knowledge/getStuGameGrades', //获取游戏列表
    IS_GAME_CAN_PLAY:backendIp+'/game/rest/knowledge/isGameCanPlay',      //判断这个游戏是否被老师调整
    GET_PUB_GAME_LEVELS:backendIp+'/game/rest/knowledge/getPlayGame', //获取玩游戏返回的游戏结算
    GET_ERROR_BYSTU: backendIp + '/game/rest/statistics/errorPerson',  //获取个人错误统计
    POST_FEEDBACK: backendIp + '/um/feedback/suggestion/save',  //提交问题反馈

    GET_WINTER_BROADCAST_DATA:backendIp + "/ms/api/schedule/newFinishVacationMessage", //获取寒假作业的广播数据

    // GET_IS_EXTENSIONNER_FLAG:backendIp + "/um/extension/isExtensionner", //判断用户是不是代理
    // GET_PARENT_IS_TEACHER_FLAG:backendIp + "/um/extension/isTeacher", //判断家长是不是老师
    // GET_PROMOTE_DETAILS:backendIp + "/um/extension/outline", //获取收益详情
    // GET_OTHER_PERSON_PROMOTE_DETAILS:backendIp + "/um/extension/search", //根据输入的账号查询他人收益详情
    // APPLY_FOR_AGENCY:backendIp + "/um/extension/generateExtensionner", //申请成为代理
    // GET_MYSELF_PROMOTE_PERSON:backendIp + "/um/extension/detail", //查询自己的推广人

    GET_IS_EXTENSIONNER_FLAG:backendIp + "/um/userProxy/isProxy", //判断用户是不是代理
    GET_PARENT_IS_TEACHER_FLAG:backendIp + "/um/userProxy/canBeProxy", //判断家长是不是老师
    GET_PROMOTE_DETAILS:backendIp + "/um/userProxy/outline", //获取收益详情
    GET_OTHER_PERSON_PROMOTE_DETAILS:backendIp + "/um/userProxy/search", //根据输入的账号查询他人收益详情
    APPLY_FOR_AGENCY:backendIp + "/um/userProxy/generateProxy", //申请成为代理
    GET_MYSELF_PROMOTE_PERSON:backendIp + "/um/userProxy/detail", //查询自己的推广人

    PARENT_SHARE_GET_REWARD: backendIp +'/credits/user/parentPopularize', //家长端首次分享成功学生端添加200积分
    GET_XLY_VIP_AGENT_PAY_LIST: backendIp +'/vip/agent/getOrderList', //获取训练营推广列表


});
/**
 * 数据常量
 */
constants.constant('finalData', {
    HTTPS_URL_REG: new RegExp("(login)|(register)|(um\/userBaseInfo)"),//匹配需要加https请求的url
    HTTPS_EXCLUDE_161_REG: new RegExp("192.168.0.161"),//匹配需要排除加https请求的url
    BUSINESS_TYPE:{
        QBU:'qbu',
        QBU_S:'qbu-s',
        GAME:'game',
        STATS:'statistics'
    },
    DEVICE_TYPE: "1",//设备类型，目前暂时用于无法判断客户端设备为手机还是平板，1为手机，2为平板，3为pc，4为未知
    TYPE_PARENT: "P", //家长类型
    TYPE_TEACHER: "T", //老师类型
    RESPONSE_CODE: [200,      //获取数据成功
                    601,
                    602,
                    603,
                    604,      //找不到账户信息
                    605,
                    300,      //参数不能为空
                    620],     //已经申请了该班级，不能再申请
    BIG_Q_SORT_FIELD: "seqNum",//学生答案分割
    SMALL_Q_SORT_FIELD: "seqNum",//学生答案分割
    ANSWER_SPLIT_FLAG: "#",
    CORRECT_Q_ERROR_EXP_NULL: 10007,//列式为空
    CORRECT_Q_ERROR_ANS_NULL: 10009,//答语为空
    STRIP_Q_PART_RIGHT: 20001,//拖式半对
    STU_F_IMG:"person/student-f.png",//女学生头像
    STU_M_IMG:"person/student-m.png",//男学生头像
    PARENT_F_IMG:"person/parent-f.png",//女家长头像
    PARENT_M_IMG:"person/parent-m.png",//男家长头像
    TEACHER_F_IMG:"person/teacher-f.png",//女教师头像
    TEACHER_M_IMG:"person/teacher-m.png",//男教师头像
    PASSWORD_MAX_LENGTH:6,//密码最大支持多少位
    STU_CLAZZ_STATUS:{
        NO_CLAZZ:1, //没有班级
        ALL_CLAZZ_NOT_PASSED:2, //所有班级都未审核通过
        ANY_CLAZZ_PASSED:3,//已有班级审核通过。
        ALL_CLAZZ_PASSED:4  //所有班级都通过了
    },
    DB_CONTACTS_P: "p_contacts_db",
    DB_MSG_P: "p_msg_db",
    JPUSH_MSG_EVENT: "receiveJpushMsg",
    PRAISE_TYPE_LIST: [//表扬类型
        {type: 1, text: '点赞', img: 'praise/thumbsup-ico-g.png',msg:'做的不错，给你点个赞!'},
        {type: 2, text: '鼓励奖',img:'praise/encourage.png',msg:'加油哦！'},
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
    WORK_TYPE:{
        SUMMER_WORK:4, //暑假作业
        WINTER_WORK:5,  //寒假作业
        MATCH_WORK:8  //比赛作业
    },
    VALIDATE_MSG_INFO: {
        userName: {
            required: '账号不能为空!'
        },
        relationShip: {
            validateSelect: '请选择与学生的关系！'
        },
        realName: {
            required: '姓名不能为空!'
        },
        clzIds: {
            required: '请输入班级号！',
            validateClazz:"输入的班级号存在！"
        },
        gender: {
            required: '请选择性别！'
        },
        loginName: {
            required: '账号不能为空!'
        },
        studentName: {
            required: '学生姓名不能为空'
        },
        classNumber: {
            required: '班级名称不能为空'
        },
        cellphone: {
            required: '手机号码不能为空!',
            pattern: '手机号码格式不正确!'
        },
        name1: {
            required: '姓名不能为空!'
        },
        password: {
            required: '密码不能为空!'
        },
        newPass: {
            required: '密码不能为空!'
        },
        confirmPassword: {
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
        secondPhone: {
            required: '第二监护人的手机号不能为空!!',
            pattern: '第二监护人的手机号格式不正确!'
        },
        secondName: {
            required: '第二监护人的姓名不能为空!'
        },
        secondPassword: {
            required: '密码不能为空!'
        },
        relationship: {
            required: '与学生的关系不能为空!'
        },
        iCode: {
            required: '学生邀请码不能为空!'
        }
    },
    START_ICON: {
        fullStar: 'other/full_star.png',
        halfStar: 'other/half_star.png',
        emptyStar: 'other/empty_star.png'
    },
    homeOrClazz: {
        type: 2
    },

    //公众号二维码图片地址
    GONG_ZHONG_HAO_QRIMG_URL:'http://cdn.allere.static.xuexiv.com/static/img/gongzhonghao_qr2.png'
});
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
    CIRCLE_IMG_0: 'circle_img/circle_icon0.svg',
    CIRCLE_IMG_1: 'circle_img/circle_icon1.svg',
    CIRCLE_IMG_2: 'circle_img/circle_icon2.svg',
    CIRCLE_IMG_3: 'circle_img/circle_icon3.svg',
    CIRCLE_IMG_4: 'circle_img/circle_icon4.svg',
    CIRCLE_IMG_5: 'circle_img/circle_icon5.svg',
    CIRCLE_IMG_6: 'circle_img/circle_icon6.svg',
    CIRCLE_IMG_7: 'circle_img/circle_icon7.svg',
    CIRCLE_IMG_8: 'circle_img/circle_icon8.svg',
    CIRCLE_IMG_9: 'circle_img/circle_icon9.svg'
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
