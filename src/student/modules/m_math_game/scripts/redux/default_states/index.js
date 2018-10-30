/**
 * Created by qiyuexi on 2018/1/5.
 */
export let game_list = {
    isCheckGameCanPlayProcessing: false,//是否正在检查某个游戏可以玩
    isFetchGameListProcessing: false,   //是否正在加载游戏列表
    isFetchLevelListProcessing: false,  //是否正在加载关卡列表
    isFetchClazzProcessing: false,     //正在加载游戏列表
    selectedClazz: {}, //已选择的班级
    selectedGame: null, //已选择的游戏
    clazzListWithGames: {},//
    paginationInfo: {seq: 0, needDataNum: 20},
    maxItemPerPage: 20,
    returnGamelength: null,    //返回的数据条数，用来作为判断是否继续加载的依据
    reSelectClazz: false,
    errorInfo: null,
    groupByMonth: []  //游戏列表分月信息
};