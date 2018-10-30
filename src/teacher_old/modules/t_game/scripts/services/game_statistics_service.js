/**
 * Author 华海川 on 2015/11/5.
 * @description  游戏统计service
 */
import {GAME_STATS_REQUEST, GAME_STATS_SUCCESS, GAME_STATS_FAILURE} from '../../../t_boot/scripts/redux/action_typs';
import underscore from 'underscore';
import {Service, Inject, actionCreator} from '../module';
@Service('gameStatisticsService')
@Inject('$q', 'serverInterface', 'commonService', '$ngRedux')
class gameStatisticsService {
    serverInterface;
    commonService;
    $q;

    data = {tabTitle: [], tabData: []};
    pubGame = {publicId: '', classId: '', levelGuid: '', gameName: '', kdName: '', levelNum: '', className: ''}; //一个已发布游戏相关信息
    clazzOrStu = '';  //查看错误统计 1代表班级 2代表学生
    student = {id: '', name: ''};    //学生id
    errorStats = {tabTitle: [], tabData: [], total: {}};   //错误统计
    levelModalData = null;

    /**
     * 获取游戏统计
     */
    @actionCreator
    getGameStats() {
        var params = {
            publicId: this.pubGame.publicId,
            classId: this.pubGame.classId,
            levelGuid: this.pubGame.levelGuid
        };
        return (dispatch, getState) => {
            dispatch({type: GAME_STATS_REQUEST});
            return this.commonService.commonPost(this.serverInterface.GET_GAME_STATS, params).then((data)=> {
                console.log('data.data:  ', data.data);
                console.log('data: ', data);
                if (data.code == '200') {
                    this.data.tabData = data.data.tabData;
                    this.data.total = data.data.total;
                    this.data.tabTitle = [];
                    data.data.tabTitle.forEach((item) => {
                        if (item.key != "balanceTime") {
                            this.data.tabTitle.push(item);
                        }
                    });
                    this.setOrder({data: this.data});
                    dispatch({type: GAME_STATS_SUCCESS, data: this.data});
                    return true;
                } else {
                    dispatch({type: GAME_STATS_FAILURE});
                    return false;
                }
            });
        }
    };

    /**
     * 获取班级关卡错误统计
     * @param levelGuid  关卡id
     */
    getErrorByClazz() {
        var params = {
            classId: this.pubGame.classId,
            publicId: this.pubGame.publicId,
            levelGuid: this.pubGame.levelGuid
        };
        var defer = this.$q.defer();
        this.commonService.commonPost(this.serverInterface.GET_ERROR_BYCLASS, params).then((data)=> {
            if (data) {
                this.errorStats.tabTitle = data.data.tabTitle;
                this.errorStats.tabData = data.data.tabData;
                this.errorStats.total = data.data.total;
            }
            defer.resolve(true);
        });
        return defer.promise;
    };

    /**
     * 获取个人错误统计
     * @param studentId 学生id
     */
    getErrorByStu() {
        var params = {
            studentId: this.student.id,
            publicId: this.pubGame.publicId,
            levelGuid: this.pubGame.levelGuid
        }
        var defer = this.$q.defer();
        this.commonService.commonPost(this.serverInterface.GET_ERROR_BYSTU, params).then((data)=> {
            if (data) {
                this.errorStats.tabTitle = data.data.tabTitle;
                this.errorStats.tabData = data.data.tabData;
                this.errorStats.total = data.data.total;
            }
            defer.resolve(true);
        });
        return defer.promise;
    }

//给游戏情况列表排序
    setOrder(action) {  //设置排序
        var a = [];
        var b = [];
        var name = action.name || 'order';
        var asc = action.asc || true;
        var data = action.data;
        //var $scope = this.getScope();
        data.tabData.forEach((item) => {
            if (typeof(item.errorTimes) == 'string' && item.errorTimes.match(/^\d+$/g)) {         //保证排序字段是整形
                item.errorTimes = parseInt(item.errorTimes);
            }
            if (typeof(item.order) == 'string' && item.order.match(/^\d+$/g)) {
                item.order = parseInt(item.order);
            }
            if (typeof(item.totalGameTime) == 'string' && item.totalGameTime.match(/^\d+$/g)) {
                item.totalGameTime = parseInt(item.totalGameTime);
            }
            if (typeof(item[name]) == 'string') {
                b.push(item);
            } else {
                a.push(item);
            }
        });
        a = underscore.sortBy(a, name); //按升序排列
        if (!asc) {            //按降序排序
            a.reverse();
        }
        // data.tabData = a.concat(b);
        return a.concat(b);
    }
}
export default gameStatisticsService;