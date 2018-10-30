/**
 * Created by 彭建伦 on 2016/8/1.
 */
import {
    FETCH_GR_TEXTBOOK_LIST_START,
    FETCH_GR_TEXTBOOK_LIST_SUCCESS,
    FETCH_GR_TEXTBOOK_LIST_FAIL,
    SELECT_TEXTBOOK_GAME,
    SELECT_CHAPTER,
    FETCH_TEXTBOOK_DETAIL_START,
    FETCH_TEXTBOOK_DETAIL_SUCCESS,
    FETCH_TEXTBOOK_DETAIL_FAIL,
    FETCH_CHAPTER_GAME_LIST_START,
    FETCH_CHAPTER_GAME_LIST_SUCCESS,
    FETCH_CHAPTER_GAME_LIST_FAIL,
    RESET_FETCH_TEXTBOOK_DETAIL
} from "./../../redux/action_typs/index";
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';

@Inject("$http","$q", "serverInterface", "commonService","finalData", "$ngRedux")
class GameRepoService{
    game = null; //暂时作为game_pub_ctrl中发布的game数据来源

    constructor() {}

    /**
     * 获取教材里列表
     * @returns {function(*, *)}
     */
    @actionCreator
    fetchTextbooks() {
        return (dispatch,getState)=> {
            let defer = this.$q.defer();
            let selectClazz = getState().gl_selected_clazz;
            dispatch({type: FETCH_GR_TEXTBOOK_LIST_START});
            this.commonService
                .commonPost(this.serverInterface.GET_GAME_INIT)
                .then(data=> {
                    if (data.code == 200 && data.tbs) {
                        dispatch({type: FETCH_GR_TEXTBOOK_LIST_SUCCESS, payload: data.tbs.filter((v)=>{return v.type.match(selectClazz.type)})});
                        defer.resolve(data);
                    }
                    else if(data.code == 2015){
                        dispatch({type: FETCH_GR_TEXTBOOK_LIST_SUCCESS, payload: []});
                        dispatch({type: SELECT_TEXTBOOK_GAME, payload: {}});
                        dispatch({type: RESET_FETCH_TEXTBOOK_DETAIL, payload: {id:selectClazz.id}});
                        defer.resolve(data);
                    }
                    else {
                        dispatch({type: FETCH_GR_TEXTBOOK_LIST_FAIL, payload: data});
                        defer.resolve(data);
                    }
                });

            return defer.promise;
        }
    }

    /**
     * 获取教材的内容
     * @param id 教材ID
     */
    @actionCreator
    fetchTextbookDetail(id) {
        let defer = this.$q.defer();

        return dispatch=> {
            dispatch({type: FETCH_TEXTBOOK_DETAIL_START});
            this.commonService
                .commonPost(this.serverInterface.GR_GET_TEXTBOOK_DETAIL, {id: id, deep: 2})
                .then(data=> {
                    if (data.code == 200) {
                        dispatch({type: FETCH_TEXTBOOK_DETAIL_SUCCESS, payload: {data: data.textbookTree, id: id}})
                        defer.resolve(data);
                    } else {
                        dispatch({type: FETCH_TEXTBOOK_DETAIL_FAIL, payload: {id: id}});
                        defer.reject(data);
                    }
                });

            return defer.promise;
        }
    }

    /**
     * 获取单元或某个章节下的游戏列表
     * @param chapterId
     */
    fetchChapterGameList(chapterId) {
        return dispatch=> {
            let defer = this.$q.defer();
            dispatch({type: FETCH_CHAPTER_GAME_LIST_START});
            this.commonService
                .commonPost(this.serverInterface.GT_GET_UNIT_GAME_LIST, {tbId: chapterId})
                .then(data=> {
                    if (data.code == 200) {
                        dispatch({
                            type: FETCH_CHAPTER_GAME_LIST_SUCCESS,
                            payload: {list: data.games ||[], id: chapterId}
                        });
                        defer.resolve(true);
                    }
                    else {
                        dispatch({type: FETCH_CHAPTER_GAME_LIST_FAIL, payload: {data: data}});
                        defer.resolve(false);
                    }
                }
            );

            return defer.promise;
        }
    }


    /**
     * 选择教材
     * @param textbook 被选中的教材
     */
    @actionCreator
    selectTextBook(textbook) {
        return dispatch=>dispatch({type: SELECT_TEXTBOOK_GAME, payload: textbook});
    }

    /**
     * 选择章节
     * @param chapter 被选中的章节
     */
    @actionCreator
    selectChapter(chapter) {
        return dispatch=>dispatch({type: SELECT_CHAPTER, payload: chapter});
    }


    /**
     * 获取cgcId
     * @param gameGuid 游戏id
     */
    getGameCgcId(gameGuid) {
        var defer = this.$q.defer();
        this.commonService.commonPost(this.serverInterface.GET_GAME_CGCID, {gameGuid: gameGuid}).then(function (data) {
            if (data) {
                return defer.resolve({
                    cgcId :data.cgcId,
                    cgceId :data.cgceId
                });
            }
            return defer.resolve(false);
        });

        return defer.promise;
    }

    getGameNum(gameGuid){
        if(gameGuid=="aa1" ||gameGuid=="aa2" ||gameGuid=="aa3" ||gameGuid=="aa4"){
            return 11;
        }

        var reg=new RegExp(gameGuid+"([^\\d]|$)");
        for(var key in this.finalData.GAME_NUM){
            for(var i=0;i<this.finalData.GAME_NUM[key].length;i++){
                if(this.finalData.GAME_NUM[key][i].match(reg)){
                    return +key;
                }
            }
        }
        console.log("没有找到"+gameGuid);
    }

}
export  default  GameRepoService;
