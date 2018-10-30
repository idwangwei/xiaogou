/**
 * Created by WL on 2017/9/5.
 */
import {Service, actionCreator} from './../../module';
import {
    ORAL_CALCULATION_WORK_LIST_SELECT_WORK,
} from './../redux/action_types';


@Service('oralCalculationPaperServer', {
    inject: ['$q', '$rootScope', '$http', 'commonService', '$ngRedux', '$state']
})
class oralCalculationPaperServer {
    commonService;
    gameMapInterface;
    userName;
    answerInputBoxList;

    @actionCreator
    selectOralPaper(work) {
        return (dispatch) => {
            dispatch({type: ORAL_CALCULATION_WORK_LIST_SELECT_WORK, payload: work});
        }
    }

    setAnswerInputBoxList(answerInputBoxList) {
        this.answerInputBoxList = answerInputBoxList
    }

    getAnswerInputBoxList() {
        return this.answerInputBoxList;
    }
}


export default oralCalculationPaperServer;