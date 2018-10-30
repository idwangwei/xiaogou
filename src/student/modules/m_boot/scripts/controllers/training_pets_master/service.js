/**
 * Created by liangqinli on 2017/1/11.
 */
import services from  '../../services/index';
import BaseService from 'base_components/base_service';
import {GET_TRAINING_PETS_MASTER_START, TRAINING_PETS_MASTER_SUCCESS, TRAINING_PETS_MASTER_FAILED}
    from '../../redux/actiontypes/actiontypes'

class TrainingPetsMasterService extends BaseService {

    constructor() {
        super(arguments);
    }
    getInfoData( params ){
        return (dispatch, getState) => {
            dispatch({type: GET_TRAINING_PETS_MASTER_START})
            try{
                var diagnose_selected_clazz_id = getState().diagnose_selected_clazz.id
                if(diagnose_selected_clazz_id){
                   params.classId = diagnose_selected_clazz_id;
                }else{
                    var allClazz = getState().profile_clazz.clazzList;
                    if(allClazz && allClazz.length !== 0){
                        var selfStudyClazz = allClazz.find(item => item.type === 900);
                        var normalStudyClazz = allClazz.find(item => item.type === 100);
                        if(selfStudyClazz){
                            params.classId = selfStudyClazz.id;
                        }else{
                            params.classId = normalStudyClazz.id;
                        }
                    }
                }
            }catch(err){
                console.error(err);
                return;
            }
            console.log(this.commonService)
            return this.commonService.commonPost(this.serverInterface.GET_TRAINING_PETS_MASTER, params).then( data => {
                 if(data.code === 200){
                     dispatch({type: TRAINING_PETS_MASTER_SUCCESS});
                     return data;
                 }else{
                     return false;
                 }
            })
        }
    }

}

TrainingPetsMasterService.$inject = ['$http', '$q', '$rootScope',  'serverInterface', 'commonService', "$ngRedux"];
services.service('trainingPetsMasterService', TrainingPetsMasterService);