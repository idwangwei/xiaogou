/**
 * Created by WL on 2017/9/5.
 */
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';
import {
    FETCH_ORAL_CALCULATION_PAPER_START,
    FETCH_ORAL_CALCULATION_PAPER_SUCCESS,
    FETCH_ORAL_CALCULATION_PAPER_FAIL,
    ORAL_CALCULATION_WORK_LIST_SELECT_WORK,
    ORAL_CALCULATION
} from './../redux/action_types';


@Inject('$q', '$rootScope', '$http', 'commonService', '$ngRedux', '$state', 'oralCalculationInterface',)
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