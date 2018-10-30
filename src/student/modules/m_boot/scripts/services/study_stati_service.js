import services from  './index';
import BaseService from 'base_components/base_service';
import {STUDY_STATI} from './../redux/actiontypes/actiontypes';
class StudyStatiService extends BaseService {
    constructor() {
        super(arguments);
    }

    changeStudyStatisParams(clazzId,selectedTime,selectedType){
        let selectedParams=selectedTime+'#'+selectedType;
        return (dispatch, getState) =>{
            dispatch({type: STUDY_STATI.CHANGE_STUDY_STATIS_PARAMS, payload: {clazzId:clazzId,selectedParams:selectedParams}});
        }
    }

    fetchStudyStati(clazzId,loadCallback,selectedTime,selectedType) {
        loadCallback=loadCallback?loadCallback:angular.noop;
        let commonService = this.commonService;
        let params={
            classId: clazzId,
            type:selectedType
        };
        if(selectedTime&&selectedTime.indexOf('-')>-1) {
            let startTime=selectedTime.split('-')[0];
            let endTime=selectedTime.split('-')[1];
            params.startTime=startTime;
            params.endTime=endTime;
        }
        return dispatch=> {
            dispatch({type: STUDY_STATI.FETCH_STUDY_STATI_START});
            commonService
                .commonPost(this.serverInterface.GET_CLAZZ_STUDY_STATISC_NEW, params)
                .then(data=> {
                    if (data.code == 200) {
                        dispatch({
                            type: STUDY_STATI.FETCH_STUDY_STATI_SUCCESS, payload: {
                                clazzId: clazzId,
                                studyStati: data.list,
                                workNum: data.workNum
                            }
                        });
                    } else {
                        dispatch({type: STUDY_STATI.FETCH_STUDY_STATI_FAIL, payload: data});
                    }
                    loadCallback();
                });
        }
    }
}
StudyStatiService.$inject = ["serverInterface", "commonService"];
services.service('studyStatiService', StudyStatiService);