/**
 * state初始化数据,所有异步flag需要在App启动时使用默认值的flag,名称以ing结尾
 */

export let feedback = {
    isSuggestionSubmitProcessing: false, //正在提交意见
    imgs: null,
    suggestionWord: null //意见
};
export let app_info = {
    appVersion: null,
    changeLog: null,
    errorInfo: null,
    onLine: true
};
export let profile_achievement = {
    isFetchAchievementProcessing: false,
    achievementList: null,
    errorInfo: null
};
export let profile_clazz = {
    isFetchClazzProcessing: false,//表示是否正在获取班级列表
    clazzList: null, //班级列表
    passClazzList: null,//通过审核的班级列表
    selectedClazz: null,
    errorInfo: null,
    selfStudyClazzList: null //自学班
};
export let profile_user_auth = {
    isLogInProcessing: false,//表示是否正在执行登录请求
    isCheckValidSessionProcessing: false,//是否正在检查session是否有效
    user: {},//登录用户的信息
    isLogIn: false,//是否登录成功
    logoutByUser: true, //用户是否是主动退出的
    errorInfo: null,
    hasCheckedOlympicChangeAd:false, // 奥数付费用户是否已查看了奥数升级广告
};

export let unit={
    textbooks:[],//教材
    selectedTextbook:{},//选中的教材
    isFetchUnitProcessing:false,//是否正在获取unit数据
    unitList:null,//单元列表
    selectedUnit:null,//选中的单元
    unitHasChanged:false,//选中的标签是否改变过
    errorInfo:null
};




export let wl_is_worklist_loading = false; //是否正在获取试卷列表
export let wl_is_fetch_status_loading = false; //是否正在获取作业状态
export let wl_is_fetch_paper_loading = false; //是否正在获取试卷详情
export let wl_is_fetch_doPaper_loading = false; //是否正在获取试卷题目详情
export let wl_is_paper_submitting = false; //是否正在提交试卷
export let wl_is_post_answer_loading = false; //是否正在保存试卷答案
export let wl_is_student_praise_loading = false; //是否正在提交评价

export let wl_is_local_ans_changed = {}; //是否有新的试卷答案保存在本地

export let wl_clazz_list_with_works = {};
export let wl_cache_papers={};//将所有未提交的作业缓存在这里
export let wl_class_with_pagination_info={};//每一个班级对应的分页信息
export let wl_pagination_info = {
    lastKey: 0, quantity: 20
}; //试卷列表分页信息
export let wl_selected_clazz = {}; //选择的班级
export let wl_selected_work = {}; //选择的试卷

export let clazz_with_study_stati={};//不同班级对应的学情
export let fetch_study_stati_processing=false;//是否正在加载学情

/**----------- 诊断相关 start-------------**/
export let diagnose_selected_textbook={};//诊断当前选中的教材
export let diagnose_selected_grade={};//诊断当前选中的年级
export let diagnose_selected_clazz={};//诊断当前选中的班级
export let fetch_home_stati_processing=false;//是否正在加载主页诊断统计
export let diagnose_home_with_statistic={};//诊断主页过滤条件所对应的诊断
export let home_select_chapter={};//诊断主页选中章节
export let chapter_select_point={};//章节选中知识点
export let fetch_chapter_diagnose_processing=false;//是否正在加载章节诊断
export let knowledge_with_question={};//诊断知识点所对应的试题
export let knowledge_with_report={};//诊断知识点所对应的诊断报告
export let fetch_diagnose_report_processing=false;//是否正在加载诊断诊断

export let diagnose_clazz_with_unit={};//诊断当前选中的班级所包含的单元信息
export let unit_with_diagnose_stati={};//不同的单元对应的诊断统计
export let chapter_with_diagnose_stati={};//不同的单元对应的诊断统计
export let fetch_unit_stati_processing=false;//是否正在加载单元对应的诊断统计
export let diagnose_goods_menus_list={};//诊断中的商品列表
export let fetch_goods_menus_processing=false;//是否正在加载商品信息
export let fetch_chapter_stati_processing=false;//是否正在加载章节对应的诊断统计
export let fetch_unit_knowledge_stati_processing=false;//是否正在加载子知识点的诊断统计
export let unit_select_chapter={};//在诊断总页面选中的章节。
export let unit_select_knowledge={};//在诊断总页面选中的子知识点。
export let fetch_q_records_processing=false;//是否正在加载获取做题记录。
export let fetch_error_q_records_processing=false;//是否正在加载获取错题记录。
export let q_records_pagination_info={//做题记录的分页信息
    lastKey: 0, quantity: 16
};
export let fetch_diagnose_question_processing=false;//是否正在加载试题。
export let go_to_do_question={   //去做题，1表示错题，2表示新题
    type:1
};
export  let diagnose_submit_q_processing=false;//是否正在提交试题
export  let knowledge_selected_q=null;//知识点下获取的试题
export let fetch_diagnose_textbook_processing=false;//是否正在诊断的选择教材
export let diagnose_entry_url_from = {
    urlFrom:''
};//进入诊断提分的入口url

/**----------- 诊断相关 end-------------**/

/**----------- 奥数相关 start-------------**/
export let olympic_math_selected_clazz={};//奥数当前选中的年级
export let olympic_math_selected_grade={};//奥数当前选中的班级
export let work_list_route={};//作业列表的入口来源

/**----------- 奥数相关 start-------------**/

/**----------- 信息相关 start-------------**/
export let trophy_selected_clazz={};//奖杯排行当前选中的班级
export let trophy_selected_time={};//奖杯排行当前选中的时间
export let clazz_year_with_trophy_rank={};//不同的单元对应的诊断统计
export let fetch_trophy_rank_data_processing=false;//是否正在加载子奖杯排行数据
export let fetch_game_star_rank_data_processing=false;//是否正在加载星星排行数据
export let clazz_with_game_star_rank_data={};//星星排行数据
// export let game_star_rank_selected_clazz={};//星星排行选择的班级
export let fetch_fighter_rank_data_processing=false;//是否正在加载斗士排行数据
export let clazz_with_fighter_rank_data={};//斗士排行数据
// export let fighter_rank_selected_clazz={};//斗士排行选择的班级


/**----------- 信息相关 end-------------**/

export let wl_paper_answer = {}; //试卷答案

// export let compute_selected_clazz = {}; //速算选择的班级信息

export let selected_good= {}; //选中的商品

export let wxpay_created_order_info = { //微信支付信息
    app:{}, //微信支付
    scan:{} //微信扫码支付信息
};
export let wxpay_create_order_info_processing = false;
export let wxpay_query_order_processing = false;

export let wxpay_detail_list={};//微信支付详情
export let wxpay_detail_fetch_processing = false;

export let group_buying_goods_list={};//团购商品列表
export let group_buying_goods_list_fetch_processing = false;//获取团购商品列表状态

export let query_group_buying_order_processing = false;//获取团购订单状态
export let group_buying_create_order_info_processing = false; //团购下单状态
export let group_buying_selected_good= {}; //团购的商品详情
export let group_buying_created_order_info = { //团购微信支付信息
    app:{}, //微信支付
    scan:{} //微信扫码支付信息
};
//////////奥数支付
export let mo_goods_menus_list = {};//奥数商品列表
export let fetch_wei_xin_pay_02_goods_processing = false; //获取商品选择列表状态
export let fetch_wei_xin_pay_02_create_order_processing = false; //创建订单状态
export let fetch_wei_xin_pay_02_order_processing = false; //查询订单的状态
export let wei_xin_pay_02_select_good = {};//选择的商品
// export let wei_xin_pay_02_created_order_info = {};//订单信息
export let wei_xin_pay_02_created_order_info = { //订单信息
    app:{}, //微信支付
    scan:{} //微信扫码支付信息
};

export let wei_xin_pay_02_select_grade={};//选择的年级

/**----------- growing start-------------**/
export let growing_get_pub_msg={ //发布相关的数据
    statusList:[], //谁可见
    labelList:[], //标签数组
    typeList:[], //类别数组
};
export let growing_pub_msg_processing = false;
export let growing_get_myself_record_list_processing = false;
export let growing_myself_record_list={
        recordList:[],
        headImg:"", //头像
        totalCount:0, //同学更新的消息数目
    }; //个人记录
export let growing_get_classmate_record_list_processing = false;
export let growing_classmate_record_list={
    recordList:[],
    headImg:"", //头像
    selectedClassmate:{
        userId:"",
        userName:"",
        userGender:0
    }, //选择的同学信息
}; //同学记录
export let growing_selected_clazz = {}; //获取同学列表时选择的班级
export let growing_selected_classmate_list = []; //获取的同学列表
export let growing_get_selected_classmate_list_processing = false;//获取的同学列表
export let growing_get_impeach_reason_processing = false; //获取举报
export let study_statis_params = false; //store上面的学情参数
export let growing_impeach_reason={
    reasonList:[], //举报理由
    residueCount:[] //剩余的举报次数
};

export let growing_one_clazz_record_info ={//朋友圈消息列表
    recordList:[],
    seq:1,
    hasMore:true,
    selectedClazz:{}, //朋友圈显示哪个班级的消息  当发布新消息或者班级列表修改班级时修改
};
export let growing_one_clazz_record_info_processing = false;
/**----------- growing end-------------**/

export let sharding_clazz = {};
/** ----------------积分信息-------------------- */
export let user_reward_base={};
export let get_user_reward_base_processing = false;
export let update_user_reward_base_processing = false;

export let fetch_level_name_list_processing = false;
export let level_name_list = {};

/** -------------------作业报告--------------------- */
export let work_report_info = {
    paperName:"",
    totalScore:"",
    paperId:'',//试卷ID
    quantityOfMasterLevel:null, //学生掌握情况
};
/**
 *  knowledgeId: ['quesList']
 * */
export let ques_record = {

};
export let select_work_knowledge = {
    knowledgeId:'',
    knowledgeName:'',
    chapterId:''
};

export let diagnose_ad_dialog_flag = false;

export let smart_training_camp_info = {}; //学霸训练营数据
export let get_smart_training_camp_reward_processing = {}; //领取学霸训练营奖励

export let diagnose_camp_goods = {
    list:[],
    desc: {
        planA: {
            value: '12-month',
            joinFee: 299,
            title: 'A计划',
            subTitle:'三年学籍期',
            type: 'planA',
            reward: ["三年期内任意时候，首次完成邀请2名同学加入学霸训练营，发放“共同进步奖” ￥499元，立即支付至用户原付费账户",
                "三年期满，发放“学霸奖” ￥499元，立即支付至用户原付费账户",
                "以上两奖不可叠加"
            ]
        },
        planB: {
            value: '12-month',
            joinFee: 499,
            title: 'B计划',
            type: 'planB',
            reward: ["三年期内任意时候，首次完成邀请2名同学加入学霸训练营，发放“共同进步奖” ￥299元，立即支付至用户原付费账户",
                "三年期满，发放“学霸奖” ￥299元，立即支付至用户原付费账户",
                "以上两奖不可叠加"

            ]
        }
    }
};
export let fetch_diagnose_camp_goods_processing = false;

//宠物蛋
export let pet_info = {
    foodArr:[
        {id:'',count:1,name:'可口饼干',foodId:1,experience:2},
        {id:'',count:0,name:'宠物汉堡',foodId:2,experience:3},
        {id:'',count:0,name:'魔法棒',foodId:3,experience:5}
    ],
    petArr:[
        {id:'',name:'小恐龙',text:'幼年期',type:0,growthValue:10,growthLimit:50,phase:1,process:'-80%'},
        {id:'',name:'小熊猫',text:'青年期',type:0,growthValue:0 ,growthLimit:0,phase:0,process:'-100%'},
        {id:'',name:'小狗狗',text:'飞升期',type:0,growthValue:0 ,growthLimit:0,phase:0,process:'-100%'}
    ],
    hasHatchEggs:false,
    showAdAuto:false,//自动显示广告
    firstGuide:true, //第一次宠物驯养引导
    sharePetSuccess:false, //分享成功返回
    canGetReward:true, //可以领取分享奖励
};

//接受到的老师的信的信息
export let teacher_create_msg_info={
    createTime:''
};

export let oral_calculation_limittime = {};
export let final_access_limittime = {};

//各种活动广告显示flag
export let profile_show_flag = {
    is_during_national_day:false, //表示国庆活动期间flag
    has_clicked_national_day_gift_package:false, //是否已经首次点击过了国庆礼包的flag
    has_clicked_national_day_gift_package_11_11:false, //是否已经首次点击过了双11礼包的flag

};

export let increase_score_goods_menus_list=[
    {
        desc: {
            fee: "10",
            subTitle: "不限年级，不限册数，20个考点的提分特权",
            title: "20个考点特权包"
        },
        id: "ZD-TF-001",
        totalFee: 1000
    },
    {
        desc: {
            fee: "99",
            subTitle: "一年级上册所有考点提分特权",
            title: "一年级上册考点特权包"
        },
        id: "ZD-TF-002",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "一年级下册所有考点提分特权",
            title: "一年级下册考点特权包"
        },
        id: "ZD-TF-003",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "二年级上册所有考点提分特权",
            title: "二年级上册考点特权包"
        },
        id: "ZD-TF-004",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "二年级下册所有考点提分特权",
            title: "二年级下册考点特权包"
        },
        id: "ZD-TF-005",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "三年级上册所有考点提分特权",
            title: "三年级上册考点特权包"
        },
        id: "ZD-TF-006",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "三年级下册所有考点提分特权",
            title: "三年级下册考点特权包"
        },
        id: "ZD-TF-007",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "四年级上册所有考点提分特权",
            title: "四年级上册考点特权包"
        },
        id: "ZD-TF-008",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "四年级下册所有考点提分特权",
            title: "四年级下册考点特权包"
        },
        id: "ZD-TF-009",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "五年级上册所有考点提分特权",
            title: "五年级上册考点特权包"
        },
        id: "ZD-TF-010",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "五年级下册所有考点提分特权",
            title: "五年级下册考点特权包"
        },
        id: "ZD-TF-011",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "六年级上册所有考点提分特权",
            title: "六年级上册考点特权包"
        },
        id: "ZD-TF-012",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "六年级下册所有考点提分特权",
            title: "六年级下册考点特权包"
        },
        id: "ZD-TF-013",
        totalFee: 9900
    },
];//诊断提分中的商品列表
export let first_submit_work_after_update = true; //诊断提分付费修改（改为考点付费）更新后首次提交作业