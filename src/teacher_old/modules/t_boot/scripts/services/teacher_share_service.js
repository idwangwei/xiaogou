/**
 * Created by ww on 2017/5/23.
 */
import BaseService from 'baseComponentForT/base_service';
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';
import {TEACHER_SHARE}  from './../redux/action_typs';
import _pluck from 'lodash.pluck';
import _each from 'lodash.foreach';

@Inject('$http', '$q', '$rootScope', 'serverInterface', 'commonService', "$ngRedux")


class TeacherShareService extends BaseService {
    serverInterface;
    commonService;
    $q;
    $http;

    constructor() {
        super(arguments);
    }

    @actionCreator
    getTeacherShareInfo() {
        return (dispatch,getState)=> {
            let defer = this.$q.defer();
            this.commonService.commonPost(this.serverInterface.GET_TEACHER_SHARE_INFO).then((data)=> {
                if (data && data.code == 200 && data.teacherPopularize) {
                    let result = {detail: data.teacherPopularize.popularize||[], vipTime: data.teacherPopularize.totalTime||0};
                    if(!!result.detail.length){
                        let studentCountArr = _pluck(result.detail,'studentCount');
                        let studentCountArrMax = Math.max(...studentCountArr);

                        result.flowStep = 2;
                        if(studentCountArrMax > 1){
                            result.flowStep = 3
                        }
                        if(studentCountArrMax >= 10){
                            result.flowStep = 4
                        }

                        _each(result.detail, (item)=> {
                            if (item.finishTime) {
                                let time = new Date(item.finishTime);
                                let month = time.getMonth() + 1;
                                let date = time.getDate();
                                month = month > 10 ? month : '0' + month;
                                date = date > 10 ? date : '0' + date;
                                item.finishTime = time.getFullYear() + '-' + month + '-' + date;
                            }
                        });

                        dispatch({
                            type: TEACHER_SHARE.FETCH_DATA_SUCCESS, payload: {
                                shareInfoDetail: result.detail,
                                mineStuVipTime: result.vipTime,
                                flowStep: result.flowStep

                            }
                        });
                    }
                    defer.resolve(true);
                } else {
                    defer.resolve(false)
                }
            }, ()=> {
            });
            return defer.promise;

        };

    }

    @actionCreator
    modifyFlowStep(step){
        return(dispatch)=>{
            dispatch({
                type: TEACHER_SHARE.FETCH_DATA_SUCCESS, payload: {
                    flowStep: step
                }
            });
        }
    }
}

export default TeacherShareService

