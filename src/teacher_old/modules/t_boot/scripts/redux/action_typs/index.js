export const FETCH_WR_TEXTBOOK_LIST_START = "FETCH_WR_TEXTBOOK_LIST_START";
export const FETCH_WR_TEXTBOOK_LIST_SUCCESS = "FETCH_WR_TEXTBOOK_LIST_SUCCESS";
export const FETCH_WR_TEXTBOOK_LIST_FAIL = "FETCH_WR_TEXTBOOK_LIST_FAIL";

export const FETCH_GR_TEXTBOOK_LIST_START = "FETCH_GR_TEXTBOOK_LIST_START";
export const FETCH_GR_TEXTBOOK_LIST_SUCCESS = "FETCH_GR_TEXTBOOK_LIST_SUCCESS";
export const FETCH_GR_TEXTBOOK_LIST_FAIL = "FETCH_GR_TEXTBOOK_LIST_FAIL";

export const FETCH_TEXTBOOK_DETAIL_START = "FETCH_TEXTBOOK_DETAIL_START";
export const FETCH_TEXTBOOK_DETAIL_SUCCESS = "FETCH_TEXTBOOK_DETAIL_SUCCESS";
export const FETCH_TEXTBOOK_DETAIL_FAIL = "FETCH_TEXTBOOK_DETAIL_FAIL";
export const RESET_FETCH_TEXTBOOK_DETAIL = "RESET_FETCH_TEXTBOOK_DETAIL";
export const FETCH_CHAPTER_GAME_LIST_START = "FETCH_CHAPTER_GAME_LIST_START";
export const FETCH_CHAPTER_GAME_LIST_SUCCESS = "FETCH_CHAPTER_GAME_LIST_SUCCESS";
export const FETCH_CHAPTER_GAME_LIST_FAIL = "FETCH_CHAPTER_GAME_LIST_FAIL";
export const SELECT_TEXTBOOK_WORK = "SELECT_TEXTBOOK_WORK";
export const SELECT_TEXTBOOK_GAME = "SELECT_TEXTBOOK_GAME";
export const SELECT_CHAPTER = "SELECT_CHAPTER";
export const SELECT_UNIT = "SELECT_UNIT";
export const SELECT_KNOWLEDGE = "SELECT_KNOWLEDGE";

export const SELECT_DETAIL_PAPER="SELECT_DETAIL_PAPER"; //选择查看详情的试卷
export const SELECT_EDIT_PAPER="SELECT_EDIT_PAPER"; //选择进行编辑的试卷


export const FETCH_PAPER_CRITERIA_START="FETCH_PAPER_CRITERIA_START"; //获取组卷的标准列表信息
export const FETCH_PAPER_CRITERIA_SUCCESS="FETCH_PAPER_CRITERIA_SUCCESS"; //获取组卷的标准列表信息
export const FETCH_PAPER_CRITERIA_FAIL="FETCH_PAPER_CRITERIA_FAIL"; //获取组卷的标准列表信息

export const FETCH_TEXTBOOK_CHAPTER_START="FETCH_TEXTBOOK_CHAPTER_START"; //获取教材下的章节和单元信息
export const FETCH_TEXTBOOK_CHAPTER_SUCCESS="FETCH_TEXTBOOK_CHAPTER_SUCCESS"; //获取教材下的章节和单元信息
export const FETCH_TEXTBOOK_CHAPTER_FAIL="FETCH_TEXTBOOK_CHAPTER_FAIL"; //获取教材下的章节和单元信息

export const FETCH_PAPER_LIST_START="FETCH_PAPER_LIST_START"; //获取单元下的试卷列表信息
export const FETCH_PAPER_LIST_SUCCESS="FETCH_PAPER_LIST_SUCCESS"; //获取单元下的试卷列表信息
export const FETCH_PAPER_LIST_FAIL="FETCH_PAPER_LIST_FAIL"; //获取单元下的试卷列表信息
export const PAPER_EDIT_LIST_ADD="PAPER_EDIT_LIST_ADD"; //向单元下的编辑试卷列表添加新试卷

export const FETCH_PAPER_DETAIL_START="FETCH_PAPER_DETAIL_START"; //向服务器获取指定的试卷内容
export const FETCH_PAPER_DETAIL_SUCCESS="FETCH_PAPER_DETAIL_SUCCESS"; //向服务器获取指定的试卷内容
export const FETCH_PAPER_DETAIL_FAIL="FETCH_PAPER_DETAIL_FAIL"; //向服务器获取指定的试卷内容

export const FETCH_UNIT_POINTS_START="FETCH_UNIT_POINTS_START"; //向服务器获取指定的单元知识点列表
export const FETCH_UNIT_POINTS_SUCCESS="FETCH_UNIT_POINTS_SUCCESS"; //向服务器获取指定的单元知识点列表
export const FETCH_UNIT_POINTS_FAIL="FETCH_UNIT_POINTS_FAIL"; //向服务器获取指定的单元知识点列表

export const FETCH_MINE_PAPER_LIST_START = "FETCH_MINE_PAPER_LIST_START";//向服务器获取编辑试卷列表
export const FETCH_MINE_PAPER_LIST_SUCCESS = "FETCH_MINE_PAPER_LIST_SUCCESS";//向服务器获取编辑试卷列表
export const FETCH_MINE_PAPER_LIST_FAIL = "FETCH_MINE_PAPER_LIST_FAIL";//向服务器获取编辑试卷列表

export const GEN_PAPER_DATA_START= "GEN_PAPER_DATA_START";//自动组卷
export const GEN_PAPER_DATA_SUCCESS= "GEN_PAPER_DATA_SUCCESS";//自动组卷
export const GEN_PAPER_DATA_FAIL= "GEN_PAPER_DATA_FAIL";//自动组卷

export const MODIFY_MINE_PAPER_START= "MODIFY_MINE_PAPER_START";//更新编辑试卷的内容
export const MODIFY_MINE_PAPER_SUCCESS= "MODIFY_MINE_PAPER_SUCCESS";//更新编辑试卷的内容
export const MODIFY_MINE_PAPER_FAIL= "MODIFY_MINE_PAPER_FAIL";//更新编辑试卷的内容

export const DELETE_SPECIFIED_MINE_PAPER= "DELETE_SPECIFIED_MINE_PAPER";//删除编辑试卷

//game list manage
export const GAMES_LIST_REQUEST = 'GAMES_LIST_REQUEST';  //请求gamelist 开始
export const GAMES_LIST_SUCCESS = 'GAMES_LIST_SUCCESS';  //请求gamelist 成功
export const GAMES_LIST_FAILURE = 'GAMES_LIST_FAILURE';  //请求gamelist 失败
export const DEL_GAME_REQUEST = 'DEL_GAME_REQUEST';      //删除游戏 开始
export const DEL_GAME_SUCCESS = 'DEL_GAME_SUCCESS';      //删除游戏 成功
export const DEL_GAME_FAILURE = 'DEL_GAME_FAILURE';      //删除游戏 失败
export const CLEAR_GAME_LIST = 'CLEAR_GAME_LIST';  //清空游戏列表
export const MOVE_GAME_START = 'MOVE_GAME_START';   //移动游戏项目
export const MOVE_GAME_SUCCESS = 'MOVE_GAME_SUCCESS';
export const MOVE_GAME_FAILURE = 'MOVE_GAME_FAILURE';
export const CHANGE_CLAZZ = 'CHANGE_CLAZZ';        //游戏列表切换班级
export const GAME_STATS_REQUEST = 'GET_GAME_STATS';    //获取游戏状态
export const GAME_STATS_SUCCESS = 'GAME_STATS_SUCCESS';
export const GAME_STATS_FAILURE = 'GAME_STATS_FAILURE';
//export const SORT_GAME_STATS = 'SORT_GAME_STATS';  //对学生游戏状态排序
export const FORCE_GL_UPDATE='FORCE_GL_UPDATE';  //强制游戏列表更新
export const CANCEL_FORCE_GL_UPDATE='CANCEL_FORCE_GL_UPDATE'; //取消强制游戏列表更新flag

export const FETCH_CLAZZ_LIST_START="FETCH_CLAZZ_LIST_START"; //获取班级列表开始
export const FETCH_CLAZZ_LIST_SUCCESS="FETCH_CLAZZ_LIST_SUCCESS"; //获取班级列表成功
export const FETCH_CLAZZ_LIST_FAIL="FETCH_CLAZZ_LIST_FAIL"; //获取班级列表失败

export const FETCH_WORK_LIST_START="FETCH_WORK_LIST_START"; //获取指定班级下的作业列表开始
export const FETCH_WORK_LIST_SUCCESS="FETCH_WORK_LIST_SUCCESS"; //获取指定班级下的作业列表成功
export const FETCH_WORK_LIST_FAIL="FETCH_WORK_LIST_FAIL"; //获取指定班级下的作业列表失败
export const FETCH_AE_WORK_LIST_SUCCESS="FETCH_AE_WORK_LIST_SUCCESS"; //获取首页区域测评作业列表

export const FETCH_STUDY_STATIS = 'FETCH_STUDY_STATIS';       //获取班级学情
export const FETCH_STUDY_STATIS_SUCCESS = 'FETCH_STUDY_STATIS_SUCCESS';
export const FETCH_STUDY_STATIS_FAILURE = 'FETCH_STUDY_STATIS_FAILURE';

export const CHANGE_STUDY_STATIS_PARAMS = 'CHANGE_STUDY_STATIS_PARAMS';//修改store上面的班级学情统计参数

export const SELECT_WORK_CLAZZ="SELECT_WORK_CLAZZ"; //选择作业列表的班级
export const SET_WORK_LIST_PAGE_INFO="SET_WORK_LIST_PAGE_INFO"; //更新发布作业列表分页查询信息
export const DELETE_WORK_ITEM="DELETE_WORK_ITEM";//删除指定的作业
export const SELECT_PUBLISH_WORK="SELECT_PUBLISH_WORK";//选择发布的作业试卷


export const FETCH_STUDENT_LIST_START="FETCH_STUDENT_LIST_START"; //获取该试卷做题状态的学生列表开始
export const FETCH_STUDENT_LIST_SUCCESS="FETCH_STUDENT_LIST_SUCCESS"; //获取该试卷做题状态的学生列表成功
export const FETCH_STUDENT_LIST_FAIL="FETCH_STUDENT_LIST_FAIL"; //获取该试卷做题状态的学生列表失败

export const FETCH_WORK_DATA_START="FETCH_WORK_DATA_START"; //获取该试卷内容开始
export const FETCH_WORK_DATA_SUCCESS="FETCH_WORK_DATA_SUCCESS"; //获取该试卷内容成功
export const FETCH_WORK_DATA_FAIL="FETCH_WORK_DATA_FAIL"; //获取该试卷内容失败

export const FETCH_STATISTICS_ERROR_INFO_START = "FETCH_STATISTICS_ERROR_INFO_START";//获取统计中错误学生信息开始
export const FETCH_STATISTICS_ERROR_INFO_SUCCESS = "FETCH_STATISTICS_ERROR_INFO_SUCCESS";//获取统计中错误学生信息成功
export const FETCH_STATISTICS_ERROR_INFO_FAIL = "FETCH_STATISTICS_ERROR_INFO_FAIL";//获取统计中错误学生信息失败





export const SET_TEACHER_BASE_INFO="SET_TEACHER_BASE_INFO";//保存用户的基本信息

export const MODIFY_TEACHER_BASE_INFO_START="MODIFY_TEACHER_BASE_INFO_START";//保存用户的基本信息开始
export const MODIFY_TEACHER_BASE_INFO_SUCCESS="MODIFY_TEACHER_BASE_INFO_SUCCESS";//保存用户的基本信息成功
export const MODIFY_TEACHER_BASE_INFO_FAIL="MODIFY_TEACHER_BASE_INFO_FAIL";//保存用户的基本信息失败

export const CHANGE_TEACHER_RELEVANCE_CELLPHONE="CHANGE_TEACHER_RELEVANCE_CELLPHONE";//修改关联手机号
export const CHANGE_TEACHER_RELEVANCE_CELLPHONE_START="CHANGE_TEACHER_RELEVANCE_CELLPHONE_START";//修改关联手机号开始
export const CHANGE_TEACHER_RELEVANCE_CELLPHONE_SUCCESS="CHANGE_TEACHER_RELEVANCE_CELLPHONE_SUCCESS";//修改关联手机号成功
export const CHANGE_TEACHER_RELEVANCE_CELLPHONE_FAIL="CHANGE_TEACHER_RELEVANCE_CELLPHONE_FAIL";//修改关联手机号失败

export const FETCH_SECURITY_QUESTION_LIST_START = "FETCH_SECURITY_QUESTION_LIST_START"; //获取密保问题
export const FETCH_SECURITY_QUESTION_LIST_SUCCESS = "FETCH_SECURITY_QUESTION_LIST_SUCCESS";//获取密保问题
export const FETCH_SECURITY_QUESTION_LIST_FAIL = "FETCH_SECURITY_QUESTION_LIST_FAIL";//获取密保问题

export const SET_SECURITY_ANSWER_START = "SET_SECURITY_ANSWER_START";//保存密保答案
export const SET_SECURITY_ANSWER_SUCCESS = "SET_SECURITY_ANSWER_SUCCESS";//保存密保答案
export const SET_SECURITY_ANSWER_FAIL = "SET_SECURITY_ANSWER_FAIL";//保存密保答案


/**--------------------- profile  start--------------------------**/

export const PROFILE_LOGIN_START="PROFILE_LOGIN_START"; //登录开始
export const PROFILE_LOGIN_SUCCESS="PROFILE_LOGIN_SUCCESS"; //登录成功
export const PROFILE_LOGIN_FAIL="PROFILE_LOGIN_FAIL"; //登录失败

export const PROFILE_LOGOUT_START="PROFILE_LOGOUT_START"; //注销开始
export const PROFILE_LOGOUT_SUCCESS="PROFILE_LOGOUT_SUCCESS"; //注销成功
export const PROFILE_LOGOUT_FAIL="PROFILE_LOGOUT_FAIL"; //注销失败

export const PROFILE_CHECK_IS_VALID_SESSION_START="PROFILE_CHECK_IS_VALID_SESSION_START"; //检查session是否有效开始
export const PROFILE_CHECK_IS_VALID_SESSION_SUCCESS="PROFILE_CHECK_IS_VALID_SESSION_SUCCESS"; //检查session是否有效成功
export const PROFILE_CHECK_IS_VALID_SESSION_FAIL="PROFILE_CHECK_IS_VALID_SESSION_FAIL"; //检查session是否有效失败

export const PROFILE_USER_LOGOUT_BY_SELF="PROFILE_USER_LOGOUT_BY_SELF"; //用户主动退出
export const MODIFY_USER_VISITOR="MODIFY_USER_VISITOR"; //更新用户visitor值


/**--------------------- profile  end--------------------------**/

export const MODIFY_STATISTICS_ERROR_INFO="MODIFY_STATISTICS_ERROR_INFO";//更新统计中，当前错题，错题学生信息=======

//切换班级申请通道
export const TOGGLE_CLAZZ_APPLY_TUNNEL_START="TOGGLE_CLAZZ_APPLY_TUNNEL_START"; //切换班级申请通道开始
export const TOGGLE_CLAZZ_APPLY_TUNNEL_SUCCESS="TOGGLE_CLAZZ_APPLY_TUNNEL_SUCCESS"; //切换班级申请通道成功
export const TOGGLE_CLAZZ_APPLY_TUNNEL_FAIL="TOGGLE_CLAZZ_APPLY_TUNNEL_FAIL"; //切换班级申请通道失败

//班级详情
export const  CHANGE_SELECT_CLAZZ_DETAIL_START ="CHANGE_SELECT_CLAZZ_DETAIL_START"; //改变选择的班级开始
export const  CHANGE_SELECT_CLAZZ_DETAIL_SUCCESS ="CHANGE_SELECT_CLAZZ_DETAIL_SUCCESS"; //改变选择的班级开始
export const  CHANGE_SELECT_CLAZZ_DETAIL_FAIL ="CHANGE_SELECT_CLAZZ_DETAIL_FAIL"; //改变选择的班级开始

export const  CHANGE_CLAZZ_INFO_START ="CHANGE_CLAZZ_INFO_START"; //修改班级信息开始
export const  CHANGE_CLAZZ_INFO_SUCCESS ="CHANGE_CLAZZ_INFO_SUCCESS"; //修改班级信息成功
export const  CHANGE_CLAZZ_INFO_FAIL ="CHANGE_CLAZZ_INFO_FAIL"; //修改班级信息失败
export const  SET_ADD_CLAZZ_STATUS = "SET_ADD_CLAZZ_STATUS"; //设置是否是添加班级

export const  ADD_CLAZZ_START ="ADD_CLAZZ_START"; //添加班级信息开始
export const  ADD_CLAZZ_SUCCESS ="ADD_CLAZZ_SUCCESS"; //添加班级信息成功
export const  ADD_CLAZZ_FAIL ="ADD_CLAZZ_FAIL"; //添加班级信息失败

export const  FETCH_ADDING_STU_LIST_START = "FETCH_ADDING_STU_LIST_START"; //获取申请的学生列表开始
export const  FETCH_ADDING_STU_LIST_SUCCESS = "FETCH_ADDING_STU_LIST_SUCCESS"; //获取申请的学生列表成功
export const  FETCH_ADDING_STU_LIST_FAIL = "FETCH_ADDING_STU_LIST_FAIL"; //获取申请的学生列表失败

export const  DEAL_ADD_STU_REQUEST_START = "DEAL_ADD_STU_REQUEST_START"; //处理添加学生的请求开始
export const  DEAL_ADD_STU_REQUEST_SUCCESS = "DEAL_ADD_STU_REQUEST_SUCCESS"; //处理添加学生的请求成功
export const  DEAL_ADD_STU_REQUEST_FAIL = "DEAL_ADD_STU_REQUEST_FAIL"; //处理添加学生的请求失败

export const  FETCH_ADDED_STU_LIST_START = "FETCH_ADDED_STU_LIST_START"; //获取审核通过的学生列表开始
export const  FETCH_ADDED_STU_LIST_SUCCESS = "FETCH_ADDED_STU_LIST_SUCCESS"; //获取审核通过的学生列表成功
export const  FETCH_ADDED_STU_LIST_FAIL = "FETCH_ADDED_STU_LIST_FAIL"; //获取审核通过的学生列表失败

export  const FETCH_STUDENT_DETAIL_START = "FETCH_STUDENT_DETAIL_START"; //获取学生信息详情开始
export  const FETCH_STUDENT_DETAIL_SUCCESS = "FETCH_STUDENT_DETAIL_SUCCESS"; //获取学生信息详情成功
export  const FETCH_STUDENT_DETAIL_FAIL = "FETCH_STUDENT_DETAIL_FAIL"; //获取学生信息详情失败

export  const DELETE_STUDENT_START = "DELETE_STUDENT_START"; //删除学生开始
export  const DELETE_STUDENT_SUCCESS = "DELETE_STUDENT_SUCCESS"; //删除学生成功
export  const DELETE_STUDENT_FAIL = "DELETE_STUDENT_FAIL"; //删除学生失败

export  const CHANGE_STU_LEVEL_LIST = "CHANGE_STU_LEVEL_LIST"; //改变学生分层列表
export  const CHANGE_STU_LEVEL_START = "CHANGE_STU_LEVEL_START"; //改变学生分层开始
export  const CHANGE_STU_LEVEL_SUCCESS = "CHANGE_STU_LEVEL_SUCCESS"; //改变学生分层成功
export  const CHANGE_STU_LEVEL_FAIL = "CHANGE_STU_LEVEL_FAIL"; //改变学生分层失败

export const CHANGE_CLAZZ_LIST_INFO = "CHANGE_CLAZZ_LIST_INFO"; //修改班级列表信息

export const RAPID_CALC_COUNT_REQUEST="RAPID_CALC_COUNT_REQUEST";// 请求速算统计的数据
export const RAPID_CALC_COUNT_SUCCESS="RAPID_CALC_COUNT_SUCCESS"; // 请求速算统计成功
export const RAPID_CALC_COUNT_FAILURE="RAPID_CALC_COUNT_FAILURE"; //请求速算失败
export const RC_CHANGE_CLAZZ = "RC_CHANGE_CLAZZ"; //速算页面切换班级
export const CLEAR_RC_LIST = 'CLEAR_RC_LIST'; //清除速算列表
/**/
/*
 * 获取奥数组卷数据
 * */
export const GET_MATH_PAPER = 'GET_MATH_PAPER';
export const MATH_PAPER_SUCCESS = 'MATH_PAPER_SUCCESS';
export const MATH_PAPER_FAILED = 'MATH_PAPER_FAILED';

export const STUDENT_LIST_REQUEST='STUDENT_LIST_REQUEST'; //请求学生列表
export const STUDENT_LIST_SUCCESS='STUDENT_LIST_SUCCESS'; //请求学生列表成功
export const STUDENT_LIST_FAILURE='STUDENT_LIST_FAILURE'; //请求学生列表失败
/**--------------------- diagnose start--------------------------**/

export  const CHANGE_DIAGNOSE_CLAZZ= 'CHANGE_DIAGNOSE_CLAZZ';//诊断页面改变班级
export  const CHANGE_DIAGNOSE_UNIT="CHANGE_DIAGNOSE_UNIT";        //改变单元选择
export  const RESET_DIAGNOSE_UNIT_STATUS= 'RESET_DIAGNOSE_UNIT_STATUS';             //重置单元选中状态

export  const DIAGNOSE_UNIT_SELECT_STU= 'DIAGNOSE_UNIT_SELECT_STU';             //单元下所选中的学生

export  const FETCH_DIAGNOSE_TEXTBOOK_LIST_START= "FETCH_DIAGNOSE_TEXTBOOK_LIST_START";//获取教材开始
export  const FETCH_DIAGNOSE_TEXTBOOK_LIST_SUCCESS="FETCH_DIAGNOSE_TEXTBOOK_LIST_SUCCESS";//获取教材成功
export  const FETCH_DIAGNOSE_TEXTBOOK_LIST_FAIL= "FETCH_DIAGNOSE_TEXTBOOK_LIST_FAIL";//获取教材失败

export  const SELECT_DIAGNOSE_TEXTBOOK_WORK= 'SELECT_DIAGNOSE_TEXTBOOK_WORK';  //选中其中一本教材
export  const DIAGNOSE_UNIT_SELECT_KNOWLEDGE="DIAGNOSE_UNIT_SELECT_KNOWLEDGE"; //总的诊断页面选择子知识点，查看其诊断信息

export  const FETCH_DIAGNOSE_UNIT_STATISTIC_START="FETCH_DIAGNOSE_UNIT_STATISTIC_START";    //获取个人诊断统计信息开始
export  const FETCH_DIAGNOSE_UNIT_STATISTIC_SUCCESS="FETCH_DIAGNOSE_UNIT_STATISTIC_SUCCESS";    //获取个人诊断统计信息成功
export  const FETCH_DIAGNOSE_UNIT_STATISTIC_FAIL="FETCH_DIAGNOSE_UNIT_STATISTIC_FAIL";     //获取个人诊断统计信息失败


export  const FETCH_STUDENT_DIAGNOSE_STATISTIC_START="FETCH_STUDENT_DIAGNOSE_STATISTIC_START";    //获取某个学生诊断统计信息开始
export  const FETCH_STUDENT_DIAGNOSE_STATISTIC_SUCCESS="FETCH_STUDENT_DIAGNOSE_STATISTIC_SUCCESS";    //获取某个学生诊断统计信息成功
export  const FETCH_STUDENT_DIAGNOSE_STATISTIC_FAIL="FETCH_STUDENT_DIAGNOSE_STATISTIC_FAIL";     //获取某个学生诊断统计信息失败


export  const FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_START="FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_START";//获取子得分点诊断统计信息开始
export  const FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_SUCCESS= "FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_SUCCESS";//获取子得分点诊断统计信息成功
export  const FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_FAIL= "FETCH_DIAGNOSE_UNIT_KNOWLEDGE_STATI_FAIL";    //获取子得分点诊断统计信息失败

export  const DIAGNOSE_KNOWLEDGE_SELECT_STU="DIAGNOSE_KNOWLEDGE_SELECT_STU"; //班级诊断页面选中的学生

export  const FETCH_DIAGNOSE_Q_RECORDS_START= "FETCH_DIAGNOSE_Q_RECORDS_START";//获取做题记录开始
export  const FETCH_DIAGNOSE_Q_RECORDS_SUCCESS= "FETCH_DIAGNOSE_Q_RECORDS_SUCCESS";//获取做题记录成功
export  const FETCH_DIAGNOSE_Q_RECORDS_FAIL= "FETCH_DIAGNOSE_Q_RECORDS_FAIL";   //获取做题记录失败

export  const CHANGE_DIAGNOSE_Q_RECORDS_PAGINATION_INFO= "CHANGE_DIAGNOSE_Q_RECORDS_PAGINATION_INFO";//变更做题记录的分页信息

/**--------------------- diagnose  end--------------------------**/


/**--------------------- moreInfo start--------------------------**/

export  const  TROPHY_CHANGE_CLAZZ = 'TROPHY_CHANGE_CLAZZ';//奖杯排行页面改变班级
export  const  FETCH_TROPHY_RANK_START = 'FETCH_TROPHY_RANK_START';
export  const  FETCH_TROPHY_RANK_SUCCESS = 'FETCH_TROPHY_RANK_SUCCESS';
export  const  FETCH_TROPHY_RANK_FAIL = 'FETCH_TROPHY_RANK_FAIL';
export  const  TROPHY_CHANGE_TIME = 'TROPHY_CHANGE_TIME';//奖杯排行页面改变选择时间

/**--------------------- moreInfo end--------------------------**/

export const EQ_SELECT_CHAPTER = 'EQ_SELECT_CHAPTER';//错题集选中显示的教材章节
export const EQ_SELECT_CONDITION = 'EQ_SELECT_CONDITION';//错题集选筛选条件
export const MODIFY_EQ_CREATING_PAPER_ADD = 'MODIFY_EQ_CREATING_PAPER_ADD';//错题集 班级-单元: 正在组卷的试卷添加小题
export const MODIFY_EQ_CREATING_PAPER_REMOVE = 'MODIFY_EQ_CREATING_PAPER_REMOVE';//错题集 班级-单元: 正在组卷的试卷移除小题
export const MODIFY_EQ_CREATING_PAPER_CLEAR = 'MODIFY_EQ_CREATING_PAPER_CLEAR';//错题集 班级-单元: 正在组卷的试卷清空小题
export const EQ_SELECTED_REDO_PAPER = 'EQ_SELECTED_REDO_PAPER';//错题集 选择查看的重练试卷
export const MODIFY_EQ_ERROR_DATA = 'MODIFY_EQ_ERROR_DATA';//错题集 更新本地班级-单元：错题概况

export const MODIFY_EQ_ERROR_PAPER  = 'MODIFY_EQ_ERROR_PAPER';//错题集 更新本地班级-单元：重练试卷列表

export const SELECT_MATH_OLY_CLAZZ  = 'SELECT_MATH_OLY_CLAZZ';//奥数选择班级
export const FETCH_MATH_OLY_WORK_LIST_SUCCESS  = 'FETCH_MATH_OLY_WORK_LIST_SUCCESS';//获取奥数作业列表
export const DELETE_MATH_OLY_WORK = 'DELETE_MATH_OLY_WORK';//删除奥数作业

/**--------------------奥数班级管理-----------------------------**/
export  const OM_CLAZZ_MANAGER = {
    //切换申请通道
    OM_TOGGLE_CLAZZ_APPLY_TUNNEL_START: "OM_TOGGLE_CLAZZ_APPLY_TUNNEL_START", //切换班级申请通道
    OM_TOGGLE_CLAZZ_APPLY_TUNNEL_SUCCESS: "OM_TOGGLE_CLAZZ_APPLY_TUNNEL_SUCCESS", //切换班级申请通道
    OM_TOGGLE_CLAZZ_APPLY_TUNNEL_FAIL: "OM_TOGGLE_CLAZZ_APPLY_TUNNEL_FAIL", //切换班级申请通道
    //获取学生列表
    OM_GET_ADD_STU_LIST_START:"OM_GET_ADD_STU_LIST_START",
    OM_GET_ADD_STU_LIST_SUCCESS:"OM_GET_ADD_STU_LIST_SUCCESS",
    OM_GET_ADD_STU_LIST_FAIL:"OM_GET_ADD_STU_LIST_FAIL",
    OM_CHANGE_STU_LIST_LEVEL_START :"OM_CHANGE_STU_LIST_LEVEL_START", //修改学生层级
    OM_CHANGE_STU_LIST_LEVEL_SUCCESS :"OM_CHANGE_STU_LIST_LEVEL_SUCCESS", //修改学生层级
    OM_CHANGE_STU_LIST_LEVEL_FAIL :"OM_CHANGE_STU_LIST_LEVEL_FAIL", //修改学生层级
    //添加班级
    OM_ADD_CLAZZ_START:"OM_ADD_CLAZZ_START",
    OM_ADD_CLAZZ_SUCCESS:"OM_ADD_CLAZZ_SUCCESS",
    OM_ADD_CLAZZ_FAIL:"OM_ADD_CLAZZ_FAIL",
    //修改班级
    OM_EDIT_CLAZZ_START:"OM_EDIT_CLAZZ_START",
    OM_EDIT_CLAZZ_SUCCESS:"OM_EDIT_CLAZZ_SUCCESS",
    OM_EDIT_CLAZZ_FAIL:"OM_EDIT_CLAZZ_FAIL",
    //删除学生
    OM_DELETE_STU_START:"OM_DELETE_STU_START",
    OM_DELETE_STU_SUCCESS:"OM_DELETE_STU_SUCCESS",
    OM_DELETE_STU_FAIL:"OM_DELETE_STU_FAIL",


};
/**
 * 游戏星星排行
 * @type {{}}
 */
export const GAME_STAR_RANK = {
    FETCH_GAME_STAR_RANK_DATA_START:'fetch_game_star_rank_data_start', //开始获取数据
    FETCH_GAME_STAR_RANK_DATA_SUCCESS:'fetch_game_star_rank_data_success', //获取数据成功
    FETCH_GAME_STAR_RANK_DATA_FAIL:'fetch_game_star_rank_data_fail', //获取数据失败
    // SELECT_GAME_STAR_RANK_CLAZZ:'select_game_star_rank_clazz', //选择星星排行的班级
};
/**
 * 斗士排行
 * @type {{}}
 */
export const FIGHTER_RANK = {
    FETCH_FIGHTER_RANK_DATA_START:'fetch_fighter_rank_data_start', //开始获取数据
    FETCH_FIGHTER_RANK_DATA_SUCCESS:'fetch_fighter_rank_data_success', //获取数据成功
    FETCH_FIGHTER_RANK_DATA_FAIL:'fetch_fighter_rank_data_fail', //获取数据失败
    // SELECT_FIGHTER_RANK_CLAZZ:'select_fighter_rank_clazz', //选择斗士排行的班级
};

export const TEACHER_SHARE={
    FETCH_DATA_START:'fetch_data_start',
    FETCH_DATA_FAIL:'fetch_data_fail',
    FETCH_DATA_SUCCESS:'fetch_data_success'
};

export const STU_WORK_REPORT ={
    FETCH_DATA_REPORT_START:'fetch_data_report_start',
    FETCH_DATA_REPORT_FAIL:'fetch_data_report_fail',
    FETCH_DATA_REPORT_SUCCESS:'fetch_data_report_success',
    FETCH_DIAGNOSE_REPORT_START:'fetch_diagnose_report_start',
    FETCH_DIAGNOSE_REPORT_SUCCESS:'fetch_diagnose_report_success',
    FETCH_DIAGNOSE_REPORT_FAIL:'fetch_diagnose_report_fail',
    CHANGE_DIAGNOSE_REPORT_RECORDS_PAGINATION_INFO:'change_diagnose_report_records_pagination_info',
};

export const SAVE_AUTO_COMMENT = 'SAVE_AUTO_COMMENT';

//跨单元组卷
export const PUB_WORK_DIFF_UNIT={
    FETCH_TEMP_PAPER_QUES_START:'fetch_temp_paper_ques_start',
    FETCH_TEMP_PAPER_QUES_FAIL:'fetch_temp_paper_ques_fail',
    FETCH_TEMP_PAPER_QUES_SUCCESS:'fetch_temp_paper_ques_success',
    CHANGE_PAPER_SET_PARAMS:'change_paper_set_params',//修改试卷设置信息（每单元选择题数，难以成都修改）
    CHANGE_PAPER_NAME:'change_paper_name',//修改试卷名
    PUBLISH_TEMP_PAPER_SUCCESS:'publish_temp_paper_success',//作业发布成功

    COMPOSE_MULTI_UNIT_PAPER_START:'compose_multi_unit_paper_start', //组卷开始
    COMPOSE_MULTI_UNIT_PAPER_FAIL:'compose_multi_unit_paper_fail', //组卷失败
    COMPOSE_MULTI_UNIT_PAPER_SUCCESS:'compose_multi_unit_paper_success',//组卷成功
};

//寒假作业
export const FETCH_HOLIDAY_WORK_LIST_SUCCESS = 'FETCH_HOLIDAY_WORK_LIST_SUCCESS';

//教师端积分相关
export const CREDITS_DETAIL = {
    FETCH_CREDITS_DETAIL_START: "FETCH_CREDITS_DETAIL_START",//获取积分开始
    FETCH_CREDITS_DETAIL_SUCCESS: "FETCH_CREDITS_DETAIL_SUCCESS",//获取积分成功
    FETCH_CREDITS_DETAIL_FAIL: "FETCH_CREDITS_DETAIL_FAIL",//获取积分失败
};