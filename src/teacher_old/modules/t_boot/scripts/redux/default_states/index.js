export let wr_chapter_with_paperlist = {
    chapterName: '',
    paperList: {},
    mine: {},
    minePageInfo: {size: 16, lastKey: ''},
    canLoadMore: false,
    needHideRapid:{}
};

export let wr_fetch_paper_processing = false;
export let wr_fetch_paperlist_processing = false;
export let wr_fetch_textbook_processing = false;
export let wr_fetch_chapter_processing = false;

export let wr_gen_paper_criteria = {
    paper_name: "",
    difficulty: "",
    criteriaList: []
};
export let wr_fetch_paper_criteria_processing = false;
export let wr_gen_paper_processing = false;
export let wr_selected_paper = {};
export let wr_selected_unit = {};
export let wr_selected_textbook = {};
export let wr_selected_knowledge = {};
export let wr_textbooks = [];
export let profile = {};
export let wr_unit_points = {};
export let wr_fetch_unit_points_processing = false;
export let wr_fetch_mine_paperlist_processing = false;
export let wr_gen_paper_data_processing = false;
export let wr_modify_mine_paper_processing = false;

export let gr_chapter_with_games = {};
export let gr_fetch_game_processing = false;
export let gr_fetch_textbook_processing = false;
export let gr_fetch_textbooks_processing = false;
export let gr_selected_textbook = {};
export let gr_textbooks = [];
export let gr_textbook_detail_map = {};
export let gr_selected_chapter = {};
export let gr_chapter_gamelist_map = {};

export let clazz_list = [];
export let fetch_clazz_list_processing = false;
export let wl_fetch_work_list_processing = false;
export let wl_fetch_archived_list_processing = false;
export let wl_clazz_list_with_work = {};
export let wl_clazz_ae_list_with_work = {};
export let wl_clazz_list_with_archived = {};
export let wl_selected_clazz = {};
export let wl_selected_work = {
    paperData: {},
    paperName: "",
    instanceId: "",
    paperId: "",
    publishType: "",
    groupName: "",
    assigneeDisplay: "",
    stu: {}
};
export let wl_page_info = {lastKey: '', quantity: 16};

export let wl_archived_page_info = {lastKey: '', quantity: 16};
export let wl_fetch_student_list_processing = false; //获取该试卷做题状态的学生列表异步flag
export let wl_fetch_work_data_processing = false; //获取试卷内容异步flag

export let profile_set_user_info_processing = false;
export let profile_change_refer_cellphone_processing = false;
export let profile_change_security_info_processing = false;
export let profile_fetch_security_question_list_processing = false;

/**--------------------- profile  start--------------------------**/

export let profile_user_auth = {
    isLogInProcessing: false,//表示是否正在执行登录请求
    isCheckValidSessionProcessing: false,//是否正在检查session是否有效
    user: {},//登录用户的信息
    isLogIn: false,//是否登录成功
    logoutByUser: true, //用户是否是主动退出的
    errorInfo: null
};

export let profile_login_processing = false; //用户异步flag

/**--------------------- profile  end--------------------------**/
export let wl_statistics_error_info = {
    questionTitle: '',
    errorStudentList: []
};
export let wl_fetch_statistics_error_info_processing = false;

//班级
export let cm_select_clazz_info = {}; //当前选择修改的班级信息
export let cm_select_clazz_processing = false; //当前选择修改的班级信息
export let cm_change_select_clazz_info_processing = false; //修改班级信息
export let cm_add_clazz_status = true; //是否是添加班级
export let cm_add_clazz_processing = false; //添加班级
export let cm_toggle_apply_tunnel_processing = false; //切换班级申请通道
export let cm_fetch_adding_stu_list_processing = false; //获取申请的学生列表
export let cm_deal_add_stu_request_processing = false; //处理添加学生的请求
export let cm_fetch_added_stu_list_processing = false; //获取审核通过的学生列表
export let cm_added_stu_list = {}; //已经通过审核的学生信息
export let cm_select_stu_detail = {student: '', parent: ''}; //学生的详细信息
export let cm_fetch_stu_detail_processing = false; //获取学生信息详情
export let cm_del_stu_processing = false; //删除学生
export let cm_stu_level_change_processing = false; //改变学生分层

//游戏
export let force_gl_update_flag = false;
export let game_list = {};
export let game_statistics = {};
export let gl_request_status = {
    del_game_processing: false,
    move_game_processing: false,
    get_game_list_processing: false,
    get_game_stats_processing: false
};
export let gl_selected_clazz = {
    name: '',
    id: ''
};
//速算
export const rc_selected_clazz = {
    name: '',
    id: 0,
    grade: ''
}
export const rapid_calc_list = [];
export const student_list = {};
export const work_statis_list = {};
export const study_statis_params = {};//学情统计的参数

/**--------------------- diagnose  start--------------------------**/
export let diagnose_textbooks=[];//教材
export let diagnose_selected_textbook={};//选中的教材
export let fetch_diagnose_unit_processing=false;//是否正在获取unit数据
export let diagnose_selected_unit=null;//选中的单元
export let diagnose_unit_has_changed=false;//选中的标签是否改变过

export let diagnose_selected_clazz={};//诊断当前选中的班级
export let diagnose_clazz_with_unit={};//诊断当前选中的班级所包含的单元信息
export let unit_with_diagnose_stati={};//不同的单元对应的诊断统计
export let stu_with_diagnose_stati={};//不同的学生的总诊断信息
export let fetch_diagnose_unit_stati_processing=false;//是否正在加载单元对应的诊断统计
export let fetch_student_diagnose_statistic_processing=false;//是否正在加载学生对应的诊断统计
export let fetch_dianose_unit_knowledge_stati_processing=false;//是否正在加载子知识点的诊断统计
export let diagnose_unit_select_knowledge={};//在诊断总页面选中的子知识点。
export let knowledge_with_diagnose_stati={};//不同的子知识点对应的诊断统计
export let diagnose_unit_select_stu={};//单元诊断页面选中的学生
export let diagnose_knowledge_select_stu={};//班级诊断页面选中的学生
export let stu_with_records_diagnose={};//不同的学生的诊断记录
export let fetch_diagnose_q_records_processing=false;//是否正在加载获取做题记录。
export let fetch_diagnose_textbook_processing=false;//是否正在加载教材。
export let diangnose_q_records_pagination_info={//做题记录的分页信息
    lastKey: 0, quantity: 16
};
/**--------------------- diagnose  end--------------------------**/


/**----------- moreInfo start-------------**/
export let trophy_selected_clazz={};//奖杯排行当前选中的班级
export let trophy_selected_time={};//奖杯排行当前选中的时间
export let clazz_year_with_trophy_rank={};//不同的单元对应的诊断统计
export let fetch_trophy_rank_data_processing=false;//是否正在加载子奖杯排行数据

/**----------- moreInfo end-------------**/


export let eq_selected_chapter={}; //错题集: 选择教材下的章节
export let eq_selected_condition={}; //错题集: 错题信息筛选条件
export let eq_redo_creating_paper={}; //错题集: 班级-单元：正在组合的重练试卷
export let eq_selected_redo_paper={}; //错题集: 选择查看的重练试卷
export let eq_data_with_clazz ={}; //错题集: 班级-单元：错题概况
export let eq_paper_with_clazz ={}; //错题集: 班级-单元：重练试卷

export let mo_selected_clazz = {};//奥数：选择班级
export let mo_clazz_list = [];//奥数班级列表
export let mo_work_list_with_clazz = {};//奥数班级作业列表

export let om_cm_added_stu_list = {}; //已经通过审核的学生信息
export let om_cm_processing = {
    toggle_apply_tunnel_processing: false, //切换班级申请通道
    fetch_added_stu_list_processing : false, //获取审核通过的学生列表
    add_clazz_processing: false, //添加班级
    edit_clazz_info_processing:false, //修改班级信息
    del_stu_processing: false, //删除学生
};
export let sharding_clazz = {}; //需要添加shardingId参数的接口，添加sharding_clazz的id值

//游戏排行
export let fetch_game_star_rank_data_processing = false;//是否正在加载星星排行数据
export let clazz_with_game_star_rank_data = {};//星星排行数据
//速算排行
// export let fetch_fighter_rank_data_processing = false;//是否正在加载斗士排行数据
// export let clazz_with_fighter_rank_data = {};//斗士排行数据

//教师邀请分享信息
export let teacher_share_info = {
    flowStep:0,
};

//教师端的作业诊断报告
export let fetch_stu_work_report_processing = false;
export let stu_work_report = {};
export let knowledge_with_report={};//诊断知识点所对应的诊断报告
export let change_diagnose_report_records_pagination_info={//做题记录的分页信息
    lastKey: 0, quantity: 16
};

export let auto_comment_info={}; //自动评价的评语

export let compose_temp_paper={};//跨单元组卷的临时试题
export let compose_multi_unit_paper={};//跨单元组卷生成的试卷
export let holiday_clazz_list_with_work = {};
export let teacher_credits_detail=0;//教师积分