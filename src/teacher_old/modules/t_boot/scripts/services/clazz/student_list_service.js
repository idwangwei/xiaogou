/**
 * Created by liangqinli on 2016/11/2.
 */
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';
import {
    STUDENT_LIST_REQUEST,
    STUDENT_LIST_SUCCESS,
    STUDENT_LIST_FAILURE
} from './../../redux/action_typs';

@Inject("$q", "serverInterface", "commonService", '$ngRedux')
class studentListService {

    @actionCreator
    getStudentList(clazzId){
        return (dispatch, getState) => {
            dispatch({type: STUDENT_LIST_REQUEST})
            var params = {
                classId: clazzId
            }
            return this.commonService.commonPost(this.serverInterface.GET_STUDENT_LIST, params).then((data)=>{
                console.log('STUDENT_LIST_DATA:  ', data);
                if(data.code === 200 && data.students.length !== 0){
                    dispatch({type: STUDENT_LIST_SUCCESS, clazzId: clazzId, students: data.students});
                    return data.students;
                }else{
                    dispatch({type: STUDENT_LIST_FAILURE});
                    return false;
                }
            })
        }
    }

}


export default studentListService;